# Tab Organize Chrome Extension

Merge and sort tabs from all Chrome windows.

## Setup

### Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this directory

## Usage

1. Click the icon in the Chrome toolbar to merge and sort all tabs
2. Go to extension options (right-click icon → Options) to configure:
   - Sort order (domain first or full URL)
   - Ignore URLs (wildcards supported, e.g., `*.google.com/*`)
   - Remove URLs (wildcards supported, e.g., `*.google.com/*`)

## Features

- Merges all tabs from all windows into the current window
- Sorts tabs by domain (or full URL)
- Preserves pinned tabs
- Ignores specified URLs (they stay in original windows)
- Excludes incognito windows
