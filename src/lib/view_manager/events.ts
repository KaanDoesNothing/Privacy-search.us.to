import path from "path";

export default ({browser, page, socket}) => {
    page.on("load", async () => {
        socket.emit("event", {type: "url_change", data: page.url()});

        // await page.exposeFunction("onCustomEvent", (e) => {
        //     console.log(e);
        // });

        // page.addScriptTag({path: path.join(__dirname + "../../website/browser/customEvents.js")});
    });
}