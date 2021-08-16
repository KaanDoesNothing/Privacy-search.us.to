import puppeteer from "puppeteer";
import { io } from "../server";

io.on("connection", async (socket) => {
    console.log("Connected");

    let browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
    let page = (await browser.pages())[0];
    let interval;

    // await page.setViewport({width: 1280, height: 720});

    socket.emit("browser_loaded", true);

    socket.on("input", (data) => {
        if(data.type === "mouse_move") {
            page.mouse.move(data.x, data.y);
        }else if(data.type === "mouse_click") {
            page.mouse.click(data.x, data.y);
        }else if(data.type === "key" && data.action) {
            let key = parseInt(data.key);
            let finalKey = "";
            if(key === 8) {
                finalKey = "Backspace";
            }else if(key === 17) {
                finalKey = "Control";
            } else {
                finalKey = String.fromCharCode(parseInt(data.key)).toLowerCase();
            }

            if(data.action === "up") {
                //@ts-ignore
                page.keyboard.up(finalKey).catch(err => console.log(`Error key: ${key}`));
            }else {
                //@ts-ignore
                page.keyboard.down(finalKey).catch(err => console.log(`Error key: ${key}`));
            }
        }
    });

    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data);
        
        socket.emit("screen_size_updated");

        interval = setInterval(async () => {
            try {
                let viewport = page.viewport();

                if(viewport.width === 0 && viewport.height === 0) return;

                const screenshot = await page.screenshot({
                    fullPage: true,
                    omitBackground: true,
                    quality: 40,
                    type: "jpeg"
                });
        
                socket.emit("update_frame", screenshot);
            }catch(err) {
                console.log("Screenshot error");
            }
        }, 100);
    });

    socket.on("goto", (url) => {
        page.goto(url).catch(err => console.log("Browser disconnected!"));
    });

    socket.on("disconnect", async () => {
        clearInterval(interval);
        await browser.close();
    });
    // socket.emit("screen_update", {frame: })
});