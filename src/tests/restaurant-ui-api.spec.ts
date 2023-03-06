import { expect } from 'chai';
import { RestaurantPage } from '../logic/pages/restaurant-page';
import { BrowserWrapper } from '../infra/browser/browser';
import { ApiResponse } from '../infra/rest/api-response';
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response';
import configJson from '../../config.json';
import restaurantsAPI from '../logic/REST/restaurantsAPI';


describe('UI-API tests', () => {
    let browser: BrowserWrapper;
    let resturantPage: RestaurantPage;

    beforeEach('Start browser', async () => {
        //Arrange
        await restaurantsAPI.resetServer();
        browser = new BrowserWrapper();
        resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl);
    })

    afterEach('Close browser', async () => {
        await browser.close();
    })

    it.only('Create a new Restaurant and delete it', async function () {
        //Arrange
        let restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants();
        const initialAmount = restaurants.data?.length;
        const newRestaurantId: number = 777;

        //Act
        //create a new restaurante
        await resturantPage.clickreateNewRestaurantButtone();
        await resturantPage.checkIfTitleInPopupExcit();
        await resturantPage.fillPopupFieldsAndSubmit(
            newRestaurantId,
            "The Happy Malawach",
            "Weizmann 135, Kfar Saba",
            4.9)
        await resturantPage.checkIfCreatedPopupTitleExist();
        await resturantPage.clickOkButtonInCreatedPopup();

        //delete the new restaurante
        await resturantPage.deleteRestaurantById(newRestaurantId);
        // add a small delay after the delete operation
        await new Promise(r => setTimeout(r, 1000));
        restaurants = await restaurantsAPI.getRestaurants();
        const getRestaurantResult = await resturantPage.getRestaurantByID(newRestaurantId);
        const getByIdResponse = await restaurantsAPI.getRestaurantById(newRestaurantId);


        //Assert
        //validate the actual restaurants amount equals to the initial amount (after deletion)
        const actualAmount = restaurants.data?.length;
        expect(actualAmount).to.equal(initialAmount, 'Restaurants amount is not as expected');
        //validate that the deleted restaurant is missing from the UI
        expect(getRestaurantResult, 'Restaurant exist after it been deleted').to.be.null;

        //validate that the deleted restaurant is missing using the API
        expect(getByIdResponse.success, "'Restaurant exist after it been deleted'").to.be.false;
        expect(getByIdResponse.status).to.equal(404);

    })
})


