import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const DPPToken = await ethers.getContractFactory("DPPToken");
  const proxy = await upgrades.deployProxy(DPPToken, [deployer.address], {
    kind: "uups",
  });

  await proxy.waitForDeployment();
  console.log("DPPToken deployed to:", await proxy.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
