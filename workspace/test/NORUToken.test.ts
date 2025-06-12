
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// Adjust the import path if your typechain output directory is different
import type { NORUToken, NORUTokenV2 } from "../typechain-types";

describe("NORUToken", function () {
  let noruToken: NORUToken;
  let owner: SignerWithAddress; // Will be the initialAdmin and receive initialSupply
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let minterUser: SignerWithAddress;

  const TOKEN_NAME = "Norruva Governance Token";
  const TOKEN_SYMBOL = "NORU";
  const INITIAL_SUPPLY_UNITS = "1000000"; // 1 million
  const INITIAL_SUPPLY = ethers.parseUnits(INITIAL_SUPPLY_UNITS, 18);
  const TOKEN_CAP_UNITS = "1000000000"; // 1 billion
  const TOKEN_CAP = ethers.parseUnits(TOKEN_CAP_UNITS, 18);


  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const MINTER_ROLE = ethers.id("MINTER_ROLE"); 

  beforeEach(async function () {
    [owner, user1, user2, minterUser] = await ethers.getSigners();

    const NORUTokenFactory = await ethers.getContractFactory("NORUToken");
    noruToken = (await upgrades.deployProxy(
      NORUTokenFactory,
      [TOKEN_NAME, TOKEN_SYMBOL, owner.address, INITIAL_SUPPLY, TOKEN_CAP],
      {
        initializer: "initialize",
        kind: "uups",
      }
    )) as unknown as NORUToken;
    await noruToken.waitForDeployment();
    
    // For some tests, grant MINTER_ROLE to a specific minterUser if it's not the owner
    await noruToken.connect(owner).grantRole(MINTER_ROLE, minterUser.address);
  });

  describe("Deployment & Initialization", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await noruToken.name()).to.equal(TOKEN_NAME);
      expect(await noruToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should have 18 decimals", async function () {
      expect(await noruToken.decimals()).to.equal(18);
    });

    it("Should mint the initial supply to the initialAdmin (owner)", async function () {
      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await noruToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the cap correctly", async function () {
        expect(await noruToken.cap()).to.equal(TOKEN_CAP);
    });

    it("Should grant DEFAULT_ADMIN_ROLE and MINTER_ROLE to the initialAdmin (owner)", async function () {
      expect(await noruToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await noruToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting (Controlled by MINTER_ROLE)", function () {
    const mintAmount = ethers.parseUnits("500", 18);

    it("Should allow an account with MINTER_ROLE to mint new tokens within cap", async function () {
      const initialTotalSupply = await noruToken.totalSupply();
      await expect(noruToken.connect(minterUser).mint(user1.address, mintAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount);
      
      expect(await noruToken.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await noruToken.totalSupply()).to.equal(initialTotalSupply + mintAmount);
    });

    it("Should not allow minting beyond the cap", async function () {
      const almostCapAmount = TOKEN_CAP - (await noruToken.totalSupply()) - BigInt(1); // Mint just under cap
      if (almostCapAmount > 0) {
        await noruToken.connect(minterUser).mint(user1.address, almostCapAmount);
      }
      const remainingToCap = TOKEN_CAP - (await noruToken.totalSupply());
      await noruToken.connect(minterUser).mint(user1.address, remainingToCap); // Mint exactly to cap

      expect(await noruToken.totalSupply()).to.equal(TOKEN_CAP);
      await expect(noruToken.connect(minterUser).mint(user1.address, ethers.parseUnits("1", 18)))
        .to.be.revertedWith("NORUToken: cap exceeded");
    });

    it("Should not allow an account without MINTER_ROLE to mint tokens", async function () {
      await expect(noruToken.connect(user1).mint(user2.address, mintAmount))
        .to.be.revertedWithCustomError(noruToken, "AccessControlUnauthorizedAccount")
        .withArgs(user1.address, MINTER_ROLE);
    });
  });

  describe("Burning (ERC20Burnable)", function () {
    const burnAmount = ethers.parseUnits("100", 18);

    beforeEach(async function() {
        // Ensure owner has tokens to burn
        if (await noruToken.balanceOf(owner.address) < burnAmount) {
            await noruToken.connect(minterUser).mint(owner.address, burnAmount); // Assuming owner also has MINTER_ROLE or minterUser is owner
        }
    });
    
    it("Should allow a token holder to burn their own tokens", async function () {
      const initialTotalSupply = await noruToken.totalSupply();
      const ownerBalance = await noruToken.balanceOf(owner.address);

      await expect(noruToken.connect(owner).burn(burnAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);
      
      expect(await noruToken.balanceOf(owner.address)).to.equal(ownerBalance - burnAmount);
      expect(await noruToken.totalSupply()).to.equal(initialTotalSupply - burnAmount);
    });

    it("Should allow burning tokens from another account with allowance (burnFrom)", async function () {
      const initialTotalSupply = await noruToken.totalSupply();
      const ownerBalance = await noruToken.balanceOf(owner.address);
      
      await noruToken.connect(owner).approve(user1.address, burnAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(burnAmount);

      await expect(noruToken.connect(user1).burnFrom(owner.address, burnAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await noruToken.balanceOf(owner.address)).to.equal(ownerBalance - burnAmount);
      expect(await noruToken.totalSupply()).to.equal(initialTotalSupply - burnAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(0);
    });

    it("Should not allow burning more tokens than an account has", async function () {
        const ownerBalance = await noruToken.balanceOf(owner.address);
        const tooLargeBurnAmount = ownerBalance + ethers.parseUnits("1", 18);
        await expect(
            noruToken.connect(owner).burn(tooLargeBurnAmount)
        ).to.be.revertedWithCustomError(noruToken, "ERC20InsufficientBalance").withArgs(owner.address, ownerBalance, tooLargeBurnAmount);
    });

    it("Should not allow burnFrom more than approved amount", async function () {
        const approveAmount = ethers.parseUnits("50", 18);
        const burnFromAmount = ethers.parseUnits("60", 18);
        await noruToken.connect(owner).approve(user1.address, approveAmount);
        await expect(
            noruToken.connect(user1).burnFrom(owner.address, burnFromAmount)
        ).to.be.revertedWithCustomError(noruToken, "ERC20InsufficientAllowance").withArgs(user1.address, approveAmount, burnFromAmount);
    });
  });


  describe("ERC-20 Functionality", function () {
    it("Should allow transfer of tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      await expect(noruToken.connect(owner).transfer(user1.address, transferAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, user1.address, transferAmount);

      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - transferAmount);
      expect(await noruToken.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Should not allow transfer more than balance", async function () {
      const tooLargeAmount = INITIAL_SUPPLY + ethers.parseUnits("1", 18); 
      await expect(
        noruToken.connect(owner).transfer(user1.address, tooLargeAmount)
      ).to.be.revertedWithCustomError(noruToken, "ERC20InsufficientBalance").withArgs(owner.address, INITIAL_SUPPLY, tooLargeAmount);
    });

    it("Should allow approval and transferFrom", async function () {
      const approveAmount = ethers.parseUnits("50", 18);
      const transferAmount = ethers.parseUnits("30", 18);

      await expect(noruToken.connect(owner).approve(user1.address, approveAmount))
        .to.emit(noruToken, "Approval")
        .withArgs(owner.address, user1.address, approveAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(approveAmount);

      await expect(noruToken.connect(user1).transferFrom(owner.address, user2.address, transferAmount))
        .to.emit(noruToken, "Transfer")
        .withArgs(owner.address, user2.address, transferAmount);

      expect(await noruToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - transferAmount);
      expect(await noruToken.balanceOf(user2.address)).to.equal(transferAmount);
      expect(await noruToken.allowance(owner.address, user1.address)).to.equal(approveAmount - transferAmount);
    });

    it("Should not allow transferFrom more than approved amount", async function () {
      const approveAmount = ethers.parseUnits("50", 18);
      const transferAmount = ethers.parseUnits("60", 18); // More than approved
      await noruToken.connect(owner).approve(user1.address, approveAmount);
      await expect(
        noruToken.connect(user1).transferFrom(owner.address, user2.address, transferAmount)
      ).to.be.revertedWithCustomError(noruToken, "ERC20InsufficientAllowance").withArgs(user1.address, approveAmount, transferAmount);
    });
  });

  describe("Role Management", function () {
    it("Only DEFAULT_ADMIN_ROLE should be able to grant roles", async function () {
      const SOME_OTHER_ROLE = ethers.id("SOME_OTHER_ROLE");
      await expect(noruToken.connect(user1).grantRole(SOME_OTHER_ROLE, user2.address))
        .to.be.revertedWithCustomError(noruToken, "AccessControlUnauthorizedAccount")
        .withArgs(user1.address, DEFAULT_ADMIN_ROLE);

      await expect(noruToken.connect(owner).grantRole(SOME_OTHER_ROLE, user2.address))
        .to.emit(noruToken, "RoleGranted")
        .withArgs(SOME_OTHER_ROLE, user2.address, owner.address);
      expect(await noruToken.hasRole(SOME_OTHER_ROLE, user2.address)).to.be.true;
    });
  });

  describe("Upgradeability (UUPS)", function () {
    it("Should be upgradeable by an admin to NORUTokenV2", async function () {
      const NORUTokenV2Factory = await ethers.getContractFactory("NORUTokenV2"); 
      const noruTokenAddress = await noruToken.getAddress();
      
      const upgradedToken = (await upgrades.upgradeProxy(
        noruTokenAddress,
        NORUTokenV2Factory
      )) as unknown as NORUTokenV2;
      await upgradedToken.waitForDeployment();

      expect(await upgradedToken.getAddress()).to.equal(noruTokenAddress);
      expect(await upgradedToken.version()).to.equal("V2"); 

      // Check if basic ERC20 functions still work
      expect(await upgradedToken.name()).to.equal(TOKEN_NAME);
      expect(await upgradedToken.symbol()).to.equal(TOKEN_SYMBOL);
      expect(await upgradedToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await upgradedToken.cap()).to.equal(TOKEN_CAP); // Check cap is retained
    });

    it("Should not be upgradeable by a non-admin", async function () {
      const NORUTokenV2Factory = await ethers.getContractFactory("NORUTokenV2");
      const noruTokenV2Impl = await NORUTokenV2Factory.deploy(); 
      await noruTokenV2Impl.waitForDeployment();
      
      await expect(
        noruToken.connect(user1).upgradeToAndCall(await noruTokenV2Impl.getAddress(), "0x")
      ).to.be.revertedWithCustomError(noruToken, "AccessControlUnauthorizedAccount")
       .withArgs(user1.address, DEFAULT_ADMIN_ROLE);
    });
  });
});
