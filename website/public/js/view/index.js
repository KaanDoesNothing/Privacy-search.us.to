const socket = io();

let cache = new Map();

let timeouts = {};

function getMousePosition(self, e) {
    let parentOffset = $(self).parent().offset();

    let x = e.pageX - parentOffset.left;
    let y = e.pageY - parentOffset.top;

    cache.set("mouse_position", {x, y});

    return {
        x,
        y
    }
}

function setStatus(text) {
    $("#status").text(`Status: ${text}`);
}

function isFocusedOnBrowserScreen() {
    let mouse_position = cache.get("mouse_position");

    let hoveringOver = document.elementFromPoint(mouse_position.x, mouse_position.y);

    if(hoveringOver.id !== document.querySelector("#screen").id) return false;

    return true;
}

function updateScreen(image) {
    let blob = new Blob([image])

    let reader = new FileReader();
    reader.onload = function (event) {
        let base64 = event.target.result
        let img = document.querySelector("#screen");
        img.src = base64;
    };

    reader.readAsDataURL(blob);
}

function updateScreenSize() {
    let query = new URLSearchParams(window.location.search);

    let url = query.get("url") ?? "https://start.duckduckgo.com/";

    socket.emit("goto", url);

    $("#web_browser_url_bar").val(url);
}

function browserLoaded() {
    let body = document.querySelector("#screen");
    let data = {
        width: $("#screen").width(),
        height: $(document).height() - $(".navbar").height()
        // height: $("#screen").height()
    };
    socket.emit("set_screen_size", data);
}

function urlChange(url) {
    $("#web_browser_url_bar").val(url);
}

$(document).keyup((e) => {
    if(!isFocusedOnBrowserScreen()) return;
    e.preventDefault();

    socket.emit("input", {
        type: "key",
        key: e.which,
        action: "up"
    });
});

$(document).keydown((e) => {
    if(!isFocusedOnBrowserScreen()) return;
    e.preventDefault();

    console.log(e.which);

    socket.emit("input", {
        type: "key",
        key: e.which,
        action: "down"
    });
});

socket.on("connection", () => {
    setStatus("Connected");
});

socket.on("disconnect", () => {
    $("#status").text("Status: Disconnected");
});

socket.on("update_screen", (image) => updateScreen(image));

socket.on("event", (event) => {
    console.log(`Received event: ${event.type}`);
    
    switch(event.type) {
        case "url_change":
            urlChange(event.data);
            break;
        case "status_change":
            setStatus(event.data);
            break;
        case "update_screen":
            updateScreen(event.data);
            break;
        case "update_screen_size":
            updateScreenSize();
            break;
        case "browser_loaded":
            browserLoaded();
            break;
        default:
            console.log("Hm");
            break;
    }
});

$("#screen").on("mousemove", function (e) {
    socket.emit("input", {
        type: "mouse_move",
        ...getMousePosition(this, e)
    });
});

$("#screen").on("click", function (e) {
    socket.emit("input", {
        type: "mouse_click",
        ...getMousePosition(this, e)
    });
});

$("#screen").on("dragstart", () => {
    return false;
});

$("#web_browser_url_bar_form").on("submit", (e) => {
    e.preventDefault();

    let url = $("#web_browser_url_bar").val();

    socket.emit("goto", url);
});

$("#web_browser_navigation_go_back").click(() => {
    socket.emit("go_back");
});

$("#web_browser_navigation_go_forward").click(() => {
    socket.emit("go_forward");
});

$("#web_browser_navigation_reload").click(() => {
    socket.emit("reload");
});

$("#web_browser_navigation_go_home").click(() => {
    socket.emit("goto", "https://duckduckgo.com/");
});

setInterval(() => {
    $("#screen").attr("src", `/view/screen/${socket.id}?time=${Date.now()}`);
}, 200)