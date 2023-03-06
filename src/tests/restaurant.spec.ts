import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import { expect, assert } from 'chai';


import restaurantsAPI from '../logic/REST/restaurantsAPI';

describe('Restaurants tests', () => {

    beforeEach('Reset restaurant server', async () => {
        //Arrange
        await restaurantsAPI.resetServer();
    })

    it('Validate the amount of restaurants', async () => {
        //Act
        const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();

        //Assert
        expect(restaurants.success).to.be.true;
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected');
    })

    it('Get restaurant by id', async () => {
        //Arrange
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);

        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.status).to.equal(200);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.data).to.deep.equal(myNewRest);
    })

    it('Get non exsisting restaurant', async () => {
        //Act
        const getByIdResponse = await restaurantsAPI.getRestaurantById(233);

        //Assert
        expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Delete exsisting restaurant', async () => {
        //Arrange
        const restauranteId = 233;
        const myNewRest = { address: "My Addess 1", id: restauranteId, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        // if we can't create a restaurante there is no point to continue the test
        assert.equal(createResponse.status, 201, "unable to create a restaurante");

        //Act
        const deleteByIdResponse = await restaurantsAPI.deleteRestaurantById(restauranteId);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(restauranteId);

        //Assert
        expect(deleteByIdResponse.success).to.be.true;
        expect(deleteByIdResponse.status).to.equal(200);
        //make sure that the restauante doesn't exist
        expect(getByIdResponse.error).to.equal("restaurant with given id not found");
        expect(getByIdResponse.success).to.be.false;
        expect(getByIdResponse.status).to.equal(404);
    })

    it('Delete non exsisting restaurant', async () => {
        //Act
        const deleteByIdResponse = await restaurantsAPI.deleteRestaurantById(9999);

        //Assert
        expect(deleteByIdResponse.error).to.equal("restaurant with given id not found");
        expect(deleteByIdResponse.success).to.be.false;
        expect(deleteByIdResponse.status).to.equal(404);
    })

    it('Update restaurant address', async () => {
        //Arrange
        //create a new restaurante
        const restauranteId: number = 233;
        const myNewRest = { address: "My Addess 1", id: restauranteId, name: "My Restaurant", score: 2.3 };
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);
        //new address
        const newAddress = { address: "My Address 2" };

        //Act
        const updateParamByIdResponse = await restaurantsAPI.updatesRestaurant(restauranteId, newAddress);
        const getByIdResponse: any = await restaurantsAPI.getRestaurantById(restauranteId);

        //Assert
        expect(getByIdResponse.data?.address).to.equal(newAddress.address);
        expect(getByIdResponse.success).to.be.true;
        expect(getByIdResponse.status).to.equal(200);
    })

    it('Create a new restaurant', async () => {
        //Arrange
        const myNewRest = { address: "My Addess 1", id: 233, name: "My Restaurant", score: 2.3 };

        //Act
        const createResponse = await restaurantsAPI.createRestaurant(myNewRest);

        //Assert
        expect(createResponse.success).to.be.true;
        expect(createResponse.status).to.equal(200);
    })

})