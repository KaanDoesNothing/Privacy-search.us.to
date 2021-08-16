import axios from "axios";
import path from "path";

export class Scraper {
    public name: string;
    public results: string[];
    public query: string;
    public times: number;

    constructor(options) {
        this.name = path.basename(__filename);

        this.query = options.query;
        this.results = [];

        this.times = options.times || 1;
    }

    public pushToResults(data) {
        this.results.push({...data, scraper: this.name});
    }

    async get({url}) {
        return (await axios.post(url)).data; 
    }
}