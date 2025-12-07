document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.local.get({ 
    ignoreUrls: [], 
    removeUrls: [], 
    sortOrder: 'domain',
    removeDuplicates: true
  });
  document.getElementById('ignoreUrls').value = settings.ignoreUrls.join('\n');
  document.getElementById('removeUrls').value = settings.removeUrls.join('\n');
  document.getElementById('sortOrder').value = settings.sortOrder;
  document.getElementById('removeDuplicates').checked = settings.removeDuplicates;
});

document.getElementById('save').addEventListener('click', async () => {
  const ignoreUrls = document.getElementById('ignoreUrls').value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const removeUrls = document.getElementById('removeUrls').value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const sortOrder = document.getElementById('sortOrder').value;
  const removeDuplicates = document.getElementById('removeDuplicates').checked;

  await chrome.storage.local.set({ ignoreUrls, removeUrls, sortOrder, removeDuplicates });

  const status = document.getElementById('status');
  status.textContent = 'Settings saved!';
  setTimeout(() => { status.textContent = ''; }, 2000);
});
