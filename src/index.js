const puppeteer = require("puppeteer");
const scraper = require("ddg-scraper/src/index");
const googleNewsScraper = require("google-news-scraper");
const express = require("express");
const enmap = require("enmap");

const isDebugging = require("./isDebugging")();

console.log(`Debugging: ${isDebugging}`);

const search_results = new enmap({name: "search_results"});
const news_results = new enmap({name: "news_results"});

let browser;

(async () => {
    browser = await puppeteer.launch({headless: false, args: ["--no-sandbox"]});

    scraper.setBrowser(browser);
})();

const app = express();

app.set("view engine", "pug");
app.use("/static", express.static("./public"));

if(!isDebugging) {
    app.set("view cache", true);
}

app.get("/", async (req, res) => {
    let {q, cache} = req.query;

    if(q) {
        q = q.toLowerCase();

        if(cache) {
            cache = parseInt(cache);
        }else {
            cache = 1;
        }

        const Results = await search(q, cache === 1 ? true : false);

        return res.render("results", {Results, q});
    }else {
        return res.render("home");
    }
});

app.get("/news", async (req, res) => {
    try {
        const articles = await googleNewsScraper({
            prettyURLs: false,
            timeframe: "5h",
            puppeteerArgs: ["--no-sandbox"]
        });

        news_results.set(Date.now().toString(), articles);
    
        return res.json({articles: articles});
    }catch(err) {
        console.log(err);
        return res.json({error: "Error"});
    }
});

app.get("/news/all", async (req, res) => {
    let keys = news_results.keyArray();
    let results = keys.map(key => news_results.get(key));

    return res.json({articles: results});
});

app.get("/preview/", async (req, res) => {
    let {url} = req.query; 

    const result = await previewPage(url);

    res.set({
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=screenshot.png"
    });
    
    res.send(result);
});

async function search(q, cache = true) {
    let Results = search_results.get(q);

    if(Results) {
        if(!Results.date) Results.date = 0;
    }

    let cacheExpired = Date.now() - (Results.date || 0) > 21600000;

    if(cacheExpired) {
        cache = false;
    }

    if(!Results || !cache) {
        let scraped = await scraper.scrape(q);

        search_results.set(q, {rows: scraped, date: Date.now()});

        Results = search_results.get(q);
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