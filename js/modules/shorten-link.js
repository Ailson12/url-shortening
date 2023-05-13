import { getElement } from '../utils/selector.js'

const KEY_STORAGE_LINK = 'shortened-links'

export class ShortenLink {
  constructor() {
    this.input = getElement('#shorten-input')
    this.buttonControl = getElement('#shorten-btn')
  }

  get valueInput() {
    return this.input.value
  }

  get links() {
    const value = localStorage.getItem(KEY_STORAGE_LINK)
    return value === null ? [] : JSON.parse(value)
  }

  fetchApiShorten(url = '') {
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((response) => response.json())
      .then((data) => {
        this.addLink(data.result)
      })
  }

  addLink(result = {}) {
    const { original_link, full_short_link } = result
    const newLink = {
      original_link,
      full_short_link,
    }

    localStorage.setItem(
      KEY_STORAGE_LINK,
      JSON.stringify(this.links.concat(newLink))
    )
  }

  addEventButtonControl() {
    this.buttonControl.addEventListener('click', () => {
      this.fetchApiShorten(this.valueInput)
    })
  }

  addEvent() {
    this.addEventButtonControl()
  }
}
