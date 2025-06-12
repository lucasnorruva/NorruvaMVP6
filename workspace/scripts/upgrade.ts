import { ethers, upgrades } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) {
    throw new Error("PROXY_ADDRESS environment variable is required.");
  }

  const contractName = process.env.UPGRADE_CONTRACT_NAME;
  if (!contractName) {
    throw new Error(
      "UPGRADE_CONTRACT_NAME environment variable is required (e.g., DPPToken, NORUToken)."
    );
  }

  const V2ContractName = `${contractName}V2`;
  console.log(`Attempting to upgrade ${contractName} at proxy address ${proxyAddress} to ${V2ContractName}...`);

  let V2Factory;
  try {
    V2Factory = await ethers.getContractFactory(V2ContractName);
  } catch (error) {
    console.error(`Error getting contract factory for ${V2ContractName}:`, error);
    throw new Error(
      `Could not find or compile ${V2ContractName}.sol. Make sure it exists and is correctly named.`
    );
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address, "for the upgrade transaction.");

  const upgraded = await upgrades.upgradeProxy(proxyAddress, V2Factory);
  await upgraded.waitForDeployment();
  
  const upgradedAddress = await upgraded.getAddress();
  console.log(`${contractName} (proxy at ${proxyAddress}) successfully upgraded to ${V2ContractName}.`);
  console.log(`Proxy remains at: ${upgradedAddress}`);

  const newImplementationAddress = await upgrades.erc1967.getImplementationAddress(upgradedAddress);
  console.log(`${V2ContractName} implementation deployed to: ${newImplementationAddress}`);
  
  // Optional: If V2 has a new version function, try to call it
  if (typeof (upgraded as any).version === 'function') {
    try {
        const version = await (upgraded as any).version();
        console.log(`${V2ContractName} version: ${version}`);
    } catch (e) {
        console.log(`Could not call version() on ${V2ContractName}, or it does not exist.`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
