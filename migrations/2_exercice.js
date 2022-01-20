const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExSolution = artifacts.require("ExerciceSolution.sol");
var ExSolutionToken = artifacts.require("ExerciceSolutionToken.sol");

const i = 0;

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await getContract(deployer, network, accounts); 
        await deployEx(deployer, network, accounts); 
        await doExercice(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts); 
    });
};

async function getContract(deployer, network, accounts) {
	TDToken = await TDErc20.at("0x77dAe18835b08A75490619DF90a3Fa5f4120bB2E")
	ClaimableToken = await ERC20Claimable.at("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94")
	Evaluator = await evaluator.at("0x384C00Ff43Ed5376F2d7ee814677a15f3e330705")
}

async function deployEx(deployer, network, accounts) {
	SolutionToken = await ExSolutionToken.new({from: accounts[i]});
	Solution = await ExSolution.new(ClaimableToken.address, SolutionToken.address, {from: accounts[i]});
	await Evaluator.submitExercice(Solution.address, {from: accounts[i]});
}

async function doExercice(deployer, network, accounts) {
	//setup
	await SolutionToken.setMinter(Solution.address, true, {from: accounts[i]});
	await ClaimableToken.claimTokens({from: accounts[i]});

	//ex1
	console.log('ex1');
	await Evaluator.ex1_claimedPoints({from: accounts[i]});
	//ex2 
	console.log('ex2');
	await Evaluator.ex2_claimedFromContract({from: accounts[i]});

	//ex3
	console.log('ex3');
	await Evaluator.ex3_withdrawFromContract({from: accounts[i]});

	//ex4
	console.log('ex4');
	await ClaimableToken.approve(Solution.address, new BigNumber('1000').multipliedBy(new BigNumber('1e18')), {from: accounts[i]});
	await Evaluator.ex4_approvedExerciceSolution({from: accounts[i]});

	//ex5
	console.log('ex5');
	await ClaimableToken.approve(Solution.address, 0, {from: accounts[i]});
	await Evaluator.ex5_revokedExerciceSolution({from: accounts[i]});

	//ex6
	console.log('ex6');
	await Evaluator.ex6_depositTokens({from: accounts[i]});

	//ex7
	console.log('ex7');
	await Evaluator.ex7_createERC20({from: accounts[i]});

	//ex8
	console.log('ex8');
	await Evaluator.ex8_depositAndMint({from: accounts[i]});
	
	//ex9
	console.log('ex9');
	await Evaluator.ex9_withdrawAndBurn({from: accounts[i]});
}

async function deployRecap(deployer, network, accounts) {
	const balance = await TDToken.balanceOf(accounts[i]);
	console.log(
		((new BigNumber(balance.toString())
		.div(new BigNumber('1e18'))))
		.toString()
	);
}


