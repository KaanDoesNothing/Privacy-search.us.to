import puppeteer from "puppeteer";

export const takeScreenshot = async (url: string) => {
    const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    const page = (await browser.pages())[0];

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