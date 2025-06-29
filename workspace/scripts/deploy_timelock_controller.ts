import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying TimelockController contract with the account:",
    deployer.address,
  );

  // TimelockController parameters
  const minDelay = 3600; // 1 hour (for example, adjust as needed for testing/production)
  // Proposers and Executors will be set up by the Governor deployment script.
  // For initial deployment, the deployer is the admin.
  const proposers: string[] = []; // Empty initially, Governor will be added by deploy_governor.ts
  const executors: string[] = []; // Empty initially, Governor or address(0) will be added by deploy_governor.ts
  const admin: string = deployer.address; // Deployer is the initial admin

  const TimelockControllerFactory = await ethers.getContractFactory(
    "TimelockControllerUpgradeable",
  );
  console.log("Deploying TimelockController proxy...");

  const timelockController = await upgrades.deployProxy(
    TimelockControllerFactory,
    [minDelay, proposers, executors, admin],
    {
      kind: "uups", // Standard for OpenZeppelin upgradeable contracts
      initializer: "initialize", // Explicitly calling initialize as per best practice for OZ proxies
    },
  );

  await timelockController.waitForDeployment();
  const timelockAddress = await timelockController.getAddress();
  console.log("TimelockController proxy deployed to:", timelockAddress);

  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(timelockAddress);
  console.log(
    "TimelockController implementation deployed to:",
    implementationAddress,
  );

  console.log("\nTimelockController initialized with:");
  console.log("  Min Delay:", minDelay, "seconds");
  console.log(
    "  Initial Proposers:",
    proposers.length > 0
      ? proposers.join(", ")
      : "None (to be set by Governor)",
  );
  console.log(
    "  Initial Executors:",
    executors.length > 0
      ? executors.join(", ")
      : "None (to be set by Governor)",
  );
  console.log("  Admin:", admin);
  console.log(
    "\nIMPORTANT: The Governor deployment script will further configure PROPOSER_ROLE and EXECUTOR_ROLE on this TimelockController.",
  );
  console.log(
    "The deployer (current admin) should renounce the TIMELOCK_ADMIN_ROLE after the Governor is fully set up if the DAO is to be autonomous.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
