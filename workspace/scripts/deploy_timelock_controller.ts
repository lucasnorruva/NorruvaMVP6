
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying TimelockController contract with the account:", deployer.address);

  // TimelockController parameters
  const minDelay = 3600; // 1 hour (for example, adjust as needed for testing/production)
  // Proposers and Executors will be set up after Governor deployment typically.
  // For initial deployment, the deployer can be a proposer and executor.
  // The admin is the deployer, who can then transfer admin role to the Governor or a multisig.
  const proposers: string[] = [deployer.address]; // Initially, deployer can propose
  const executors: string[] = [ethers.ZeroAddress]; // address(0) means anyone can execute a passed proposal for simplicity
  const admin: string = deployer.address; // Deployer is the initial admin

  const TimelockControllerFactory = await ethers.getContractFactory("TimelockControllerUpgradeable");
  console.log("Deploying TimelockController proxy...");
  const timelockController = await upgrades.deployProxy(TimelockControllerFactory, [minDelay, proposers, executors, admin], {
    // initializer is implicitly 'initialize' for OpenZeppelin's UUPS proxies unless specified
    kind: "uups",
  });

  await timelockController.waitForDeployment();
  const timelockAddress = await timelockController.getAddress();
  console.log("TimelockController proxy deployed to:", timelockAddress);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(timelockAddress);
  console.log("TimelockController implementation deployed to:", implementationAddress);
  
  console.log("TimelockController initialized with:");
  console.log("  Min Delay:", minDelay);
  console.log("  Proposers:", proposers);
  console.log("  Executors:", executors);
  console.log("  Admin:", admin);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
