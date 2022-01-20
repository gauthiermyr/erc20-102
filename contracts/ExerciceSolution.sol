pragma solidity ^0.6.0;

import "./IExerciceSolution.sol";
import "./ExerciceSolutionToken.sol";
import "./ERC20Claimable.sol";

contract ExerciceSolution is IExerciceSolution{

    address payable public _owner;
    ExerciceSolutionToken public _wrappedToken;
    ERC20Claimable public _claimableToken;

	mapping(address => uint256) public _claimedTokens;

    constructor(address claimableTokenAddress_, address tokenAddress_) public {
        _owner = payable(msg.sender);
        _claimableToken = ERC20Claimable(claimableTokenAddress_);
        _wrappedToken = ExerciceSolutionToken(tokenAddress_);
    }

    function claimTokensOnBehalf() override external {
        _claimableToken.claimTokens();
        _wrappedToken.mint(msg.sender, _claimableToken.distributedAmount());
    }

	function tokensInCustody(address callerAddress) override external returns (uint256) {
        return _wrappedToken.balanceOf(callerAddress);
    }

	function withdrawTokens(uint256 amountToWithdraw) override external returns (uint256) {
        require(0 < _wrappedToken.balanceOf(msg.sender), "Nothing to withdraw");
        require(amountToWithdraw <= _wrappedToken.balanceOf(msg.sender), "Too high amount");
        require(amountToWithdraw > 0, "Can't be negative");

        bool res = _claimableToken.transfer(msg.sender, amountToWithdraw);
        require(res, "Transfer error");
        _wrappedToken.burn(msg.sender, amountToWithdraw);
        return _wrappedToken.balanceOf(msg.sender);
    }

	function depositTokens(uint256 amountToDeposit) override external returns (uint256) {
        require(amountToDeposit > 0, "Can't be negative");
        bool res = _claimableToken.transferFrom(msg.sender, address(this), amountToDeposit);
        require(res, "Transfer failed");
        _wrappedToken.mint(msg.sender, amountToDeposit);
        return _wrappedToken.balanceOf(msg.sender);
    }

	function getERC20DepositAddress() override external returns (address) {
        return address(_wrappedToken);
    }


}