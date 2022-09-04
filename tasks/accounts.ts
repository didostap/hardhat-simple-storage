import { task } from 'hardhat/config';

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    accounts.forEach((accounts) => console.log(accounts.address));
});
