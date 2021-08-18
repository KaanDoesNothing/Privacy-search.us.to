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

function isFocusedOnBrowserScreen() {
    let mouse_position = cache.get("mouse_position");

    let hoveringOver = document.elementFromPoint(mouse_position.x, mouse_position.y);

    if(hoveringOver.id !== document.querySelector("#screen").id) return false;

    return true;
}

$(document).on("scroll", (e) => {
    console.log(e);
});

$(document).on("wheel", (e) => {
    console.log(e);
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
    console.log("Conencted");
});

socket.on("disconnect", () => {
    $("#status").text("Status: Disconnected");
});

socket.on("status", (status) => {
    $("#status").text(`Status: ${status}`);
});

socket.on("browser_loaded", () => {
    let body = document.querySelector("#screen");
    let data = {
        width: $("#screen").width(),
        height: $(document).height() - $(".navbar").height()
        // height: $("#screen").height()
    };
    console.log(data);
    socket.emit("set_screen_size", data);
});

socket.on("screen_size_updated", () => {
    let query = new URLSearchParams(window.location.search);

    let url = query.get("url") ?? "https://start.duckduckgo.com/";

    socket.emit("goto", url);

    $("#web_browser_url_bar").val(url);
});

socket.on("update_frame", (image) => {
    var blob = new Blob([image])

    var reader = new FileReader();
    reader.onload = function (event) {
        var base64 = event.target.result
        let img = document.querySelector("#screen");
        img.src = base64;
    };

    reader.readAsDataURL(blob);
});

socket.on("event", (event) => {
    switch(event.type) {
        case "url_change":
            $("#web_browser_url_bar").val(event.data);
        default:
            console.log("Hm");
    }
})

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