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

async function getExtensionHistory() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get("extensionHistory", function (result) {
                resolve(JSON.parse(result["extensionHistory"] || "[]"));
            });
        } catch (error) {
            console.log({ error });
            reject(error);
        }
    });
}

async function saveToExtensionHistory(url, shortUrl, title) {
    var oldHistory = await getExtensionHistory();
    var newHistory = [
        {
            url,
            shortUrl,
            title,
            time: Date.now(),
        },
        ...oldHistory,
    ];
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(
                { extensionHistory: JSON.stringify(newHistory) },
                function () {
                    resolve();
                }
            );
        } catch (error) {
            console.log({ error });
            reject(error);
        }
    });
}

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    inputField.value = currentTab.url;
    outputField.value = "Loading";
    outputField.value = await convertURL(currentTab.url, currentTab.title);
    copyButton.disabled = false;
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
                    "social-title": encodeURIComponent(title),
                    "social-description": link,
                },
            }
        );
        let json = await response.json();
        if (json["data"] && json["data"]["shortLink"]) {
            await saveToExtensionHistory(
                link,
                json["data"]["shortLink"],
                title
            );
            return json["data"]["shortLink"];
        }
    } catch (error) {
        console.log({ error });
    }
    return "Error";
}
