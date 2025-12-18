# Tab Organize Chrome Extension

Merge and sort tabs from all Chrome windows.
Switch back to the previously active tab

## Setup

### Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this directory

## Usage

1. Click the icon in the Chrome toolbar to merge and sort all tabs
2. Press Ctrl+E (or your custom shortcut) to switch back to the previously active tab
3. Go to extension options (right-click icon → Options) to configure:
   - Sort order (domain first or full URL)
   - Remove duplicates (enabled by default)
   - Switch back to previously active tab (enabled by default)
   - Ignore URLs (wildcards supported, e.g., `*.google.com/*`)
   - Remove URLs (wildcards supported, e.g., `*.ads.com/*`)
4. Customize keyboard shortcuts at `chrome://extensions/shortcuts`

## Features

- Merges all tabs from all windows into the current window
- Sorts tabs by domain (or full URL)
- Removes duplicate tabs (same URL)
- Preserves pinned tabs
- Ignores specified URLs (they stay in original windows)
- Removes specified URLs (closes matching tabs)
- Excludes incognito windows
