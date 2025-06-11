import { ethers, upgrades } from "hardhat";

async function main() {
  const DPPToken = await ethers.getContractFactory("DPPToken");
  const dppToken = await upgrades.deployProxy(DPPToken, ["Digital Product Passport Token", "DPP"], {
    initializer: "initialize",
  });

  await dppToken.waitForDeployment();

  console.log("DPPToken deployed to:", await dppToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});