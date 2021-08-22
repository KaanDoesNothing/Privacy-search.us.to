import puppeteer from "puppeteer";

export default async () => {
    let browser = await puppeteer.launch({headless: false, args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
    ]});

    return browser;
}