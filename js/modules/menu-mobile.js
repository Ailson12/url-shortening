import { getElement } from '../utils/selector.js'

const initialParameter = {
  anchor: '',
  buttonOpen: '',
  buttonClose: '',
}

export class MenuMobile {
  constructor({ anchor, buttonOpen, buttonClose } = initialParameter) {
    this.anchor = getElement(anchor)
    this.buttonOpenMenu = getElement(buttonOpen)
    this.buttonCloseMenu = getElement(buttonClose)
  }

  eventCloseMenu() {
    this.buttonCloseMenu.addEventListener('click', () => {
      this.anchor.setAttribute('data-mobile-active', false)
    })
  }

  eventOpenMenu() {
    this.buttonOpenMenu.addEventListener('click', () => {
      this.anchor.setAttribute('data-mobile-active', true)
    })
  }

  addEvent() {
    this.eventOpenMenu()
    this.eventCloseMenu()
  }
}
