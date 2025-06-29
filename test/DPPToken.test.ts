import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { DPPToken, DPPToken__factory } from "../typechain-types"; // Assuming typechain is used

describe("DPPToken", function () {
  let dppToken: DPPToken;
  let owner: SignerWithAddress;
  let manufacturer: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const MANUFACTURER_ROLE = ethers.keccak256(
    ethers.toUtf8Bytes("MANUFACTURER_ROLE"),
  );

  beforeEach(async function () {
    [owner, manufacturer, addr1, addr2] = await ethers.getSigners();

    const DPPTokenFactory = (await ethers.getContractFactory(
      "DPPToken",
    )) as DPPToken__factory;
    dppToken = (await upgrades.deployProxy(DPPTokenFactory, [owner.address], {
      initializer: "initialize",
    })) as DPPToken;

    // Grant roles for testing
    await dppToken.grantRole(MANUFACTURER_ROLE, manufacturer.address);
    await dppToken.grantRole(MINTER_ROLE, manufacturer.address); // Manufacturer can also mint
  });

  it("Should deploy with the correct name and symbol", async function () {
    expect(await dppToken.name()).to.equal("Digital Product Passport Token");
    expect(await dppToken.symbol()).to.equal("DPP");
  });

  it("Should grant the default admin role to the deployer", async function () {
    expect(await dppToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be
      .true;
  });
});
