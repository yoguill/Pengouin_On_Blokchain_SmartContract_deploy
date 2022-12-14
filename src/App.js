import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NftContract from './artifacts/contracts/Nft.sol/NFTERC721A.json';
import './App.css';
import img1 from './img/1.png';
import img2 from './img/2.png';
import img3 from './img/3.png';
import img4 from './img/4.png';
import img5 from './img/5.png';
import img6 from './img/6.png';
import img7 from './img/7.png';
import img8 from './img/8.png';
import img9 from './img/9.png';
import img10 from './img/10.png';

//mettre contrat ici
const GGaddress = "0x6eE274b6CdA33eD7dD0979FeE2abb522b3988dCf";

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({})

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(GGaddress, NftContract.abi, provider);
      try {
        const publicSalePrice = await contract.publicSalePrice();
        const totalSupply = await contract.totalSupply();
        const object = {"publicSalePrice": String(publicSalePrice), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GGaddress, NftContract.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.publicSalePrice
        }
        const transaction = await contract.publicSaleMint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function releaseAll(){
    if(typeof window.ethereum !== 'undefined') {
      //let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GGaddress, NftContract.abi, signer);
      try {
        //ici que ca change sinon on peut juste copier coller et changer la fonction apres contract.
        const transaction = await contract.releaseAll();
        await transaction.wait();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function setStep(){
    if(typeof window.ethereum !== 'undefined') {
      //let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GGaddress, NftContract.abi, signer);
      try {
        const transaction = await contract.setStep(2);
        await transaction.wait();
      }
      catch(err) {
        setError(err.message);
      }
    }    
  }


  return (
    <div className="App">
      <button class="releaseAll" onClick={releaseAll}>Withdraw</button>
      <button class="setStep" onClick={setStep}>SetStep</button>
      <div className="container">
        <div className="banniere">
          <img src={img1} alt="img" />
          <img src={img2} alt="img" />
          <img src={img3} alt="img" />
          <img src={img4} alt="img" />
          <img src={img5} alt="img" />
          <img src={img6} alt="img" />
          <img src={img7} alt="img" />
          <img src={img8} alt="img" />
          <img src={img9} alt="img" />
          <img src={img10} alt="img" />
        </div>
        <br/>
        You need be connected on Polygon Mainet with Metamask
        {/* {error && <p>{error}</p>} */}
        <h1>Mint a Pingouin NFT To save Biodiversity!</h1>
        <p className="count">{data.totalSupply} / 50</p>
        <p className="cost">Each Pingouin NFT costs {data.publicSalePrice / 10**18} Matic (excluding gas fees)</p>
        <button onClick={mint}>BUY one Pingouin NFT</button>
      </div>
    </div>
  );
}

export default App;
