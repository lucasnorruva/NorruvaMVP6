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
  const INITIAL_SUPPLY_UNITS = "1000000"; // 1 million
  const INITIAL_SUPPLY = ethers.parseUnits(INITIAL_SUPPLY_UNITS, 18);
  const TOKEN_CAP_UNITS = "1000000000"; // 1 billion
  const TOKEN_CAP = ethers.parseUnits(TOKEN_CAP_UNITS, 18);

  const TIMELOCK_MIN_DELAY = 3600; // 1 hour (for testing, can be shorter in local dev)
  const GOVERNOR_NAME = "Norruva DPP DAO Governor";

  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const EXECUTOR_ROLE = ethers.id("EXECUTOR_ROLE");
  const CANCELLER_ROLE = ethers.id("CANCELLER_ROLE");
  const TIMELOCK_ADMIN_ROLE = ethers.id("TIMELOCK_ADMIN_ROLE");
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash; // For Governor's own admin

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3, otherUser] =
      await ethers.getSigners();

    // Deploy NORUToken
    const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
    noruToken = (await upgrades.deployProxy(
      NORUTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address, INITIAL_SUPPLY, TOKEN_CAP], // Updated initializer args
      { initializer: "initialize", kind: "uups" },
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
    const TimelockFactory = await ethers.getContractFactory(
      "TimelockControllerUpgradeable",
    );
    timelock = (await upgrades.deployProxy(
      TimelockFactory,
      [TIMELOCK_MIN_DELAY, [], [], owner.address], // proposers, executors, admin
      { kind: "uups", initializer: "initialize" },
    )) as unknown as TimelockControllerUpgradeable;
    await timelock.waitForDeployment();

    // Deploy DPPGovernor
    const GovernorFactory = await ethers.getContractFactory("DPPGovernor");
    governor = (await upgrades.deployProxy(
      GovernorFactory,
      [
        await noruToken.getAddress(),
        await timelock.getAddress(),
        GOVERNOR_NAME,
      ],
      { initializer: "initialize", kind: "uups" },
    )) as unknown as DPPGovernor;
    await governor.waitForDeployment();

    // Configure Timelock roles
    await timelock
      .connect(owner)
      .grantRole(PROPOSER_ROLE, await governor.getAddress());
    await timelock
      .connect(owner)
      .grantRole(CANCELLER_ROLE, await governor.getAddress());
    await timelock.connect(owner).grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
    await timelock
      .connect(owner)
      .grantRole(TIMELOCK_ADMIN_ROLE, await governor.getAddress());
    await timelock
      .connect(owner)
      .renounceRole(TIMELOCK_ADMIN_ROLE, owner.address);

    // Deploy SimpleTarget contract and transfer ownership to Timelock
    const SimpleTargetFactory = await ethers.getContractFactory("SimpleTarget");
    targetContract = await SimpleTargetFactory.deploy(owner.address);
    await targetContract.waitForDeployment();
    await targetContract
      .connect(owner)
      .transferOwnership(await timelock.getAddress());
  });

  describe("Deployment & Configuration", function () {
    it("Should have correct token, timelock, and name", async function () {
      expect(await governor.token()).to.equal(await noruToken.getAddress());
      expect(await governor.timelock()).to.equal(await timelock.getAddress());
      expect(await governor.name()).to.equal(GOVERNOR_NAME);
    });

    it("TimelockController should have Governor as Proposer, Canceller, Admin and address(0) as Executor", async function () {
      expect(await timelock.hasRole(PROPOSER_ROLE, await governor.getAddress()))
        .to.be.true;
      expect(
        await timelock.hasRole(CANCELLER_ROLE, await governor.getAddress()),
      ).to.be.true;
      expect(await timelock.hasRole(EXECUTOR_ROLE, ethers.ZeroAddress)).to.be
        .true;
      expect(
        await timelock.hasRole(
          TIMELOCK_ADMIN_ROLE,
          await governor.getAddress(),
        ),
      ).to.be.true;
      expect(await timelock.hasRole(TIMELOCK_ADMIN_ROLE, owner.address)).to.be
        .false;
    });

    it("TargetContract should be owned by Timelock", async function () {
      expect(await targetContract.owner()).to.equal(
        await timelock.getAddress(),
      );
    });

    it("Governor should have DEFAULT_ADMIN_ROLE for itself", async function () {
      expect(
        await governor.hasRole(DEFAULT_ADMIN_ROLE, await governor.getAddress()),
      ).to.be.true;
    });

    it("Should have default quorum fraction of 4%", async function () {
      // We need to pass a block number to quorum; using the latest block is fine for this.
      const latestBlock = await ethers.provider.getBlock("latest");
      if (!latestBlock) throw new Error("Could not get latest block");
      expect(await governor.quorumNumerator(latestBlock.number)).to.equal(4); // GovernorVotesQuorumFractionUpgradeable default
      expect(await governor.QUORUM_DENOMINATOR()).to.equal(100);
    });
  });

  describe("Proposal Lifecycle", function () {
    it("Should allow proposal creation, voting, queuing, and execution", async function () {
      const newValue = 777;
      const proposalDescription = "Proposal #1: Set SimpleTarget value to 777";
      const proposalDescriptionHash = ethers.id(proposalDescription);

      const calldata = targetContract.interface.encodeFunctionData("setValue", [
        newValue,
      ]);

      const proposeTx = await governor
        .connect(proposer)
        .propose(
          [await targetContract.getAddress()],
          [0],
          [calldata],
          proposalDescription,
        );
      const receipt = await proposeTx.wait();

      let proposalId: any;
      if (receipt && receipt.logs) {
        const eventLog = receipt.logs.find(
          (log) =>
            log.address === (await governor.getAddress()) &&
            governor.interface.hasFunction("ProposalCreated"),
        );
        if (eventLog) {
          const parsedLog = governor.interface.parseLog(eventLog as any);
          if (parsedLog && parsedLog.name === "ProposalCreated") {
            proposalId = parsedLog.args.proposalId;
          }
        }
      }
      expect(proposalId).to.not.be.undefined;

      await network.provider.send("evm_mine");
      expect(await governor.state(proposalId)).to.equal(1); // Active

      await governor.connect(voter1).castVote(proposalId, 1); // For
      await governor.connect(voter2).castVote(proposalId, 1); // For
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      await governor.connect(proposer).castVote(proposalId, 1); // For

      for (let i = 0; i < Number(await governor.votingPeriod()) + 1; i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(proposalId)).to.equal(4); // Succeeded

      const queueTx = await governor
        .connect(proposer)
        .queue(
          [await targetContract.getAddress()],
          [0],
          [calldata],
          proposalDescriptionHash,
        );
      await queueTx.wait();
      expect(await governor.state(proposalId)).to.equal(5); // Queued

      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      const executeTx = await governor
        .connect(proposer)
        .execute(
          [await targetContract.getAddress()],
          [0],
          [calldata],
          proposalDescriptionHash,
        );
      await executeTx.wait();
      expect(await governor.state(proposalId)).to.equal(7); // Executed

      expect(await targetContract.value()).to.equal(newValue);
      expect(await targetContract.lastAction()).to.equal("setValue");
    });

    it("Should handle a proposal that fails due to insufficient 'For' votes", async function () {
      const proposalDescription =
        "Proposal #Fail: This proposal should be defeated";
      const proposalDescriptionHash = ethers.id(proposalDescription);
      const calldata = targetContract.interface.encodeFunctionData("setValue", [
        100,
      ]);

      const proposeTx = await governor
        .connect(proposer)
        .propose(
          [await targetContract.getAddress()],
          [0],
          [calldata],
          proposalDescription,
        );
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
        const eventLog = receipt.logs.find(
          (log) =>
            log.address === (await governor.getAddress()) &&
            governor.interface.hasFunction("ProposalCreated"),
        );
        if (eventLog) {
          const parsedLog = governor.interface.parseLog(eventLog as any);
          if (parsedLog && parsedLog.name === "ProposalCreated") {
            proposalId = parsedLog.args.proposalId;
          }
        }
      }
      expect(proposalId).to.not.be.undefined;

      await network.provider.send("evm_mine");
      expect(await governor.state(proposalId)).to.equal(1); // Active

      await governor.connect(voter1).castVote(proposalId, 0); // Against
      await governor.connect(voter2).castVote(proposalId, 0); // Against
      await governor.connect(voter3).castVote(proposalId, 0); // Against
      await governor.connect(proposer).castVote(proposalId, 1); // For

      for (let i = 0; i < Number(await governor.votingPeriod()) + 1; i++) {
        await network.provider.send("evm_mine");
      }

      expect(await governor.state(proposalId)).to.equal(3); // Defeated

      await expect(
        governor
          .connect(proposer)
          .queue(
            [await targetContract.getAddress()],
            [0],
            [calldata],
            proposalDescriptionHash,
          ),
      ).to.be.revertedWith("Governor: proposal not successful");

      await expect(
        governor
          .connect(proposer)
          .execute(
            [await targetContract.getAddress()],
            [0],
            [calldata],
            proposalDescriptionHash,
          ),
      ).to.be.revertedWith("Governor: proposal not successful");
    });

    it("Should allow admin (Governor) to cancel a proposal before it's executed (via proposal)", async function () {
      const targetValue = 123;
      const proposalToCancelDescription =
        "Proposal #CancelMe: Test DAO cancellation";
      const calldataToCancel = targetContract.interface.encodeFunctionData(
        "setValue",
        [targetValue],
      );

      const proposeCancelTx = await governor
        .connect(proposer)
        .propose(
          [await targetContract.getAddress()],
          [0],
          [calldataToCancel],
          proposalToCancelDescription,
        );
      const receiptCancel = await proposeCancelTx.wait();
      let proposalToCancelId: any;
      if (receiptCancel && receiptCancel.logs) {
        const eventLog = receiptCancel.logs.find(
          (log) =>
            log.address === (await governor.getAddress()) &&
            governor.interface.hasFunction("ProposalCreated"),
        );
        if (eventLog) {
          const parsedLog = governor.interface.parseLog(eventLog as any);
          if (parsedLog && parsedLog.name === "ProposalCreated") {
            proposalToCancelId = parsedLog.args.proposalId;
          }
        }
      }
      expect(proposalToCancelId).to.not.be.undefined;

      const cancelCallData = governor.interface.encodeFunctionData("cancel", [
        [await targetContract.getAddress()],
        [0],
        [calldataToCancel],
        ethers.id(proposalToCancelDescription),
      ]);
      const cancelProposalDescription =
        "Proposal #MainCancel: Cancel the previous proposal";
      const cancelProposalDescriptionHash = ethers.id(
        cancelProposalDescription,
      );

      const proposeMainCancelTx = await governor
        .connect(proposer)
        .propose(
          [await governor.getAddress()],
          [0],
          [cancelCallData],
          cancelProposalDescription,
        );
      const receiptMainCancel = await proposeMainCancelTx.wait();
      let mainCancelProposalId: any;
      if (receiptMainCancel && receiptMainCancel.logs) {
        const eventLog = receiptMainCancel.logs.find(
          (log) =>
            log.address === (await governor.getAddress()) &&
            governor.interface.hasFunction("ProposalCreated"),
        );
        if (eventLog) {
          const parsedLog = governor.interface.parseLog(eventLog as any);
          if (parsedLog && parsedLog.name === "ProposalCreated") {
            mainCancelProposalId = parsedLog.args.proposalId;
          }
        }
      }
      expect(mainCancelProposalId).to.not.be.undefined;

      await network.provider.send("evm_mine");
      await governor.connect(voter1).castVote(mainCancelProposalId, 1);
      await governor.connect(voter2).castVote(mainCancelProposalId, 1);
      await governor.connect(proposer).castVote(mainCancelProposalId, 1);

      for (let i = 0; i < Number(await governor.votingPeriod()) + 1; i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(mainCancelProposalId)).to.equal(4); // Succeeded

      const queueMainCancelTx = await governor
        .connect(proposer)
        .queue(
          [await governor.getAddress()],
          [0],
          [cancelCallData],
          cancelProposalDescriptionHash,
        );
      await queueMainCancelTx.wait();
      expect(await governor.state(mainCancelProposalId)).to.equal(5); // Queued

      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      await expect(
        governor
          .connect(proposer)
          .execute(
            [await governor.getAddress()],
            [0],
            [cancelCallData],
            cancelProposalDescriptionHash,
          ),
      )
        .to.emit(governor, "ProposalCanceled")
        .withArgs(proposalToCancelId);

      expect(await governor.state(mainCancelProposalId)).to.equal(7); // Executed
      expect(await governor.state(proposalToCancelId)).to.equal(2); // Canceled
    });
  });

  describe("Upgradeability", function () {
    it("Should be upgradeable by the DAO (via proposal) to DPPGovernorV2", async function () {
      const DPPGovernorV2Factory =
        await ethers.getContractFactory("DPPGovernorV2");
      const newImpl = await DPPGovernorV2Factory.deploy();
      await newImpl.waitForDeployment();
      const newImplAddress = await newImpl.getAddress();

      const governorAddress = await governor.getAddress();
      const upgradeCalldata = governor.interface.encodeFunctionData(
        "upgradeToAndCall",
        [newImplAddress, "0x"],
      );

      const proposalDescription = "Upgrade Governor to V2";
      const proposalDescriptionHash = ethers.id(proposalDescription);

      const proposeTx = await governor
        .connect(proposer)
        .propose(
          [governorAddress],
          [0],
          [upgradeCalldata],
          proposalDescription,
        );
      const receipt = await proposeTx.wait();
      let proposalId: any;
      if (receipt && receipt.logs) {
        const eventLog = receipt.logs.find(
          (log) =>
            log.address === (await governor.getAddress()) &&
            governor.interface.hasFunction("ProposalCreated"),
        );
        if (eventLog) {
          const parsedLog = governor.interface.parseLog(eventLog as any);
          if (parsedLog && parsedLog.name === "ProposalCreated") {
            proposalId = parsedLog.args.proposalId;
          }
        }
      }
      expect(proposalId).to.not.be.undefined;

      await network.provider.send("evm_mine");
      await governor.connect(voter1).castVote(proposalId, 1);
      await governor.connect(voter2).castVote(proposalId, 1);
      await governor.connect(proposer).castVote(proposalId, 1);
      for (let i = 0; i < Number(await governor.votingPeriod()) + 1; i++) {
        await network.provider.send("evm_mine");
      }
      expect(await governor.state(proposalId)).to.equal(4); // Succeeded

      const queueTx = await governor
        .connect(proposer)
        .queue(
          [governorAddress],
          [0],
          [upgradeCalldata],
          proposalDescriptionHash,
        );
      await queueTx.wait();
      expect(await governor.state(proposalId)).to.equal(5); // Queued

      await network.provider.send("evm_increaseTime", [TIMELOCK_MIN_DELAY + 1]);
      await network.provider.send("evm_mine");

      const executeTx = await governor
        .connect(proposer)
        .execute(
          [governorAddress],
          [0],
          [upgradeCalldata],
          proposalDescriptionHash,
        );
      await executeTx.wait();
      expect(await governor.state(proposalId)).to.equal(7); // Executed

      const upgradedGovernor = DPPGovernorV2Factory.attach(
        governorAddress,
      ) as DPPGovernorV2;
      expect(await upgradedGovernor.version()).to.equal("V2");
    });
  });
});
