chrome.storage.sync.get("extensionHistory", function (result) {
    window.localStorage.extensionHistory = result["extensionHistory"] || "[]";
});
