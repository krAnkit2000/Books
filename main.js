const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsEl = document.getElementById('results');
const loadingEl = document.getElementById('loading');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  resultsEl.innerHTML = '';
  loadingEl.style.display = 'flex';

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=12`;
    const res = await fetch(url);
    const data = await res.json();
    loadingEl.style.display = 'none';

    if (!data.items || data.items.length === 0) {
      resultsEl.innerHTML = `<p class="text-center text-muted">No books found for "${query}".</p>`;
      return;
    }

    data.items.forEach((item) => {
      const info = item.volumeInfo;
      const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=No+Cover';
      const authors = info.authors ? info.authors.join(', ') : 'Unknown author';
      const description = info.description ? info.description : 'No description available.';
      const previewLink = info.previewLink || '#';

      const col = document.createElement('div');
      col.className = 'col-md-4';

      col.innerHTML = `
        <div class="card book-card h-100 shadow-sm">
          <img src="${thumbnail}" class="card-img-top" alt="${info.title}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${info.title}</h5>
            <p class="card-text text-muted mb-1">by ${authors}</p>
            <p class="card-text description">${description}</p>
            <a href="${previewLink}" target="_blank" class="btn btn-success mt-auto">📖 Read Preview</a>
          </div>
        </div>
      `;

      resultsEl.appendChild(col);
    });
  } catch (error) {
    loadingEl.style.display = 'none';
    resultsEl.innerHTML = `<p class="text-center text-danger">Error fetching books. Try again later.</p>`;
    console.error(error);
  }
});
