import { ethers } from "hardhat";

async function main() {
  //ici nous utilisons getContractFactory pour appeler notre Contrat
  const Nft = await ethers.getContractFactory("NFTERC721A");
  //Ensuite nous deployons notre contrat,  notre constructeur demande 4 arguments
  //1er argmuent : un tableau d'adresse qui vont recevoir la tune du contrat
  //2eme argument : la part de chacun
  //3eme argument : le code Merkletree pour les adresses whitelistés
  //4eme argument : l'url IPFS des fichiers json  (et non les images), ne pas oublier de finir avec : / 
  const nft = await Nft.deploy(["0x960EfB4aA6380e31B5696dd1c57b3526CFc32e8c"],[100],"0x5c994ee14b6fe9662bb01f57c2604635110fd41182c1b7b298d61e3138d6b99e","ipfs://QmXTCS2zdrstPWGTkuZmNgpDApFeg5FiWugZGs3jQW6DuQ/");
  await nft.deployed();
  //permet d'afficher l'adresse du contrat dans la console
  console.log(`deployed to ${nft.address}`);  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
