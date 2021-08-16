document.addEventListener("DOMContentLoaded", () => {
    fetchNews();
});

async function fetchNews() {
    const news = document.querySelector("#content");

    let res = await fetch("/news").then(res => res.json());

    if(res.error) {
        return document.querySelector("#news").style.display = "none";
    }

    news.innerHTML = "";

    res.articles.forEach(article => {
        news.innerHTML += `
        <article class="message result">
            <div class="message-body">
                <a href="/news/redirect?url=${article.link}">
                    <label>${article.title}</label>
                </a>
                <br>
                <label>${article.time}</label>
            </div>
        </article>
        `;
    });
}