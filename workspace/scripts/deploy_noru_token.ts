
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying NORUToken contract with the account:", deployer.address);

  const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
  console.log("Deploying NORUToken proxy...");

  // Initial supply: 1,000,000 tokens (with 18 decimals)
  const initialSupply = ethers.parseUnits("1000000", 18);

  const noruToken = await upgrades.deployProxy(NORUTokenFactory, ["Norruva Governance Token", "NORU", deployer.address, initialSupply], {
    initializer: "initialize",
    kind: "uups",
  });

  await noruToken.waitForDeployment();
  const noruTokenAddress = await noruToken.getAddress();
  console.log("NORUToken proxy deployed to:", noruTokenAddress);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(noruTokenAddress);
  console.log("NORUToken implementation deployed to:", implementationAddress);

  console.log(`Minted ${ethers.formatUnits(initialSupply, 18)} NORU to ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
