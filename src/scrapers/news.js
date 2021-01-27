let browser;

module.exports.setBrowser = (browserInstance) => {
    browser = browserInstance
}

module.exports.scrape = async (text) => {
    const page = await browser.newPage();
    
}