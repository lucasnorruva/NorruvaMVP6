
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DPPToken contract with the account:", deployer.address);

  const DPPTokenFactory = await ethers.getContractFactory("DPPToken");
  console.log("Deploying DPPToken proxy...");
  // Updated initializer arguments: name, symbol, defaultAdmin
  const dppToken = await upgrades.deployProxy(DPPTokenFactory, ["Norruva DPP Token", "NDPP", deployer.address], {
    initializer: "initialize",
    kind: "uups",
  });

  await dppToken.waitForDeployment();
  const dppTokenAddress = await dppToken.getAddress();
  console.log("DPPToken proxy deployed to:", dppTokenAddress);
  
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(dppTokenAddress);
  console.log("DPPToken implementation deployed to:", implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

