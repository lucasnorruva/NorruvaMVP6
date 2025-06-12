
import { expect } from "chai";
import { ethers, upgrades, network } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Adjust import paths if your typechain output directory is different
import type {
  NORUToken,
  TimelockControllerUpgradeable,
  DPPGovernor,
  DPPGovernorV2, // Assuming a V2 for upgrade testing
  SimpleTarget,
} from "../typechain-types";

describe("DPPGovernor", function () {
  let noruToken: NORUToken;
  let timelock: TimelockControllerUpgradeable;
  let governor: DPPGovernor;
  let targetContract: SimpleTarget;

  let owner: SignerWithAddress;
  let proposer: SignerWithAddress;
  let voter1: SignerWithAddress;
  let voter2: SignerWithAddress;
  let voter3: SignerWithAddress;
  let otherUser: SignerWithAddress;

  const TOKEN_NAME = "Norruva Governance Token";
  const TOKEN_SYMBOL = "NORU";
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1 million NORU

  const TIMELOCK_MIN_DELAY = 3600; // 1 hour (for testing, can be shorter in local dev)
  const GOVERNOR_NAME = "Norruva DPP DAO Governor";

  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const EXECUTOR_ROLE = ethers.id("EXECUTOR_ROLE");
  const CANCELLER_ROLE = ethers.id("CANCELLER_ROLE");
  const TIMELOCK_ADMIN_ROLE = ethers.id("TIMELOCK_ADMIN_ROLE");

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3, otherUser] = await ethers.getSigners();

    // Deploy NORUToken
    const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
    noruToken = (await upgrades.deployProxy(
      NORUTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address, INITIAL_SUPPLY],
      { initializer: "initialize", kind: "uups" }
    )) as unknown as NORUToken;
    await noruToken.waitForDeployment();

    // Distribute tokens and delegate votes
    const voteAmount = ethers.parseUnits("100", 18); // 100 NORU
    await noruToken.connect(owner).transfer(proposer.address, voteAmount);
    await noruToken.connect(owner).transfer(voter1.address, voteAmount);
    await noruToken.connect(owner).transfer(voter2.address, voteAmount);
    await noruToken.connect(owner).transfer(voter3.address, voteAmount);

    await noruToken.connect(proposer).delegate(proposer.address);
    await noruToken.connect(voter1).delegate(voter1.address);
    await noruToken.connect(voter2).delegate(voter2.address);
    await noruToken.connect(voter3).delegate(voter3.address);

    // Deploy TimelockController
    const TimelockFactory = await ethers.getContractFactory("TimelockControllerUpgradeable");
    timelock = (await upgrades.deployProxy(
      TimelockFactory,
      [TIMELOCK_MIN_DELAY, [], [], owner.address], // proposers, executors, admin
      { kind: "uups", initializer: "initialize" } // Explicitly call initialize
    )) as unknown as TimelockControllerUpgradeable;
    await timelock.waitForDeployment();

    // Deploy DPPGovernor
    const GovernorFactory = await ethers.getContractFactory("DPPGovernor");
    governor = (await upgrades.deployProxy(
      GovernorFactory,
      [await noruToken.getAddress(), await timelock.getAddress(), GOVERNOR_NAME],
      { initializer: "initialize", kind: "uups" }
    )) as unknown as DPPGovernor;
    await governor.waitForDeployment();

    // Configure Timelock roles
    // Governor is PROPOSER and CANCELLER
    // EXECUTOR_ROLE for address(0) means anyone can execute a passed proposal
    await timelock.connect(owner).grantRole(PROPOSER_ROLE, await governor.getAddress());
    await timelock.connect(owner).grantRole(CANCELLER_ROLE, await governor.getAddress());
    await timelock.connect(owner).grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
    // Grant TIMELOCK_ADMIN_ROLE to Governor, then owner renounces it.
    await timelock.connect(owner).grantRole(TIMELOCK_ADMIN_ROLE, await governor.getAddress());
    await timelock.connect(owner).renounceRole(TIMELOCK_ADMIN_ROLE, owner.address);


    // Deploy SimpleTarget contract and transfer ownership to Timelock
    const SimpleTargetFactory = await ethers.getContractFactory("SimpleTarget");
    targetContract = await SimpleTargetFactory.deploy(owner.address); // Deployer is initial owner
    await targetContract.waitForDeployment();
    await targetContract.connect(owner).transferOwnership(await timelock.getAddress()); // Transfer to Timelock
  });

  describe("Deployment & Configuration", function () {
    it("Should have correct token, timelock, and name", async function () {
      expect(await governor.token()).to.equal(await noruToken.getAddress());
      expect(await governor.timelock()).to.equal(await timelock.getAddress());
      expect(await governor.name()).to.equal(GOVERNOR_NAME);
    });

    it("TimelockController should have Governor as Proposer, Canceller, Admin and address(0) as Executor", async function () {
      expect(await timelock.hasRole(PROPOSER_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(CANCELLER_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(EXECUTOR_ROLE, ethers.ZeroAddress)).to.be.true;
      expect(await timelock.hasRole(TIMELOCK_ADMIN_ROLE, await governor.getAddress())).to.be.true;
      expect(await timelock.hasRole(TIMELOCK_ADMIN_ROLE, owner.address)).to.be.false; // Owner renounced
    });

    it("TargetContract should be owned by Timelock", async function () {
        expect(await targetContract.owner()).to.equal(await timelock.getAddress());
    });
  });

  describe("Proposal Lifecycle", function () {
    it("Should allow proposal creation, voting, queuing, and execution", async function () {
      const newValue = 777;
      const proposalDescription = "Proposal #1: Set SimpleTarget value to 777";
      const proposalDescriptionHash = ethers.id(proposalDescription); // For event checking

      // Encode the function call to targetContract.setValue(newValue)
      const calldata = targetContract.interface.encodeFunctionData("setValue", [newValue]);
      
      // 1. Create Proposal
      const proposeTx = await governor
        .connect(proposer)
        .propose([await targetContract.getAddress()], [0], [calldata], proposalDescription);
      const receipt = await proposeTx.wait();
      
      let proposalId: any;
      if (receipt && receipt.logs) {
         const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      // Wait for voting delay (1 block in default Governor settings)
      await network.provider.send("evm_mine"); 
      expect(await governor.state(proposalId)).to.equal(1); // Active

      // 2. Vote
      await governor.connect(voter1).castVote(proposalId, 1); // For
      await governor.connect(voter2).castVote(proposalId, 1); // For
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      await governor.connect(proposer).castVote(proposalId, 1); // For

      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(proposalId)).to.equal(4); // Succeeded

      // 3. Queue Proposal
      const queueTx = await governor.connect(proposer).queue([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash);
      await queueTx.wait();
      expect(await governor.state(proposalId)).to.equal(5); // Queued

      // Fast-forward past timelock delay
      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      // 4. Execute Proposal
      const executeTx = await governor.connect(proposer).execute([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash);
      await executeTx.wait();
      expect(await governor.state(proposalId)).to.equal(7); // Executed

      // Verify the action on SimpleTarget
      expect(await targetContract.value()).to.equal(newValue);
      expect(await targetContract.lastAction()).to.equal("setValue");
    });

    it("Should handle a proposal that fails due to insufficient 'For' votes", async function () {
      const proposalDescription = "Proposal #Fail: This proposal should be defeated";
      const proposalDescriptionHash = ethers.id(proposalDescription);
      const calldata = targetContract.interface.encodeFunctionData("setValue", [100]); 

      const proposeTx = await governor
        .connect(proposer)
        .propose([await targetContract.getAddress()], [0], [calldata], proposalDescription);
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
        const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
        if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      await network.provider.send("evm_mine");
      expect(await governor.state(proposalId)).to.equal(1); // Active

      await governor.connect(voter1).castVote(proposalId, 0); // Against
      await governor.connect(voter2).castVote(proposalId, 0); // Against
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      await governor.connect(proposer).castVote(proposalId, 1); // For
      
      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      
      expect(await governor.state(proposalId)).to.equal(3); // Defeated

      await expect(
        governor.connect(proposer).queue([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash)
      ).to.be.revertedWith("Governor: proposal not successful");

      await expect(
        governor.connect(proposer).execute([await targetContract.getAddress()], [0], [calldata], proposalDescriptionHash)
      ).to.be.revertedWith("Governor: proposal not successful");
    });

    it("Should allow admin (Governor) to cancel a proposal before it's executed (via proposal)", async function () {
      // Create a proposal to be cancelled
      const targetValue = 123;
      const proposalToCancelDescription = "Proposal #CancelMe: Test DAO cancellation";
      const calldataToCancel = targetContract.interface.encodeFunctionData("setValue", [targetValue]);
      
      const proposeCancelTx = await governor.connect(proposer).propose([await targetContract.getAddress()], [0], [calldataToCancel], proposalToCancelDescription);
      const receiptCancel = await proposeCancelTx.wait();
      let proposalToCancelId: any;
      if (receiptCancel && receiptCancel.logs) {
         const event = governor.interface.parseLog(receiptCancel.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) proposalToCancelId = event.args.proposalId;
      }
      expect(proposalToCancelId).to.not.be.undefined;

      // Now, create another proposal whose action is to cancel the first one
      const cancelCallData = governor.interface.encodeFunctionData("cancel", [[await targetContract.getAddress()], [0], [calldataToCancel], ethers.id(proposalToCancelDescription)]);
      const cancelProposalDescription = "Proposal #MainCancel: Cancel the previous proposal";
      const cancelProposalDescriptionHash = ethers.id(cancelProposalDescription);

      const proposeMainCancelTx = await governor.connect(proposer).propose([await governor.getAddress()], [0], [cancelCallData], cancelProposalDescription);
      const receiptMainCancel = await proposeMainCancelTx.wait();
      let mainCancelProposalId: any;
      if (receiptMainCancel && receiptMainCancel.logs) {
         const event = governor.interface.parseLog(receiptMainCancel.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) mainCancelProposalId = event.args.proposalId;
      }
      expect(mainCancelProposalId).to.not.be.undefined;

      // Vote for the cancellation proposal
      await network.provider.send("evm_mine"); // voting delay for mainCancelProposalId
      await governor.connect(voter1).castVote(mainCancelProposalId, 1);
      await governor.connect(voter2).castVote(mainCancelProposalId, 1);
      await governor.connect(proposer).castVote(mainCancelProposalId, 1);

      // Fast-forward past voting period for mainCancelProposalId
      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(mainCancelProposalId)).to.equal(4); // Succeeded

      // Queue the cancellation proposal
      const queueMainCancelTx = await governor.connect(proposer).queue([await governor.getAddress()], [0], [cancelCallData], cancelProposalDescriptionHash);
      await queueMainCancelTx.wait();
      expect(await governor.state(mainCancelProposalId)).to.equal(5); // Queued

      // Fast-forward past timelock delay for mainCancelProposalId
      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");
      
      // Execute the cancellation proposal
      // This will make the Governor call its own cancel function on the proposalToCancelId
      await expect(governor.connect(proposer).execute([await governor.getAddress()], [0], [cancelCallData], cancelProposalDescriptionHash))
        .to.emit(governor, "ProposalCanceled").withArgs(proposalToCancelId); // Check for event on original proposal
      
      expect(await governor.state(mainCancelProposalId)).to.equal(7); // Executed
      expect(await governor.state(proposalToCancelId)).to.equal(2); // Canceled
    });
  });

  describe("Upgradeability", function () {
    it("Should be upgradeable by an admin (Governor via DAO proposal)", async function () {
      const DPPGovernorV2Factory = await ethers.getContractFactory("DPPGovernorV2"); 
      const newImpl = await DPPGovernorV2Factory.deploy();
      await newImpl.waitForDeployment();
      const newImplAddress = await newImpl.getAddress();

      // Proposal to upgrade the governor itself
      // The UUPS upgrade pattern involves the proxy calling `upgradeToAndCall` on itself
      // The `_authorizeUpgrade` in DPPGovernor is `onlyRole(DEFAULT_ADMIN_ROLE)`
      // Since the Governor itself is now the admin of the proxy (via Timelock for sensitive calls),
      // the Governor needs to propose an upgrade to itself.
      // The Timelock has TIMELOCK_ADMIN_ROLE for the Governor, and the Governor has DEFAULT_ADMIN_ROLE for itself.

      const governorAddress = await governor.getAddress();
      // Calldata for governor.upgradeToAndCall(newImplementationAddress, initializeV2CalldataIfAny)
      // For a simple version bump without new initializer:
      const upgradeCalldata = governor.interface.encodeFunctionData("upgradeToAndCall", [
        newImplAddress,
        "0x" // no V2 initialize call data
      ]);

      const proposalDescription = "Upgrade Governor to V2";
      const proposalDescriptionHash = ethers.id(proposalDescription);

      // Propose the upgrade
      const proposeTx = await governor.connect(proposer).propose(
        [governorAddress], // Target is the governor itself (proxy)
        [0],
        [upgradeCalldata],
        proposalDescription
      );
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
         const event = governor.interface.parseLog(receipt.logs.find(log => log.address === await governor.getAddress() && governor.interface.parseLog(log as any)?.name === "ProposalCreated") as any);
         if (event) proposalId = event.args.proposalId;
      }
      expect(proposalId).to.not.be.undefined;

      // Vote for the upgrade
      await network.provider.send("evm_mine");
      await governor.connect(voter1).castVote(proposalId, 1);
      await governor.connect(voter2).castVote(proposalId, 1);
      await governor.connect(proposer).castVote(proposalId, 1);
      for (let i = 0; i < (Number(await governor.votingPeriod()) + 1); i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(proposalId)).to.equal(4); // Succeeded

      // Queue the upgrade
      const queueTx = await governor.connect(proposer).queue([governorAddress], [0], [upgradeCalldata], proposalDescriptionHash);
      await queueTx.wait();
      expect(await governor.state(proposalId)).to.equal(5); // Queued

      // Fast-forward past timelock delay
      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      // Execute the upgrade
      const executeTx = await governor.connect(proposer).execute([governorAddress], [0], [upgradeCalldata], proposalDescriptionHash);
      await executeTx.wait();
      expect(await governor.state(proposalId)).to.equal(7); // Executed

      const upgradedGovernor = DPPGovernorV2Factory.attach(governorAddress) as DPPGovernorV2;
      expect(await upgradedGovernor.version()).to.equal("V2");
    });
  });
});


// Dummy DPPGovernorV2.sol for upgradeability testing
/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


// This is a simplified V2 just for testing the version() function.
// In a real scenario, it would inherit from the actual V1 Governor or its base contracts.
// For the purpose of this test, we will make it inherit directly from V1,
// which requires V1 to be structured to allow this (e.g. internal functions virtual)
// or we can make V2 inherit from the same base contracts as V1 and re-implement initializers.
// For simplicity, we'll assume V2 directly inherits from the V1 `DPPGovernor.sol`
// if `DPPGovernor.sol` itself inherits UUPSUpgradeable and has `_authorizeUpgrade`
import "./DPPGovernor.sol"; // Assuming V1 is in the same directory

contract DPPGovernorV2 is DPPGovernor {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // UUPS requires this
    }

    // If DPPGovernor's initialize is complex, and V2 changes state variables added by V1,
    // V2 would need its own reinitializer function with a new version number.
    // For this test, we assume no new state variables requiring reinitialization.
    // function initializeV2(string memory newParameter) public reinitializer(2) {
    //     // V2 specific initialization, if any
    // }

    function version() public pure returns (string memory) {
        return "V2";
    }

    // _authorizeUpgrade is inherited from DPPGovernor (V1) which has it restricted to DEFAULT_ADMIN_ROLE
}
*/

