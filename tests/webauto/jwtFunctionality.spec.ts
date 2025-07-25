import { Browser, BrowserContext, chromium, expect, Page, test } from '@playwright/test';
import JwtLoginWeb from '../pages/JwtPage';
import * as inputjson from '../inputdata/input.json';

// Test Suite: JWT Functionality Tests
test.describe('JWT Functionality Tests', () => {
  // Test Fixtures
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let jwtWebPage: JwtLoginWeb;
  let decoderStatus: string | null;
  let decodedPayload: string | null;

  // Setup and Teardown
  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    jwtWebPage = new JwtLoginWeb(page);
    await jwtWebPage.launchUrl();
  });
    
  test.afterAll(async () => {
    await browser.close();
  });

  // Test Cases
  test('JWT Decoder tab should be active by default', async () => {
    decoderStatus = await jwtWebPage.jWtDecoder.getAttribute('data-active');
    if (decoderStatus === 'true') {
      console.log("JWT Decoder is highlighted as expected.");
    } else {
      console.log("JWT Decoder is NOT active. Clicking to activate.");
      await jwtWebPage.jWtDecoder.click();
    }
  });

  test('Should be able to enter token in the Encoded Value text area', async () => {
    await jwtWebPage.JwtEncoderTextArea.fill(inputjson.ValidToken);
    const inputdataComparing = await jwtWebPage.JwtEncoderTextArea.inputValue();
    expect(inputdataComparing).toBe(inputjson.ValidToken);
  });

  test('Should display correct payload for valid token', async () => {
    await jwtWebPage.JwtEncoderTextArea.fill(inputjson.ValidToken);
    decodedPayload = await jwtWebPage.payloadtext.nth(1).textContent();
    
    if (decodedPayload !== null) {
      const payload = JSON.parse(decodedPayload);
      expect(payload.c).toBe(3);
      console.log("Value of c:", payload.c);
    } else {
      throw new Error("Decoded payload text is null");
    }
  });

  test('Should validate JWT signature with secret key', async () => {
    // Test Setup
    await jwtWebPage.JwtEncoderTextArea.fill(inputjson.ValidToken);
    const decodedPayloadBeforeChange = await jwtWebPage.payloadtext.nth(1).textContent();
    console.log("Decoded payload before change:", decodedPayloadBeforeChange);
    await page.waitForTimeout(1000);

    // Verify Initial State
    const isMessageVisible = await jwtWebPage.validationSignatureMessageVisible.textContent();
    expect(isMessageVisible).toContain('Invalid Signature');
    console.log("Invalid Signature message verified for invalid token");

    // Apply Secret Key
    await jwtWebPage.secretKeyTextArea.fill(inputjson.SecretKey);
    await page.waitForTimeout(1000);

    // Verify Signature Validation
    const isMessageNotVisible = await jwtWebPage.validationSignatureMessageVisible.textContent();
    expect(isMessageNotVisible).not.toContain('Invalid Signature');
    console.log("Valid Signature message verified after entering secret key");

    // Change Secret Key
    await jwtWebPage.secretKeyTextArea.fill(inputjson.SecretKey + '123');
    await page.waitForTimeout(1000);

    // Verify Token and Payload
    const newToken = await jwtWebPage.JwtEncoderTextArea.inputValue();
    const newDecodedPayload = await jwtWebPage.payloadtext.nth(1).textContent();
    
    expect(newToken).toBe(inputjson.ValidToken);
    console.log("Token remains unchanged after changing secret key");
    
    expect(newDecodedPayload).toBe(decodedPayloadBeforeChange);
    console.log("Decoded payload remains the same after changing secret key");
  });
});