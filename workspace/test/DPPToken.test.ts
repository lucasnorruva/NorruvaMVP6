
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Adjust the import path if your typechain output directory is different
import type { DPPToken, DPPTokenV2 } from "../typechain-types"; 

describe("DPPToken", function () {
  let dppToken: DPPToken;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let updater: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const MINTER_ROLE = ethers.id("MINTER_ROLE"); // Using ethers.id for roles
  const UPDATER_ROLE = ethers.id("UPDATER_ROLE");
  const TRANSFER_ROLE = ethers.id("TRANSFER_ROLE"); // Assuming this role exists for transfer tests

  const TOKEN_NAME = "Norruva DPP Token";
  const TOKEN_SYMBOL = "NDPP";

  beforeEach(async function () {
    [owner, minter, updater, user1, user2] = await ethers.getSigners();

    const DPPTokenFactory = await ethers.getContractFactory("DPPToken");
    dppToken = (await upgrades.deployProxy(
      DPPTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address], // Correct initializer arguments
      {
        initializer: "initialize",
        kind: "uups",
      }
    )) as unknown as DPPToken; // Cast to DPPToken type
    await dppToken.waitForDeployment();

    // Grant roles for testing
    await dppToken.connect(owner).grantRole(MINTER_ROLE, minter.address);
    await dppToken.connect(owner).grantRole(UPDATER_ROLE, updater.address);
    await dppToken.connect(owner).grantRole(TRANSFER_ROLE, owner.address); // Grant owner transfer role for some tests
  });

  describe("Deployment & Initialization", function () {
    it("Should deploy with the correct name and symbol", async function () {
      expect(await dppToken.name()).to.equal(TOKEN_NAME);
      expect(await dppToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should grant the default admin role to the deployer (owner)", async function () {
      expect(await dppToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant MINTER_ROLE and UPDATER_ROLE to the deployer (owner) by default", async function () {
      expect(await dppToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await dppToken.hasRole(UPDATER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    const tokenId = 1;
    const metadataHash = "ipfs://QmHash123";

    it("Should allow MINTER_ROLE to mint tokens", async function () {
      await expect(dppToken.connect(minter).mint(user1.address, tokenId, metadataHash))
        .to.emit(dppToken, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, tokenId)
        .and.to.emit(dppToken, "MetadataUpdate") // Assuming mint also calls _setTokenMetadataHash which emits
        .withArgs(tokenId, "", metadataHash); // Old hash is empty string in mint

      expect(await dppToken.ownerOf(tokenId)).to.equal(user1.address);
      expect(await dppToken.tokenURI(tokenId)).to.equal(`mock-uri-prefix:${metadataHash}`);
    });

    it("Should not allow non-MINTER_ROLE to mint tokens", async function () {
      await expect(
        dppToken.connect(user1).mint(user1.address, tokenId, metadataHash)
      ).to.be.revertedWithCustomError(dppToken, "AccessControlUnauthorizedAccount")
       .withArgs(user1.address, MINTER_ROLE);
    });

    it("Should revert if minting an existing token", async function () {
      await dppToken.connect(minter).mint(user1.address, tokenId, metadataHash);
      await expect(
        dppToken.connect(minter).mint(user2.address, tokenId, "anotherHash")
      ).to.be.revertedWith("ERC721: token already minted");
    });
  });

  describe("Metadata Management", function () {
    const tokenId = 1;
    const initialMetadataHash = "ipfs://QmInitialHash";
    const newMetadataHash = "ipfs://QmNewHash";

    beforeEach(async function () {
      await dppToken.connect(minter).mint(user1.address, tokenId, initialMetadataHash);
    });

    it("Should allow token owner to update metadata hash", async function () {
      await expect(dppToken.connect(user1).updateMetadataHash(tokenId, newMetadataHash))
        .to.emit(dppToken, "MetadataUpdate")
        .withArgs(tokenId, initialMetadataHash, newMetadataHash); // Assuming _setTokenMetadataHash stores and emits old hash
      expect(await dppToken.tokenURI(tokenId)).to.equal(`mock-uri-prefix:${newMetadataHash}`);
    });

    it("Should allow UPDATER_ROLE to update metadata hash", async function () {
      await expect(dppToken.connect(updater).updateMetadataHash(tokenId, newMetadataHash))
        .to.emit(dppToken, "MetadataUpdate")
        .withArgs(tokenId, initialMetadataHash, newMetadataHash);
      expect(await dppToken.tokenURI(tokenId)).to.equal(`mock-uri-prefix:${newMetadataHash}`);
    });
    
    it("Should not allow non-owner and non-UPDATER_ROLE to update metadata hash", async function () {
      await expect(
        dppToken.connect(user2).updateMetadataHash(tokenId, newMetadataHash)
      ).to.be.revertedWith("DPPToken: caller is not owner nor approved updater");
    });

    it("Should revert update for non-existent token", async function () {
      await expect(
        dppToken.connect(user1).updateMetadataHash(99, newMetadataHash)
      ).to.be.revertedWith("DPPToken: URI update for nonexistent token");
    });

    it("tokenURI should revert for non-existent token", async function () {
        await expect(dppToken.tokenURI(99)).to.be.revertedWith("DPPToken: URI query for nonexistent token");
    });
  });

  describe("Transfers (Soulbound Behavior)", function () {
    const tokenId = 1;
    beforeEach(async function () {
      await dppToken.connect(minter).mint(user1.address, tokenId, "hash");
    });

    it("Should restrict transfers by default (soulbound)", async function () {
      await expect(
        dppToken.connect(user1).transferFrom(user1.address, user2.address, tokenId)
      ).to.be.revertedWith("Transfer restricted");
    });

    it("Should allow transfers if TRANSFER_ROLE is granted and called by role holder", async function () {
      // Owner has TRANSFER_ROLE from beforeEach
      await expect(dppToken.connect(owner).transferFrom(user1.address, user2.address, tokenId))
        .to.emit(dppToken, "Transfer")
        .withArgs(user1.address, user2.address, tokenId);
      expect(await dppToken.ownerOf(tokenId)).to.equal(user2.address);
    });
    
    it("Should still restrict transfers by token owner if they don't have TRANSFER_ROLE", async function () {
        // Revoke owner's transfer role for this specific test
        await dppToken.connect(owner).revokeRole(TRANSFER_ROLE, owner.address);
        await expect(
            dppToken.connect(user1).transferFrom(user1.address, user2.address, tokenId)
        ).to.be.revertedWith("Transfer restricted");
    });

    it("Should revert approve calls due to soulbound nature", async function () {
      await expect(dppToken.connect(user1).approve(user2.address, tokenId))
        .to.be.revertedWith("Soulbound token: approval not allowed");
    });
  });
  
  describe("Upgradeability", function () {
    it("Should upgrade to V2 and call new function", async function () {
      const DPPTokenV2Factory = await ethers.getContractFactory("DPPTokenV2");
      const upgradedToken = (await upgrades.upgradeProxy(
        await dppToken.getAddress(),
        DPPTokenV2Factory
      )) as unknown as DPPTokenV2; // Cast to DPPTokenV2 type
      await upgradedToken.waitForDeployment();

      expect(await upgradedToken.version()).to.equal("V2");
      // Example of calling a new function if one existed in V2
      // await expect(upgradedToken.newFunctionInV2()).to.not.be.reverted;
    });

    it("Should only allow admin to authorize upgrade", async function () {
      const DPPTokenV2Factory = await ethers.getContractFactory("DPPTokenV2");
      const newImplementation = await DPPTokenV2Factory.deploy();
      await newImplementation.waitForDeployment();
      
      await expect(
          dppToken.connect(user1).upgradeToAndCall(await newImplementation.getAddress(), "0x")
      ).to.be.revertedWithCustomError(dppToken, "AccessControlUnauthorizedAccount")
       .withArgs(user1.address, DEFAULT_ADMIN_ROLE);

      await expect(
          dppToken.connect(owner).upgradeToAndCall(await newImplementation.getAddress(), "0x")
      ).to.not.be.reverted; // Owner is admin
    });
  });
});
