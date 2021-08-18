import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import applyEvasions from "../applyEvasions";
import fetch from "cross-fetch";

export default async (browser) => {
    let page = (await browser.pages())[0];

    let blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch);
    
    await blocker.enableBlockingInPage(page);
    await applyEvasions(page);
    
    return page;
}