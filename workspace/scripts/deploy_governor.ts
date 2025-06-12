
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DPPGovernor contract with the account:", deployer.address);

  // IMPORTANT: Replace these with your actual deployed NORUToken and TimelockController addresses
  // These addresses would typically be obtained from previous deployment script outputs or environment variables.
  const NORU_TOKEN_ADDRESS = process.env.NORU_TOKEN_ADDRESS || "YOUR_DEPLOYED_NORU_TOKEN_ADDRESS";
  const TIMELOCK_CONTROLLER_ADDRESS = process.env.TIMELOCK_CONTROLLER_ADDRESS || "YOUR_DEPLOYED_TIMELOCK_CONTROLLER_ADDRESS";
  const GOVERNOR_NAME = "Norruva DPP DAO Governor";

  if (NORU_TOKEN_ADDRESS === "YOUR_DEPLOYED_NORU_TOKEN_ADDRESS" || TIMELOCK_CONTROLLER_ADDRESS === "YOUR_DEPLOYED_TIMELOCK_CONTROLLER_ADDRESS") {
    console.error("Please replace placeholder addresses for NORU_TOKEN_ADDRESS and TIMELOCK_CONTROLLER_ADDRESS in deploy_governor.ts");
    process.exit(1);
  }

  console.log(`Using NORUToken address: ${NORU_TOKEN_ADDRESS}`);
  console.log(`Using TimelockController address: ${TIMELOCK_CONTROLLER_ADDRESS}`);

  const DPPGovernorFactory = await ethers.getContractFactory("DPPGovernor");
  console.log("Deploying DPPGovernor proxy...");
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
  const timelockController = await ethers.getContractAt("TimelockControllerUpgradeable", TIMELOCK_CONTROLLER_ADDRESS);

  const PROPOSER_ROLE = await timelockController.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelockController.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelockController.CANCELLER_ROLE(); // Added CANCELLER_ROLE
  const TIMELOCK_ADMIN_ROLE = await timelockController.TIMELOCK_ADMIN_ROLE();

  // Grant PROPOSER_ROLE to the Governor contract
  console.log(`Granting PROPOSER_ROLE to Governor (${governorAddress}) on TimelockController...`);
  let tx = await timelockController.grantRole(PROPOSER_ROLE, governorAddress);
  await tx.wait();
  console.log("PROPOSER_ROLE granted to Governor.");

  // Grant CANCELLER_ROLE to the Governor contract (so it can cancel its own proposals if needed)
  console.log(`Granting CANCELLER_ROLE to Governor (${governorAddress}) on TimelockController...`);
  tx = await timelockController.grantRole(CANCELLER_ROLE, governorAddress);
  await tx.wait();
  console.log("CANCELLER_ROLE granted to Governor.");

  // Grant EXECUTOR_ROLE to address(0) to allow anyone to execute proposals once passed and timelocked.
  // Alternatively, could grant to Governor or specific accounts.
  console.log(`Granting EXECUTOR_ROLE to address(0) (anyone) on TimelockController...`);
  tx = await timelockController.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);
  await tx.wait();
  console.log("EXECUTOR_ROLE granted to address(0).");

  // Check if deployer has TIMELOCK_ADMIN_ROLE
  const deployerIsAdmin = await timelockController.hasRole(TIMELOCK_ADMIN_ROLE, deployer.address);
  if (deployerIsAdmin) {
    // Transfer TIMELOCK_ADMIN_ROLE from deployer to Governor (making DAO self-governed for timelock)
    // First, grant admin role to Governor
    console.log(`Granting TIMELOCK_ADMIN_ROLE to Governor (${governorAddress}) on TimelockController...`);
    tx = await timelockController.grantRole(TIMELOCK_ADMIN_ROLE, governorAddress);
    await tx.wait();
    console.log("TIMELOCK_ADMIN_ROLE granted to Governor.");
    
    // Then, deployer renounces TIMELOCK_ADMIN_ROLE
    console.log(`Deployer (${deployer.address}) renouncing TIMELOCK_ADMIN_ROLE on TimelockController...`);
    tx = await timelockController.renounceRole(TIMELOCK_ADMIN_ROLE, deployer.address);
    await tx.wait();
    console.log("Deployer renounced TIMELOCK_ADMIN_ROLE. Governor is now admin of Timelock.");
  } else {
    console.log("Deployer is not TIMELOCK_ADMIN_ROLE, skipping admin role transfer to Governor.");
    // Check if Governor is already admin
    const governorIsAdmin = await timelockController.hasRole(TIMELOCK_ADMIN_ROLE, governorAddress);
    if(governorIsAdmin) {
        console.log("Governor is already TIMELOCK_ADMIN_ROLE.");
    } else {
        console.warn("WARNING: TIMELOCK_ADMIN_ROLE is not held by deployer and not transferred to Governor. Timelock may be unmanageable.");
    }
  }
  console.log("TimelockController roles configured.");
  console.log("Deployment and DAO setup complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
