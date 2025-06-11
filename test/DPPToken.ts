import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("DPPToken", function () {
  it("mints and restricts transfers", async function () {
    const [admin, user1, user2] = await ethers.getSigners();
    const DPPToken = await ethers.getContractFactory("DPPToken");
    const token = await upgrades.deployProxy(DPPToken, [admin.address], { kind: "uups" });

    await token.mint(user1.address, 1);
    expect(await token.ownerOf(1)).to.equal(user1.address);

    await expect(token.connect(user1).transferFrom(user1.address, user2.address, 1)).to.be.revertedWith(
      "Transfer restricted"
    );

    await token.grantRole(await token.TRANSFER_ROLE(), user1.address);
    await token.connect(user1).transferFrom(user1.address, user2.address, 1);
    expect(await token.ownerOf(1)).to.equal(user2.address);

    await expect(token.approve(user1.address, 1)).to.be.revertedWith("Soulbound");
  });

  it("upgrades to v2", async function () {
    const [admin] = await ethers.getSigners();
    const DPPToken = await ethers.getContractFactory("DPPToken");
    const token = await upgrades.deployProxy(DPPToken, [admin.address], { kind: "uups" });

    const DPPTokenV2 = await ethers.getContractFactory("DPPTokenV2");
    const upgraded = await upgrades.upgradeProxy(await token.getAddress(), DPPTokenV2);
    expect(await upgraded.version()).to.equal(2);
  });
});
