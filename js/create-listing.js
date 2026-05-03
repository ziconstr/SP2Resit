import { API_BASE, fetchData } from '/js/api.js';

const btn = document.getElementById('create-btn');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

// Redirect to login if not logged in
if (!localStorage.getItem('token')) {
  window.location.href = '/login.html';
}

// Create mode
btn.addEventListener('click', async () => {
  const editId = new URLSearchParams(window.location.search).get('edit');
  if (editId) return; // skip create handler if in edit mode

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const mediaUrl = document.getElementById('media').value.trim();
  const deadline = document.getElementById('deadline').value;

  errorMsg.classList.add('hidden');
  successMsg.classList.add('hidden');

  if (!title || !deadline) {
    errorMsg.textContent = 'Title and deadline are required.';
    errorMsg.classList.remove('hidden');
    return;
  }

  const body = {
    title,
    description,
    endsAt: new Date(deadline).toISOString(),
  };

  if (mediaUrl) {
    body.media = [{ url: mediaUrl, alt: title }];
  }

  btn.textContent = 'Creating...';
  btn.disabled = true;

  try {
    const result = await fetchData(`${API_BASE}/auction/listings`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    successMsg.textContent = 'Listing created! Redirecting...';
    successMsg.classList.remove('hidden');
    setTimeout(() => {
      window.location.href = `/listing.html?id=${result.data.id}`;
    }, 1500);
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove('hidden');
    btn.textContent = 'Create listing';
    btn.disabled = false;
  }
});

// Edit mode
const editId = new URLSearchParams(window.location.search).get('edit');

if (editId) {
  // Update page text
  document.querySelector('h1').textContent = 'Edit listing';
  document.querySelector('p').textContent = 'Update your listing details';
  btn.textContent = 'Save changes';

  // Pre-fill form with existing listing data
  fetchData(`${API_BASE}/auction/listings/${editId}`).then((res) => {
    const l = res.data;
    document.getElementById('title').value = l.title || '';
    document.getElementById('description').value = l.description || '';
    document.getElementById('media').value = l.media?.[0]?.url || '';
    const d = new Date(l.endsAt);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    document.getElementById('deadline').value = d.toISOString().slice(0, 16);
  });

  // Save changes on click
  btn.addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const mediaUrl = document.getElementById('media').value.trim();
    const deadline = document.getElementById('deadline').value;

    errorMsg.classList.add('hidden');
    successMsg.classList.add('hidden');

    if (!title || !deadline) {
      errorMsg.textContent = 'Title and deadline are required.';
      errorMsg.classList.remove('hidden');
      return;
    }

    const body = {
      title,
      description,
      endsAt: new Date(deadline).toISOString(),
    };

    if (mediaUrl) {
      body.media = [{ url: mediaUrl, alt: title }];
    }

    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
      await fetchData(`${API_BASE}/auction/listings/${editId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      successMsg.textContent = 'Listing updated! Redirecting...';
      successMsg.classList.remove('hidden');
      setTimeout(() => {
        window.location.href = `/listing.html?id=${editId}`;
      }, 1500);
    } catch (err) {
      errorMsg.textContent = err.message;
      errorMsg.classList.remove('hidden');
      btn.textContent = 'Save changes';
      btn.disabled = false;
    }
  });
}
