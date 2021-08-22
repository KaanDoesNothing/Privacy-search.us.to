import { Page } from "puppeteer";
import { Socket } from "socket.io";

export default ({page, socket}: {page: Page, socket: Socket}) => {
    socket.on("set_screen_size", async (data) => {
        await page.setViewport(data).catch(err => console.log("Couldn't set viewport!"));
        
        socket.emit("event", {type: "update_screen_size"});
    });
    

        
        // page.on("load", () => {
        //     if(interval) clearInterval(interval);
            
        //     interval = setInterval(async () => {
        //         try {
        //             if(page.isClosed()) {
        //                 clearInterval(interval) ;
        //                 console.log("Page closed");
                        
        //                 return;
        //             }
        //             let viewport = page.viewport();
    
        //             if(viewport.width === 0 && viewport.height === 0) return console.log("Viewport incorrect");
    
                    // const screenshot = await page.screenshot({
                    //     fullPage: false,
                    //     omitBackground: false,
                    //     quality: 20,
                    //     type: "jpeg"
                    // });
    
                    // socket.emit("event", {type: "update_screen", data: screenshot});
        //         }catch(err) {
        //             console.log(err);
        //             // clearInterval(interval);
        //             // socket.disconnect();
        //             console.log("Screenshot error");
        //         }
        //     }, 200);
        // })
    // });
}