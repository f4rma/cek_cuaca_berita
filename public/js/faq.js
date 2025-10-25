// Jadikan accordion: hanya satu detail yang terbuka
document.addEventListener('click', (e) => {
  const sum = e.target.closest('summary')
  if (!sum) return
  const current = sum.parentElement
  document
    .querySelectorAll('.faq-accordion details[open]')
    .forEach(d => { if (d !== current) d.removeAttribute('open') })
})
```// filepath: d:\RADIT\KULIAH\Semester 5\Pemrograman Jaringan (Praktikum )\23343050_Praktikum-Pemrograman-Jaringan\UTS\public\js\faq.js
// Jadikan accordion: hanya satu detail yang terbuka
document.addEventListener('click', (e) => {
  const sum = e.target.closest('summary')
  if (!sum) return
  const current = sum.parentElement
  document
    .querySelectorAll('.faq-accordion details[open]')
    .forEach(d => { if (d !== current) d.removeAttribute('open') })
})