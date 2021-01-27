const puppeteer = require("puppeteer");
const scraper = require("ddg-scraper/src/index");
const express = require("express");
const enmap = require("enmap");

const search_results = new enmap({name: "search_results"});

let browser;

(async () => {
    browser = await puppeteer.launch({headless: false, args: ["--no-sandbox"]});

    scraper.setBrowser(browser);
})();

const app = express();

app.set("view engine", "pug");

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

async function search(q) {
    let Results = search_results.get(q);

    if(!Results) {
        Results = await scraper.scrape(q);

        search_results.set(q, Results);
    }

    return Results;
}

app.listen(5001);