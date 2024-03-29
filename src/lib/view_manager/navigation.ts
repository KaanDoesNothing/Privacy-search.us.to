import { fixURL } from "../../utils";

export default ({page, socket}) => {
    socket.on("goto", async (url) => {
        console.log(url);
        await page.goto(fixURL(url)).catch(err => console.log("Browser disconnected!"));
    });

    socket.on("go_back", async () => {
        await page.goBack().catch(err => console.log("Couldn't go back!"));
    });

    socket.on("go_forward", async () => {
        await page.goForward().catch(err => console.log("Couldn't go forward!"));
    });

    socket.on("reload", async () => {
        await page.reload().catch(err => console.log("Couldn't reload!"));
    });
}