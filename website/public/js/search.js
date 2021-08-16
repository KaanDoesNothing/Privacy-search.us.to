let button_states = {};

document.addEventListener("DOMContentLoaded", () => {
    const results = document.querySelectorAll(`[data-type="result"]`);

    for (let result in results) {
        result = results[result];

        if(result.getAttribute) {
            if(result.getAttribute("data-url").includes("watch?v=")) {
                result.querySelector(`[data-type="video"]`).classList.remove("hidden");   
            }
        }
    }
});

async function previewImage(url) {
    let button = document.querySelector(`img[data-url="${url}"]`) || document.querySelector(`a[data-url='${url}']`)

    console.log(button.tagName);
    if(button.tagName === "A") {
        button_states[url] = button.outerHTML;

        button.innerHTML = `Generating Preview &nbsp; <div class="loader"></div>`;

        const image = await fetch(`/screenshot?url=${url}`).then(res => res.blob());

        if(image.size < 1000) return button.innerHTML = "Failed to load, click to retry.";

        button.outerHTML = `<img src="${URL.createObjectURL(image)}" data-url="${url}" onclick="previewImage('${url}')">`;
    }else {
        button.outerHTML = button_states[url];
    }
}

async function watch(url) {
    let div = document.querySelector(`[data-url="${url}"][data-type="video"]`).parentElement;

    const json = await fetch("/youtube/video_details?url=" + url).then(res => res.json());

    div.outerHTML = `<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0"width="854.4" height="480" type="text/html" src="https://www.youtube.com/embed/${json.details.videoDetails.videoId}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com"><div></iframe>`
}

async function listen(url) {
    let div = document.querySelector(`[data-url="${url}"][data-type="audio"]`).parentElement;

    const json = await fetch("/youtube/video_details?url=" + url).then(res => res.json());

    let video = json.details.formats.filter(file => file.audioBitrate === 128)[0];

    if(video) {
        div.innerHTML = `
            <audio controls>
                <source src="${url}">
            </audio>
    `
    }
}