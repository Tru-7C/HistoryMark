const historyList = document.getElementById("history-list");
let threeMonthsAgo = new Date().getTime() - 90 * 24 * 60 * 60 * 1000;


chrome.history.search({text: '', startTime: threeMonthsAgo, maxResults: 10000 }, (results) => {
    results.forEach(item => {
        const listItem = document.createElement("li");

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
        const urlTitle = item.title;

        listItem.innerHTML = `
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listText-style">${urlTitle}</span>`;

        historyList.appendChild(listItem);
    });
});