import puppeteer from "puppeteer";
import { io } from "../server";

io.on("connection", async (socket) => {
    console.log("Connected");

    let browser = await puppeteer.launch({headless: false, args: ["--no-sandbox"]});
    let page = (await browser.pages())[0];
    await page.setViewport({width: 1280, height: 720});

    socket.emit("browser_loaded", true);

    socket.on("input", (data) => {
        if(data.type === "mouse_move") {
            page.mouse.move(data.x, data.y);
        }else if(data.type === "mouse_click") {
            console.log(data);
            page.mouse.click(data.x, data.y);
        }else if(data.type === "key") {
            //@ts-ignore
            page.keyboard.press(String.fromCharCode(parseInt(data.key)));
        }
    });

    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data);
        
        socket.emit("screen_size_updated");
    });

    socket.on("goto", (url) => {
        page.goto(url);
    });

    let interval = setInterval(async () => {
        try {
            const screenshot = await page.screenshot({
                fullPage: true,
                omitBackground: true,
                quality: 80,
                type: "jpeg"
            });
    
            socket.emit("update_frame", screenshot);
        }catch(err) {
            console.log(err);
        }
    }, 500);

    socket.on("disconnect", async () => {
        clearInterval(interval);
        await browser.close();
    });
    // socket.emit("screen_update", {frame: })
});