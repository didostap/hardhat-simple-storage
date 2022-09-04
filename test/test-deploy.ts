import { expect, assert } from 'chai';
import { ethers } from 'hardhat';
import { SimpleStorage, SimpleStorage__factory } from '../typechain-types';

describe('Simple Storage', () => {
    let simpleStorageFactory: SimpleStorage__factory;
    let simpleStorage: SimpleStorage;
    beforeEach(async () => {
        simpleStorageFactory = (await ethers.getContractFactory('SimpleStorage')) as SimpleStorage__factory;
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it('Should start with a favorite number of 0', async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = '0';
        assert.equal(currentValue.toString(), expectedValue);
    });

    it('Should update when we call store', async () => {
        const expectedValue = '7';
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    });

    it('Should add person when we call addPerson', async () => {
        const expectedName = 'Bob';
        const expectedFavoriteNumber = '10';
        const transactionResponse = await simpleStorage.addPerson(
            expectedName,
            expectedFavoriteNumber
        );
        await transactionResponse.wait(1);

        const person = await simpleStorage.people(0);
        const favoriteNumber = await simpleStorage.nameToFavoriteNumber(
            expectedName
        );

        assert.equal(person.name, expectedName);
        assert.equal(person.favoriteNumber.toString(), expectedFavoriteNumber);
        assert.equal(favoriteNumber.toString(), expectedFavoriteNumber);
    });
});
