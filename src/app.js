const path = require('path')
const express = require('express')
const port = process.env.PORT || 4000
const { engine } = require('express-handlebars');
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const getNews = require('./utils/berita')

const app = express()

//path untuk konfigurasi Express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

//setup direktori statis
app.use(express.static(direktoriPublic))

//halaman atau page utama
app.get('', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Raditya Putra Farma',
    aktifHome: true
  })
})

// halaman bantuan /FAQ (Frequently Asked Questions)
app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Bantuan',
    nama: 'Raditya Putra Farma',
    aktifBantuan: true
  })
})

app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukkan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        }) 
    })
    // res.send([{
    //     prediksiCuaca: 'Cuaca berpotensi hujan',
    //     lokasi: 'Padang',
    //     address: req.query.address
    // }])
})

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang',
    nama: 'Raditya Putra Farma',
    aktifTentang: true
  })
})

app.get('/bantuan/', (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Raditya Putra Farma',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

app.get('/berita', (req, res) => {
  res.render('berita', {
    judul: 'Berita',
    nama: 'Raditya Putra Farma',
    aktifBerita: true
  })
})

app.get('/api/berita', (req, res) => {
  const { q, categories, limit } = req.query
  getNews({ keywords: q, categories, limit, countries: 'id' }, (err, result) => {
    if (err) return res.status(500).send({ error: err })
    res.send(result)
  })
})

app.use((req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Raditya Putra Farma',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

app.listen(port, () => {
    console.log('Server berjalan pada port '+ port)
})



