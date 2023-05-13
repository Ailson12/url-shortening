import { getElement } from '../utils/selector.js'

const KEY_STORAGE_LINK = 'shortened-links'

export class ShortenLink {
  constructor() {
    this.linksWrapper = getElement('.links-wrapper')
    this.input = getElement('#shorten-input')
    this.buttonControl = getElement('#shorten-btn')
  }

  get valueInput() {
    return this.input.value
  }

  set valueInput(value = '') {
    this.input.value = value
  }

  get links() {
    const value = localStorage.getItem(KEY_STORAGE_LINK)
    return value === null ? [] : JSON.parse(value)
  }

  clearValueInput() {
    this.valueInput = ''
  }

  startFetchApi() {
    this.setParamsButton('Carregando...', true)
  }

  finallyFetchApi() {
    this.setParamsButton('Encurtar!', false)
  }

  setParamsButton(text, disabled) {
    this.buttonControl.innerText = text
    this.buttonControl.setAttribute('disabled', disabled)
  }

  fetchApiShorten(url = '') {
    this.startFetchApi()
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((response) => response.json())
      .then((data) => {
        this.addLinkInStorage(data.result)
        this.listStoredLinks()
        this.clearValueInput()
      })
      .finally(() => this.finallyFetchApi())
  }

  addLinkInStorage(result = {}) {
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

  listStoredLinks() {
    const htmlLinks = this.links.map(
      (link, index) => `
          <li class="link-item" data-index="${index}">
            <p class="color-6 weight-medium">
              ${link.original_link}
            </p>
            <div class="link-item-actions">
              <a target="_blank" class="color-1 weight-medium" href="${link.full_short_link}"> ${link.full_short_link}</a>
              <button type="button" class="btn rounded-sm">Copiar</button>
            </div>
          </li>
        `
    )

    this.linksWrapper.innerHTML = htmlLinks.join('')

    this.addEventCopyLink()
  }

  addEventButtonControl() {
    this.buttonControl.addEventListener('click', () => {
      this.fetchApiShorten(this.valueInput)
    })
  }

  addEventCopyLink() {
    const copyButtons = this.linksWrapper.querySelectorAll('li button') ?? []
    copyButtons.forEach((copyButton, index) => {
      copyButton.onclick = ({ target }) => {
        const link = this.linksWrapper.querySelector(
          `li[data-index="${index}"] a`
        )

        navigator.clipboard.writeText(link.innerText)

        target.innerText = 'Copiado!'
        target.classList.add('active')

        setTimeout(() => {
          target.innerText = 'Copiar'
          target.classList.remove('active')
        }, 1000)
      }
    })
  }

  addEvent() {
    this.addEventButtonControl()
    this.listStoredLinks()
  }
}
