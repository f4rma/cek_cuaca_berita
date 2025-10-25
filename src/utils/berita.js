const request = require('postman-request')

const API_KEY = 'de5e8f0b129c149a1002c28c97ec6c7f'
const BASE_URL = 'http://api.mediastack.com/v1/news'

const mapItems = (arr = []) =>
  arr.map(a => ({
    title: a.title,
    description: a.description,
    url: a.url,
    image: a.image,
    source: a.source,
    published_at: a.published_at
  }))

const getNews = (opts = {}, cb) => {
  const params = new URLSearchParams({
    access_key: API_KEY,
    sort: 'published_desc',
    limit: String(opts.limit || 12)
  })
  if (opts.keywords) params.set('keywords', opts.keywords)
  if (opts.categories) params.set('categories', opts.categories)
  if (opts.countries) params.set('countries', opts.countries) // boleh 'id', tapi opsional
  // JANGAN set languages=id (tidak didukung)

  const url = `${BASE_URL}?${params.toString()}`
  request({ url, json: true }, (error, { body } = {}) => {
    if (error) return cb('Tidak dapat konek ke layanan berita', undefined)
    if (body?.error) return cb(body.error.message || 'Terjadi kesalahan API', undefined)

    let items = Array.isArray(body?.data) ? body.data : []
    if (items.length === 0 && opts.fallback !== false) {
      // fallback: buang filter negara agar tetap ada hasil
      const fb = new URLSearchParams({
        access_key: API_KEY,
        sort: 'published_desc',
        limit: String(opts.limit || 12)
      })
      if (opts.keywords) fb.set('keywords', opts.keywords)
      if (opts.categories) fb.set('categories', opts.categories)

      return request({ url: `${BASE_URL}?${fb.toString()}`, json: true }, (e2, { body: b2 } = {}) => {
        if (e2) return cb('Tidak dapat konek ke layanan berita', undefined)
        return cb(undefined, { data: mapItems(b2?.data) })
      })
    }

    cb(undefined, { data: mapItems(items) })
  })
}

module.exports = getNews