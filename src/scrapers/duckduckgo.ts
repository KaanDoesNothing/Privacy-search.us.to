import cheerio from "cheerio";

import {Scraper} from "../lib/scraper";

export default class extends Scraper {
    public async scrape () {
        const rawHTML: string = await this.get({url: `https://html.duckduckgo.com/html?q=${this.query}`});
    
        const $ = cheerio.load(rawHTML);
    
        let results = $(".web-result");
    
        results.each(i => {
            let element = $(results[i]);
    
            let title = element.find(".result__title").text().trim();
            let content = element.find(".result__snippet").text().trim();
            let url = element.find(".result__url").text().trim();
            let icon = element.find(".result__icon__img").attr("src");
    
            this.pushToResults({
                title,
                content,
                url,
                icon 
            });
        });
    
        return this.results;
    }
}