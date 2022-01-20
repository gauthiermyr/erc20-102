pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC20Mintable.sol";

contract ExerciceSolutionToken is ERC20, IERC20Mintable {

    //TODO verify that only the deployer/owner can change _authorizedToMint

    mapping(address => bool) public _authorizedToMint;

    constructor () public ERC20("WrappedClaimableToken", "wCLTK") {}

    function setMinter(address minterAddress, bool isMinter) override external {
        _authorizedToMint[minterAddress] = isMinter;
    }

	function mint(address toAddress, uint256 amount) override external {
        require(_authorizedToMint[msg.sender], "Not alllowed");
        _mint(toAddress, amount);
    }

	function isMinter(address minterAddress) override external returns (bool) {
        return _authorizedToMint[minterAddress];
    }

    function burn(address account_, uint256 amount_) public {
        _burn(account_, amount_);
    }

}