import axios from "axios";
import path from "path";

export class Scraper {
    public name: string;
    public results: string[];
    public query: string;

    constructor({query}) {
        this.name = path.basename(__filename);

        this.query = query;
        this.results = [];
    }

    public pushToResults(data) {
        this.results.push({...data, scraper: this.name});
    }

    async get({url}) {
        return (await axios.post(url)).data; 
    }
}