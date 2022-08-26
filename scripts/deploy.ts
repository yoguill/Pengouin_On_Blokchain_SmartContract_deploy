import { ethers } from "hardhat";

async function main() {
  const Nft = await ethers.getContractFactory("NFTERC721A");
  const nft = await Nft.deploy(["0x960EfB4aA6380e31B5696dd1c57b3526CFc32e8c"],[100],"0x5c994ee14b6fe9662bb01f57c2604635110fd41182c1b7b298d61e3138d6b99e","ipfs://QmXTCS2zdrstPWGTkuZmNgpDApFeg5FiWugZGs3jQW6DuQ/");
  await nft.deployed();
  console.log(`deployed to ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
