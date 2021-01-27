const puppeteer = require("puppeteer");
const scraper = require("ddg-scraper/src/index");
const express = require("express");

let browser;

(async () => {
    browser = await puppeteer.launch({headless: false});

    scraper.setBrowser(browser);
})();

const app = express();

app.set("view engine", "pug");

app.get("/", async (req, res) => {
    let {q} = req.query;

    if(q) {
        q = q.toLowerCase();

        let cached = await scraper.scrape(q);

        return res.render("results", {Results: cached, q});
    }else {
        return res.render("home");
    }
});

app.listen(5001);