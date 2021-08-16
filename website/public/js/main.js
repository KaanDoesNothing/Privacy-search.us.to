document.addEventListener("DOMContentLoaded", () => {
    let searchButton = document.querySelector("#search-button");

    searchButton.addEventListener("click", (e) => {
        if(document.readyState !== "complete") return;
        
        searchButton.innerHTML = `
            <div class="loader"></div>
        `;
    });
});