// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//@title ma collection de NFT
//@Paymentsplitter permet de diviser le paiement en % pour chaque membre d'une équipe
//@Strings Converts a `uint256` to its ASCII `string` decimal representation.
//@Strings gerer les fonctions lié a Onlyowner
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./library/ERC721A.sol";

contract NFTERC721A is Ownable, ERC721A, PaymentSplitter {

    using Strings for uint;

//0 = Before, 1 = WhitelistSale 2 = PublicSale,3 = SoldOut,4 = Reveal
    enum Step {
        Before,
        WhitelistSale,
        PublicSale,
        SoldOut,
        Reveal
    }

    string public baseURI;

    Step public sellingStep;

    uint private constant MAX_SUPPLY = 50;
    uint private constant MAX_WHITELIST = 2;
    uint private constant MAX_PUBLIC = 43;
    uint private constant MAX_GIFT = 5;

    uint public wlSalePrice = 10 ether;
    uint public publicSalePrice = 10 ether;

    bytes32 public merkleRoot;

    uint public saleStartTime = 1661374809;

    mapping(address => uint) public amountNFTsperWalletWhitelistSale;//permet d'assigner un int aune adresse, pour dire "cette adresse a déja mint"

    uint private teamLength;

    //Changer le nom de la collection
    constructor(address[] memory _team, uint[] memory _teamShares, bytes32 _merkleRoot, string memory _baseURI) ERC721A("PingouinOnBlockchain", "POB")
    PaymentSplitter(_team, _teamShares) {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
        teamLength = _team.length;
    }
    //verifie qu'on appelle pas d'un autre contrat et bien d'un utilisateur
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }
    //Permet de mint si on est whitelisté (merkleroot), et si step = 1 et si starttime est ok  
    function whitelistMint(address _account, uint _quantity, bytes32[] calldata _proof) external payable callerIsUser {
        uint price = wlSalePrice;
        require(price != 0, "Price is 0");
        require(currentTime() >= saleStartTime, "Whitelist Sale has not started yet");
        require(currentTime() < saleStartTime + 300 minutes, "Whitelist Sale is finished");//5 heure pour la whitelist
        require(sellingStep == Step.WhitelistSale, "Whitelist sale is not activated");
        require(isWhiteListed(msg.sender, _proof), "Not whitelisted");
        require(amountNFTsperWalletWhitelistSale[msg.sender] + _quantity <= 1, "You can only get 1 NFT on the Whitelist Sale");
        require(totalSupply() + _quantity <= MAX_WHITELIST, "Max supply exceeded");
        require(msg.value >= price * _quantity, "Not enought funds");
        amountNFTsperWalletWhitelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }
    //Permet de mint si on est whitelisté (merkleroot), et si step = 2 et si starttime est ok  
    function publicSaleMint(address _account, uint _quantity) external payable callerIsUser {
        uint price = publicSalePrice;
        require(price != 0, "Price is 0");
        require(sellingStep == Step.PublicSale, "Public sale is not activated");
        require(totalSupply() + _quantity <= MAX_WHITELIST + MAX_PUBLIC, "Max supply exceeded");
        require(msg.value >= price * _quantity, "Not enought funds");
        _safeMint(_account, _quantity);
    }
    //Permet d'offrir un NFT a une utilisateur apres la public sale step > 2 
    function gift(address _to, uint _quantity) external onlyOwner {
        require(sellingStep > Step.PublicSale, "Gift is after the public sale");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Reached max Supply");
        _safeMint(_to, _quantity);
    }

    function setSaleStartTime(uint _saleStartTime) external onlyOwner {
        saleStartTime = _saleStartTime;
    }

    function setBaseUri(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function currentTime() internal view returns(uint) {
        return block.timestamp;
    }

    function setStep(uint _step) external onlyOwner {
        sellingStep = Step(_step);
    }

    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    //Whitelist
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function isWhiteListed(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        return _verify(leaf(_account), _proof);
    }

    function leaf(address _account) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    function _verify(bytes32 _leaf, bytes32[] memory _proof) internal view returns(bool) {
        return MerkleProof.verify(_proof, merkleRoot, _leaf);
    }

    //ReleaseALL Distribue le cash  entre les différentes adresses
    function releaseAll() external {
        for(uint i = 0 ; i < teamLength ; i++) {
            release(payable(payee(i)));
        }
    }

    receive() override external payable {
        revert('Only if you mint');
    }

}