import { Scraper } from "../lib/scraper";

export default class extends Scraper {
    public async scrape() {
        let final = [];
    
        const json = (await this.get({url: `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrsearch='${this.query}'`}));
    
        for(let i in json.query.pages) {
            let page = json.query.pages[i];
    
            this.pushToResults({
                title: page.title,
                content: `Wikipedia article: ${page.pageid}`,
                url: encodeURI(`https://en.wikipedia.org/wiki/${page.title}`)
            });
        }

        return this.results;
    }
}