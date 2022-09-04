import { ethers, run, network } from 'hardhat';

const verify = async (contractAddress: string, args: any[]) => {
    console.log('Verifying...');
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already Verified!');
        } else {
            console.log(e);
        }
    }
};

const main = async () => {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );

    console.log('Deploying...');
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log('simpleStorage', simpleStorage.address);
    console.log(network.config);

    // If not a hardhat network as on that netwrok contracts could not be verified
    if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log('Waiting block confirmations...');
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const favNumber = await simpleStorage.retrieve();
    console.log('favNumber', `${favNumber}`);
    await simpleStorage.store(7);
    const newFavNumber = await simpleStorage.retrieve();
    console.log('newFavNumber', `${newFavNumber}`);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
