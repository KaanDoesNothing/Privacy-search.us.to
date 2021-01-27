const puppeteer = require("puppeteer");
const scraper = require("ddg-scraper/src/index");
const googleNewsScraper = require("google-news-scraper");
const express = require("express");
const enmap = require("enmap");

const search_results = new enmap({name: "search_results"});

let browser;

(async () => {
    browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});

    scraper.setBrowser(browser);
})();

const app = express();

app.set("view engine", "pug");
app.use("/static", express.static("./public"));

app.get("/", async (req, res) => {
    let {q} = req.query;

    if(q) {
        q = q.toLowerCase();

        const Results = await search(q);

        return res.render("results", {Results, q});
    }else {
        return res.render("home");
    }
});

app.get("/news", async (req, res) => {
    const articles = await googleNewsScraper({
        prettyURLs: false,
        timeframe: "5h",
        puppeteerArgs: []
    });

    return res.json({articles: articles});
});

app.get("/preview/", async (req, res) => {
    let {url} = req.query; 

    const result = await previewPage(url);

    res.set({"Content-Type": "image/png"});
    
    res.send(result);
});

async function search(q) {
    let Results = search_results.get(q);

    if(!Results) {
        Results = await scraper.scrape(q);

        search_results.set(q, Results);
    }

    return Results;
}

async function previewPage(url) {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    const screenshot = await page.screenshot({
        fullPage: true,
        omitBackground: true
    });

    await page.close();

    return screenshot;
}

app.listen(5001);