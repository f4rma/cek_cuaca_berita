const grid = document.getElementById('news-grid')
const statusEl = document.getElementById('news-status')
const form = document.getElementById('news-form')
const inputQ = document.getElementById('news-q')
const selectCat = document.getElementById('news-cat')

function render(items) {
  if (!items?.length) {
    grid.innerHTML = '<p>Tidak ada berita ditemukan.</p>'
    return
  }
  grid.innerHTML = items.map(item => {
    const img = item.image || '/img/cuaca.png'
    const date = item.published_at ? new Date(item.published_at).toLocaleString('id-ID') : ''
    return `
      <article class="news-card">
        <a class="cover" href="${item.url}" target="_blank" rel="noopener">
          <img src="${img}" alt="">
        </a>
        <div class="news-content">
          <h3 class="title"><a href="${item.url}" target="_blank" rel="noopener">${item.title || 'Tanpa judul'}</a></h3>
          <p class="desc">${item.description || ''}</p>
          <div class="meta">
            <span>${item.source || ''}</span>
            <span>${date}</span>
          </div>
        </div>
      </article>
    `
  }).join('')
}

async function loadNews(params = {}) {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.categories) qs.set('categories', params.categories)
  if (params.limit) qs.set('limit', params.limit)
  statusEl.textContent = 'Memuat berita...'
  grid.innerHTML = ''
  try {
    const res = await fetch('/api/berita?' + qs.toString())
    const data = await res.json()
    render(data.data)
    statusEl.textContent = ''
  } catch (e) {
    console.error(e)
    statusEl.textContent = 'Gagal memuat berita'
  }
}

form?.addEventListener('submit', (e) => {
  e.preventDefault()
  loadNews({ q: inputQ.value.trim(), categories: selectCat.value })
})

loadNews()