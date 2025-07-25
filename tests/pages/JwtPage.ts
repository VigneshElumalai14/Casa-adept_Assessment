import { Page, Locator } from '@playwright/test';

export default class JwtLoginWeb {
    readonly page: Page;
    readonly jWtDecoder:Locator;
    readonly JwtEncoderTextArea:Locator;
    readonly payloadtext:Locator;
    readonly validationSignatureMessageVisible:Locator;
    readonly secretKeyTextArea:Locator;
     
    constructor(page: Page) {
        this.page = page;
        this.jWtDecoder=page.locator("li[data-testid='decoder-tab']");
        this.JwtEncoderTextArea=page.locator(".npm__react-simple-code-editor__textarea");
        this.payloadtext=page.locator(".json-viewer_snippet__ba8SN");
        this.validationSignatureMessageVisible=page.locator(".token-decoder-signature-validation_container__OaHBu");
        this.secretKeyTextArea=page.locator(".__className_bbed0d.widget-textarea_input__SwHZ7");
    }

    async launchUrl() {
        await this.page.goto('/');
    }


        


}