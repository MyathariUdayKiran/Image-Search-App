const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const loadingIndicator = document.createElement("p");
loadingIndicator.textContent = "Loading...";
loadingIndicator.style.textAlign = "center";
loadingIndicator.style.display = "none";
searchResultsEl.insertAdjacentElement("beforebegin", loadingIndicator);

let inputData = "";
let page = 1;
let fetching = false;

async function searchImages() {
    if (fetching) return;
    fetching = true;
    inputData = searchInputEl.value.trim();
    if (!inputData) {
        alert("Please enter a search term.");
        fetching = false;
        return;
    }

    loadingIndicator.style.display = "block";
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        if (page === 1) searchResultsEl.innerHTML = "";

        const results = data.results;
        if (results.length === 0 && page === 1) {
            searchResultsEl.innerHTML = "<p style='text-align:center;'>No images found. Try a different keyword.</p>";
            return;
        }

        results.forEach((result) => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("search-result");

            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.alt_description || "Image";

            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.textContent = result.alt_description || "View Image";

            imageWrapper.appendChild(image);
            imageWrapper.appendChild(imageLink);
            searchResultsEl.appendChild(imageWrapper);
        });
        
        page++;
    } catch (error) {
        console.error(error);
        searchResultsEl.innerHTML = "<p style='text-align:center;color:red;'>Something went wrong. Please try again later.</p>";
    } finally {
        loadingIndicator.style.display = "none";
        fetching = false;
    }
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        searchImages();
    }
});
