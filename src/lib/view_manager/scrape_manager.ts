import duckduckgo from "../../scrapers/duckduckgo";
import startpage from "../../scrapers/startpage";
import wikipedia from "../../scrapers/wikipedia";

export const getResults = async ({query}) => {
    let results: any[] = await Promise.all([
        new duckduckgo({query}).scrape(),
        new startpage({query}).scrape(),
        new wikipedia({query}).scrape()
    ]);
    let fixedResults = [];

    //Shitty fix I know
    results.forEach(result => result.forEach(result => fixedResults.filter(row => row.title === result.title)[0] ? "" : fixedResults.push(result)));

    return fixedResults;
}