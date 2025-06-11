import { ethers, upgrades } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) throw new Error("PROXY_ADDRESS env var required");

  const DPPTokenV2 = await ethers.getContractFactory("DPPTokenV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, DPPTokenV2);
  await upgraded.waitForDeployment();
  console.log("DPPToken upgraded:", await upgraded.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
