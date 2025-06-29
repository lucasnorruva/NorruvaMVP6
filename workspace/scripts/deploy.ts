import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const DPPTokenFactory = await ethers.getContractFactory("DPPToken");
  console.log("Deploying DPPToken proxy...");
  // Updated initializer arguments: name, symbol, defaultAdmin
  const dppToken = await upgrades.deployProxy(
    DPPTokenFactory,
    ["Norruva DPP Token", "NDPP", deployer.address],
    {
      initializer: "initialize",
      kind: "uups",
    },
  );

  await dppToken.waitForDeployment();
  const dppTokenAddress = await dppToken.getAddress();
  console.log("DPPToken (proxy) deployed to:", dppTokenAddress);

  const implAddress =
    await upgrades.erc1967.getImplementationAddress(dppTokenAddress);
  console.log("DPPToken implementation deployed to:", implAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
