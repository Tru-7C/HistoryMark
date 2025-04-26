const historyList = document.getElementById("history-list");
let threeMonthsAgo = new Date().getTime() - 90 * 24 * 60 * 60 * 1000;


chrome.history.search({text: '', startTime: threeMonthsAgo, maxResults: 10000 }, (results) => {
    results.forEach(item => {
        const listItem = document.createElement("li");

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
        const urlTitle = item.title;
        const visitTime = formatVisitTime(item.lastVisitTime);

        listItem.innerHTML = `
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listTitleStyle">${urlTitle}</span>
            <span class="listDateTimeStyle">${visitTime}</span>`;

        historyList.appendChild(listItem);
    });
});

function formatVisitTime(lastVisitTime) {
    const date = new Date(lastVisitTime);
    const options = {
        hour: 'numeric',  // "10"
        minute: '2-digit',
        hour12: true      // Use AM/PM format
      };
    
      return date.toLocaleString('en-US', options); // "Apr 5, 10:28 PM"
}