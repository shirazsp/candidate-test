import { Page } from "playwright";
import { PageBase } from "./page-base";

const CREATE_NEW_RESTURANT_BUTTON = "//button[contains(text(),'Create new')]";
const DELETE_RESTAURANT_BUTTON = function (x: number) {
    return "//td[2][contains(text(),'" + x.toString() + "')]/following-sibling::td/button"
};
const RESTAURANT_ID_TD = function (x: number) { return "//td[2][contains(text(),'" + x.toString() + "')]" };

const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]";
const POPUP_ID_FIELD = "//input[@id='id']";
const POPUP_NAME_FIELD = "//input[@id='name']";
const POPUP_ADDRESS_FIELD = "//input[@id='address']";
const POPUP_SCORE_FIELD = "//input[@id='score']";
const POPUP_SUBMIT_BUTTON = "//button[contains(text(),'Submit')]";

const CREATED_POPUP_TITLE = "//h2[contains(text(),'Created!')]";
const CREATED_POPUP_OK_BUTTON = "//div[@id='alert-popup']/*/button[contains(text(),'OK')]";


export class RestaurantPage extends PageBase {

    constructor(page: Page) {
        super(page);
    }

    clickreateNewRestaurantButtone = async () => {
        await this.page.click(CREATE_NEW_RESTURANT_BUTTON);
    }
    checkIfTitleInPopupExcit = async () => {
        return await this.page.isVisible(POPUP_TITLE);
    }
    fillPopupFieldsAndSubmit = async (id: number, name: string, address: string, score: number) => {
        let inputField;
        //fill 'id' field
        inputField = this.page.locator(POPUP_ID_FIELD);
        await inputField.fill(id.toString());
        //fill 'name' field
        inputField = this.page.locator(POPUP_NAME_FIELD);
        await inputField.fill(name);
        //fill 'address' field
        inputField = this.page.locator(POPUP_ADDRESS_FIELD);
        await inputField.fill(address);
        //fill 'score' field
        inputField = this.page.locator(POPUP_SCORE_FIELD);
        await inputField.fill(score.toString());
        //click 'submit' button
        await this.page.click(POPUP_SUBMIT_BUTTON);
    }
    checkIfCreatedPopupTitleExist = async () => {
        return await this.page.isVisible(CREATED_POPUP_TITLE);
    }
    clickOkButtonInCreatedPopup = async () => {
        await this.page.click(CREATED_POPUP_OK_BUTTON);
    }
    deleteRestaurantById = async (id: number) => {
        await this.page.click(DELETE_RESTAURANT_BUTTON(id));
    }
    getRestaurantByID = async (id: number) => {
        const count = await this.page.locator(RESTAURANT_ID_TD(id)).count();
        if (count > 0) {
            const idElement = await this.page.locator(RESTAURANT_ID_TD(id));
            const nameElement = await this.page.locator(RESTAURANT_ID_TD(id) + "/following-sibling::td[1]");
            const addressElement = await this.page.locator(RESTAURANT_ID_TD(id) + "/following-sibling::td[2]");
            const scoreElement = await this.page.locator(RESTAURANT_ID_TD(id) + "/following-sibling::td[3]");

            return {
                id: Number(await idElement.textContent()),
                name: await nameElement.textContent(),
                address: await addressElement.textContent(),
                score: Number(await scoreElement.textContent())
            };
        }
        return null;
    };


}