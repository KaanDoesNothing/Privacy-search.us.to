import puppeteer from "puppeteer";
import crossfetch from "cross-fetch";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import applyEvasions from "./lib/applyEvasions";
import create_browser from "./lib/view_manager/browser";
import create_page from "./lib/view_manager/page";

let blocker;

//Initialize the blocker
(async () => {
    blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(crossfetch);
})();

export const takeScreenshot = async (url: string) => {
    const browser = await create_browser();
    const page = await create_page(browser);

    await page.goto(fixURL(url), { waitUntil: "networkidle2", timeout: 60000 });

    const screenshot = await page.screenshot({
        fullPage: true,
        omitBackground: true
    });

    await page.close();

    return screenshot;
}

export const fixURL = (url) => {
    let httpString = "http://";
    let httpsString = "https://";
    if (url.substr(0, httpString.length).toLowerCase() !== httpString && url.substr(0, httpsString.length).toLowerCase() !== httpsString) url = httpString + url;
    return url;
}