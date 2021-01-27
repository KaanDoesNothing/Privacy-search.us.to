const puppeteer = require("puppeteer");

const scraper = require("./news");

(async () => {
    scraper.setBrowser(await puppeteer.launch({headless: true}));

    let date = Date.now();
    console.log(await scraper.scrape());
    console.log(Date.now() - date);
})();