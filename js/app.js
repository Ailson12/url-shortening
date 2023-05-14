import { MenuMobile } from './modules/menu-mobile.js'
import { ShortenLink } from './modules/shorten-link.js'
import { scrollSmooth } from './modules/scroll-smooth.js'

window.onload = () => {
  const menu = new MenuMobile({
    anchor: '#main-header',
    buttonOpen: '#mobile-button',
    buttonClose: '#mobile-button-close',
  })
  menu.addEvent()

  const shorten = new ShortenLink()
  shorten.addEvent()

  scrollSmooth()
}
