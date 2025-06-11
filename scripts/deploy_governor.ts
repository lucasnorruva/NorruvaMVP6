import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

const deployGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Deploying DPPGovernor on network ${network.name}`);

  // Ensure NORUToken is deployed first and get its address
  const noruTokenDeployment = await deployments.get('NORUToken'); // Assumes NORUToken was deployed and saved with name 'NORUToken'
  const noruTokenAddress = noruTokenDeployment.address;

  console.log(`Using NORUToken address: ${noruTokenAddress}`);

  const Governor = await ethers.getContractFactory('DPPGovernor');
  const governor = await Governor.deploy(
    noruTokenAddress // Address of the deployed NORU token
    // Add other constructor arguments for Governor if necessary (e.g., initial proposer, timelock address)
  );

  await governor.waitForDeployment();

  console.log(`DPPGovernor deployed to: ${await governor.getAddress()}`);

  // Optional: Save the deployment information
  await deploy('DPPGovernor', {
    from: deployer,
    contract: 'DPPGovernor',
    args: [noruTokenAddress], // Save constructor arguments
    log: true,
  });
};

export default deployGovernor;

deployGovernor.tags = ['DPPGovernor'];
deployGovernor.dependencies = ['NORUToken']; // Specify that NORUToken must be deployed before this