
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying TimelockController contract with the account:", deployer.address);

  // TimelockController parameters
  const minDelay = 3600; // 1 hour (for example, adjust as needed for testing/production)
  // Proposers and Executors will be set up by the Governor deployment script.
  // For initial deployment, the deployer is the admin.
  const proposers: string[] = []; // Empty initially, Governor will be added
  const executors: string[] = []; // Empty initially, Governor or address(0) will be added
  const admin: string = deployer.address; // Deployer is the initial admin

  const TimelockControllerFactory = await ethers.getContractFactory("TimelockControllerUpgradeable");
  console.log("Deploying TimelockController proxy...");
  // Note: OpenZeppelin's TimelockControllerUpgradeable uses an initializer with this signature.
  const timelockController = await upgrades.deployProxy(TimelockControllerFactory, [minDelay, proposers, executors, admin], {
    kind: "uups",
  });

  await timelockController.waitForDeployment();
  const timelockAddress = await timelockController.getAddress();
  console.log("TimelockController proxy deployed to:", timelockAddress);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(timelockAddress);
  console.log("TimelockController implementation deployed to:", implementationAddress);
  
  console.log("\nTimelockController initialized with:");
  console.log("  Min Delay:", minDelay);
  console.log("  Initial Proposers:", proposers);
  console.log("  Initial Executors:", executors);
  console.log("  Admin:", admin);
  console.log("\nIMPORTANT: After deploying the Governor, ensure it's granted PROPOSER_ROLE and EXECUTOR_ROLE on this TimelockController.");
  console.log("The deployer (current admin) should then renounce the admin role if the DAO is to be fully autonomous.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

