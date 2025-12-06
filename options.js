document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.local.get({ ignoreUrls: [], removeUrls: [], sortOrder: 'domain' });
  document.getElementById('ignoreUrls').value = settings.ignoreUrls.join('\n');
  document.getElementById('removeUrls').value = settings.removeUrls.join('\n');
  document.getElementById('sortOrder').value = settings.sortOrder;
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

  await chrome.storage.local.set({ ignoreUrls, removeUrls, sortOrder });

  const status = document.getElementById('status');
  status.textContent = 'Settings saved!';
  setTimeout(() => { status.textContent = ''; }, 2000);
});
