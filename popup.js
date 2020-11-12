let currentTab;
let inputField = document.querySelector("input#input-url");
let outputField = document.querySelector("input#output-url");
let convertButton = document.querySelector("button#convert");
let copyButton = document.querySelector("button#copy");

chrome.tabs.query(
    {
        active: true,
        currentWindow: true,
    },
    (tabs) => {
        currentTab = tabs[0];
        main();
    }
);

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    inputField.value = currentTab.url;
    outputField.value = "Loading";
    outputField.value = await convertURL(currentTab.url, currentTab.title);
}

var clipboard = new ClipboardJS(copyButton);

async function convertURL(link, title) {
    try {
        let response = await fetch(
            "https://feli.page/api/urlShortener?apiKey=feli-page",
            {
                method: "GET",
                headers: {
                    "domain-uri-prefix": "https://url.feli.page/link",
                    "request-link": link,
                    "request-type": "UNGUESSABLE",
                    "social-title": title,
                },
            }
        );
        let json = await response.json();
        console.log(json);
        if (json["data"] && json["data"]["shortLink"]) {
            return json["data"]["shortLink"];
        }
    } catch (error) {}
    return "Error";
}
