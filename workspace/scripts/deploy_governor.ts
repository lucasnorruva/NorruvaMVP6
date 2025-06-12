
import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DPPGovernor contract with the account:", deployer.address);

  // Retrieve deployed addresses from environment variables
  const NORU_TOKEN_ADDRESS = process.env.NORU_TOKEN_ADDRESS;
  const TIMELOCK_CONTROLLER_ADDRESS = process.env.TIMELOCK_CONTROLLER_ADDRESS;
  const GOVERNOR_NAME = "Norruva DPP DAO Governor";

  if (!NORU_TOKEN_ADDRESS || NORU_TOKEN_ADDRESS === "YOUR_DEPLOYED_NORU_TOKEN_ADDRESS" || NORU_TOKEN_ADDRESS.trim() === "") {
    console.error("ERROR: NORU_TOKEN_ADDRESS is not set correctly in .env file or environment.");
    console.log("Please deploy NORUToken first and set its address using: npx hardhat run scripts/deploy_noru_token.ts --network <your_network>");
    process.exit(1);
  }
  if (!TIMELOCK_CONTROLLER_ADDRESS || TIMELOCK_CONTROLLER_ADDRESS === "YOUR_DEPLOYED_TIMELOCK_CONTROLLER_ADDRESS" || TIMELOCK_CONTROLLER_ADDRESS.trim() === "") {
    console.error("ERROR: TIMELOCK_CONTROLLER_ADDRESS is not set correctly in .env file or environment.");
    console.log("Please deploy TimelockController first and set its address using: npx hardhat run scripts/deploy_timelock_controller.ts --network <your_network>");
    process.exit(1);
  }

  console.log(`Using NORUToken address: ${NORU_TOKEN_ADDRESS}`);
  console.log(`Using TimelockController address: ${TIMELOCK_CONTROLLER_ADDRESS}`);

  const DPPGovernorFactory = await ethers.getContractFactory("DPPGovernor");
  console.log("Deploying DPPGovernor proxy...");
  // Ensure the initializer arguments match DPPGovernor.sol:
  // initialize(IVotes _token, TimelockControllerUpgradeable _timelock, string memory _name)
  const governor = await upgrades.deployProxy(DPPGovernorFactory, [NORU_TOKEN_ADDRESS, TIMELOCK_CONTROLLER_ADDRESS, GOVERNOR_NAME], {
    initializer: "initialize",
    kind: "uups",
  });

  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("DPPGovernor proxy deployed to:", governorAddress);
  
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(governorAddress);
  console.log("DPPGovernor implementation deployed to:", implementationAddress);

  // --- Configure TimelockController roles ---
  console.log("\nConfiguring TimelockController roles...");
  // Note: ABI for TimelockControllerUpgradeable is implicitly available via Hardhat's OpenZeppelin Upgrades plugin
  // if the contract is part of the project or dependencies.
  const timelockController = await ethers.getContractAt("TimelockControllerUpgradeable", TIMELOCK_CONTROLLER_ADDRESS);

  const PROPOSER_ROLE = await timelockController.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelockController.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelockController.CANCELLER_ROLE();
  const TIMELOCK_ADMIN_ROLE = await timelockController.TIMELOCK_ADMIN_ROLE();

  console.log(`Granting PROPOSER_ROLE to Governor (${governorAddress}) on TimelockController...`);
  let tx = await timelockController.connect(deployer).grantRole(PROPOSER_ROLE, governorAddress);
  await tx.wait();
  console.log("PROPOSER_ROLE granted to Governor.");

  console.log(`Granting CANCELLER_ROLE to Governor (${governorAddress}) on TimelockController...`);
  tx = await timelockController.connect(deployer).grantRole(CANCELLER_ROLE, governorAddress);
  await tx.wait();
  console.log("CANCELLER_ROLE granted to Governor.");

  console.log(`Granting EXECUTOR_ROLE to address(0) (anyone) on TimelockController...`);
  // Granting EXECUTOR_ROLE to address(0) allows anyone to execute a passed proposal.
  // This is a common setup, but can be restricted to the Governor or specific accounts if needed.
  tx = await timelockController.connect(deployer).grantRole(EXECUTOR_ROLE, ethers.ZeroAddress); 
  await tx.wait();
  console.log("EXECUTOR_ROLE granted to address(0).");
  
  // Grant TIMELOCK_ADMIN_ROLE to the Governor to give it full control over the Timelock.
  const governorHasAdminRole = await timelockController.hasRole(TIMELOCK_ADMIN_ROLE, governorAddress);
  if (!governorHasAdminRole) {
      console.log(`Granting TIMELOCK_ADMIN_ROLE to Governor (${governorAddress}) on TimelockController...`);
      tx = await timelockController.connect(deployer).grantRole(TIMELOCK_ADMIN_ROLE, governorAddress);
      await tx.wait();
      console.log("TIMELOCK_ADMIN_ROLE granted to Governor.");
  } else {
      console.log(`Governor (${governorAddress}) already has TIMELOCK_ADMIN_ROLE.`);
  }

  // The deployer (owner) should renounce the TIMELOCK_ADMIN_ROLE if they hold it,
  // and it wasn't the Governor itself (which we just granted).
  const deployerIsAdmin = await timelockController.hasRole(TIMELOCK_ADMIN_ROLE, deployer.address);
  if (deployerIsAdmin) {
    console.log(`Deployer (${deployer.address}) still has TIMELOCK_ADMIN_ROLE. Renouncing...`);
    tx = await timelockController.connect(deployer).renounceRole(TIMELOCK_ADMIN_ROLE, deployer.address);
    await tx.wait();
    console.log("Deployer renounced TIMELOCK_ADMIN_ROLE. The TimelockController is now managed by the Governor.");
  } else {
    console.log(`Deployer (${deployer.address}) does not hold TIMELOCK_ADMIN_ROLE directly. Check other admins if necessary.`);
  }

  console.log("\nTimelockController roles configured for DPPGovernor.");
  console.log("Deployment and DAO setup steps complete for Governor.");
  console.log("Ensure that NORU_TOKEN_ADDRESS and TIMELOCK_CONTROLLER_ADDRESS in your .env (or environment) point to the correct deployed contracts.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
