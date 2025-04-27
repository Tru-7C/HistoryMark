const historyList = document.getElementById("history-list");
let previousListItem = null;
let threeMonthsAgo = new Date().getTime() - 90 * 24 * 60 * 60 * 1000;

chrome.history.search({text: '', startTime: threeMonthsAgo, maxResults: 10000 }, (results) => {
    results.forEach(item => {
        const listItem = document.createElement("li");

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
        const urlTitle = item.title;
        const visitTime = formatVisitTime(item.lastVisitTime);

        const isDateNeeded = CheckIfDateInsertionNeeded(item, previousListItem);

        if (isDateNeeded) {
            const dateItem = document.createElement("li");
            dateItem.innerHTML = `<span><b>${(new Date(item.lastVisitTime)).toDateString()}</b></span>`;
            historyList.appendChild(dateItem);
        }

        listItem.innerHTML = `
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listTitleStyle">${urlTitle}</span>
            <span class="listDateTimeStyle">${visitTime}</span>`;

        historyList.appendChild(listItem);

        previousListItem = item;
    });
});

function formatVisitTime(lastVisitTime) {
    const date = new Date(lastVisitTime);
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleString('en-US', options);
}

function CheckIfDateInsertionNeeded(currentItem, previousItem) {
    if (previousItem == null) {
        return true;
    }

    const currentDate = new Date(currentItem.lastVisitTime);
    const previousDate = new Date(previousItem.lastVisitTime);

    if (currentDate.getFullYear() === previousDate.getFullYear() &&
        currentDate.getMonth() === previousDate.getMonth() &&
        currentDate.getDate() === previousDate.getDate()) {
            return false;
    }
    else {
        return true;
    }
}