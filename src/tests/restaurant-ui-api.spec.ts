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

    // afterEach('Close browser', async () => {
    //     await browser.close();
    // })

    it('Create a new Restaurant and delete it', async function () {
        await resturantPage.clickreateNewRestaurantButtone();
        let actualResult = await resturantPage.checkIfTitleInPopupExcit();
        expect(actualResult, 'Restaurants popup was not opened').to.be.true;
    })
})


