
import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying NORUToken contract with the account:", deployer.address);

  const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
  console.log("Deploying NORUToken proxy...");

  const tokenName = "Norruva Governance Token";
  const tokenSymbol = "NORU";
  const initialSupply = ethers.parseUnits("1000000", 18); // 1 million tokens
  const tokenCap = ethers.parseUnits("1000000000", 18); // 1 billion token cap

  const noruToken = await upgrades.deployProxy(NORUTokenFactory, 
    [tokenName, tokenSymbol, deployer.address, initialSupply, tokenCap], 
    {
    initializer: "initialize",
    kind: "uups",
  });

  await noruToken.waitForDeployment();
  const noruTokenAddress = await noruToken.getAddress();
  console.log("NORUToken proxy deployed to:", noruTokenAddress);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(noruTokenAddress);
  console.log("NORUToken implementation deployed to:", implementationAddress);

  const balance = await noruToken.balanceOf(deployer.address);
  console.log(`Initial supply of ${ethers.formatUnits(balance, 18)} NORU minted to deployer ${deployer.address}`);
  console.log(`Token Cap set to: ${ethers.formatUnits(await noruToken.cap(), 18)} NORU`);
  console.log(`Deployer has MINTER_ROLE: ${await noruToken.hasRole(await noruToken.MINTER_ROLE(), deployer.address)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
