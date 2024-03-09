chrome.runtime.onInstalled.addListener(() => {
  console.log('Domain Group Tabs extension installed.');
});

// Function to move specified tabs to a new window
function moveTabsToNewWindow(tabIds, callback) {
  if (tabIds.length > 0) {
    chrome.windows.create({ tabId: tabIds[0], focused: true }, function(newWindow) {
      chrome.tabs.move(tabIds, { windowId: newWindow.id, index: -1 }, function() {
        if (callback)
          callback(newWindow.id)
      });
    });
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "moveTabs") {
    moveTabsToNewWindow(request.tabIds);
  }
  if (request.action === "closeTabs") {
    for (const tabId of request.tabIds) {
      chrome.tabs.remove(tabId);
    }
  }
  if (request.action === "pocketURLs") {
    moveTabsToNewWindow(request.tabIds, function(newWindowId) {
      for (const tabId of request.tabIds) {
        chrome.tabs.get(tabId, function(tab) {
          let url = tab.url
          const url_obj = new URL(tab.url)
          if (url_obj.hostname == 'noogafoofpebimajpfpamcfhoaifemoa') {
            // is great suspender tab
            url = (new URLSearchParams(url_obj.hash)).get('uri')
          }

          chrome.tabs.create({
            url: 'https://widgets.getpocket.com/v1/popup?url=' + encodeURIComponent(url),
            windowId: newWindowId,
          }, function(newTab) {
            // remove pocket tab after 15
            setTimeout(function() {chrome.tabs.remove(newTab.id);}, 15000)
          });
        });
      }

      // open pocket saves list after 2s
      setTimeout(function() {
        chrome.tabs.create({
          url: 'https://getpocket.com/saves',
          windowId: newWindowId,
        })
      }, 2000)

      // close entire window after 20sec
      setTimeout(function() {
        chrome.windows.remove(newWindowId);
      }, 20000)
    });
  }
});
