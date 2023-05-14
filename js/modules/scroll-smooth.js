export const scrollSmooth = () => {
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()

      const href = event.target.getAttribute('href')
      const target = document.querySelector(href)

      if (target) {
        window.scroll({
          top: target.offsetTop,
          behavior: 'smooth',
        })
      }
    })
  })
}
