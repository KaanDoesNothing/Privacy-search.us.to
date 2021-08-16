import axios from "axios";
import cheerio from "cheerio";

import {Scraper} from "../lib/scraper";

export default class extends Scraper {
    public async scrape() {
        let final = [];
    
        let rawHTML: string = (await axios.post(`https://www.startpage.com/sp/search?query=${this.query}`, {
            "query": this.query,
            "page": 1,
            "cat": "web",
            "cmd": "process_search",
            "engine0": "v1all",
        }, {
            headers: {
                "Content-Length": 0,
                "User-Agent": "PostmanRuntime/7.26.8",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            }
        })).data;
    
        const $ = cheerio.load(rawHTML);
    
        let results = $(".w-gl__result__main");
    
        results.each((i) => {
            let element = $(results[i]);
    
            let title = element.find(".w-gl__result-title").text().trim();
            let content = element.find(".w-gl__description").text().trim();
            let url = element.find(".w-gl__result-url").text().trim();
    
            this.pushToResults({
                title,
                content,
                url
            });
        });
    
        return this.results;
    }
}