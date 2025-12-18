let previousTabId = {};
let currentTabId = {};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const settings = await chrome.storage.local.get({ switchToPreviousTab: true });
  if (!settings.switchToPreviousTab) return;

  const windowId = activeInfo.windowId;
  
  // Store the current tab as previous before updating to new active tab
  if (currentTabId[windowId] && currentTabId[windowId] !== activeInfo.tabId) {
    previousTabId[windowId] = currentTabId[windowId];
  }
  
  currentTabId[windowId] = activeInfo.tabId;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'switch-to-previous-tab') {
    const settings = await chrome.storage.local.get({ switchToPreviousTab: true });
    if (!settings.switchToPreviousTab) return;

    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const windowId = currentTab.windowId;
    const prevTabId = previousTabId[windowId];

    if (prevTabId && prevTabId !== currentTab.id) {
      try {
        // Check if the previous tab still exists
        await chrome.tabs.get(prevTabId);
        await chrome.tabs.update(prevTabId, { active: true });
      } catch (e) {
        // Tab no longer exists, clear the stored ID
        delete previousTabId[windowId];
      }
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const currentWindow = tab.windowId;
  const settings = await chrome.storage.local.get({ 
    ignoreUrls: [], 
    removeUrls: [], 
    sortOrder: 'domain',
    removeDuplicates: true
  });
  const ignorePatterns = settings.ignoreUrls.map(pattern => 
    new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$')
  );
  const removePatterns = settings.removeUrls.map(pattern => 
    new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$')
  );

  const allWindows = await chrome.windows.getAll({ populate: true, windowTypes: ['normal'] });
  const tabsToMove = [];
  const tabsToRemove = [];
  const windowsWithIgnoredTabs = new Set();

  for (const window of allWindows) {
    for (const t of window.tabs) {
      // Remove empty tabs
      if (t.url === 'chrome://newtab/' || t.url === 'about:blank') {
        tabsToRemove.push(t.id);
        continue;
      }

      const shouldRemove = removePatterns.some(pattern => pattern.test(t.url));
      if (shouldRemove) {
        tabsToRemove.push(t.id);
        continue;
      }
      
      if (window.id === currentWindow) continue;
      
      const shouldIgnore = ignorePatterns.some(pattern => pattern.test(t.url));
      if (shouldIgnore) {
        windowsWithIgnoredTabs.add(window.id);
      } else {
        tabsToMove.push(t);
      }
    }
  }

  if (tabsToRemove.length > 0) {
    await chrome.tabs.remove(tabsToRemove);
  }

  if (tabsToMove.length > 0) {
    const tabIds = tabsToMove.map(t => t.id);
    await chrome.tabs.move(tabIds, { windowId: currentWindow, index: -1 });

    for (const t of tabsToMove) {
      if (t.pinned) {
        await chrome.tabs.update(t.id, { pinned: true });
      }
    }

    for (const window of allWindows) {
      if (window.id !== currentWindow && !windowsWithIgnoredTabs.has(window.id)) {
        try {
          const remainingTabs = await chrome.tabs.query({ windowId: window.id });
          if (remainingTabs.length === 0) {
            await chrome.windows.remove(window.id);
          }
        } catch (e) {
          // Window might already be closed
        }
      }
    }
  }

  const allTabs = await chrome.tabs.query({ windowId: currentWindow });
  const pinnedTabs = allTabs.filter(t => t.pinned);
  const unpinnedTabs = allTabs.filter(t => !t.pinned);

  unpinnedTabs.sort((a, b) => {
    if (settings.sortOrder === 'domain') {
      const urlA = new URL(a.url);
      const urlB = new URL(b.url);
      const domainCompare = urlA.hostname.localeCompare(urlB.hostname);
      return domainCompare !== 0 ? domainCompare : a.url.localeCompare(b.url);
    }
    return a.url.localeCompare(b.url);
  });

  const sortedTabs = [...pinnedTabs, ...unpinnedTabs];
  for (let i = 0; i < sortedTabs.length; i++) {
    await chrome.tabs.move(sortedTabs[i].id, { index: i });
  }

  if (settings.removeDuplicates) {
    const allCurrentTabs = await chrome.tabs.query({ windowId: currentWindow });
    const seenUrls = new Set();
    const duplicatesToRemove = [];

    for (const t of allCurrentTabs) {
      if (seenUrls.has(t.url)) {
        duplicatesToRemove.push(t.id);
      } else {
        seenUrls.add(t.url);
      }
    }

    if (duplicatesToRemove.length > 0) {
      await chrome.tabs.remove(duplicatesToRemove);
    }
  }
});
