import { getElement } from '../utils/selector.js'

const KEY_STORAGE_LINK = 'shortened-links'
const INVALID_LINK = 2

export class ShortenLink {
  constructor() {
    this.messageInput = getElement('.shorten-input-wrapper p')
    this.inputWrapper = getElement('.shorten-input-wrapper')
    this.linksWrapper = getElement('.links-wrapper')
    this.input = getElement('#shorten-input')
    this.buttonControl = getElement('#shorten-btn')
  }

  get valueInput() {
    return this.input.value?.trim() ?? ''
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

  setParamsButton(text, disabled) {
    this.buttonControl.innerText = text
    this.buttonControl.setAttribute('data-loading', disabled)
  }

  fetchApiShorten(url = '') {
    this.setParamsButton('Carregando...', true)
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return Promise.reject(data)
        }
        this.addLinkInStorage(data.result)
        this.listStoredLinks()
        this.input.focus()
      })
      .catch((error) => {
        let message = 'Erro ao encurtar link'
        if (error.error_code === INVALID_LINK) {
          message = 'Link inválido'
        }

        console.error(error)
        window.alert(message)
      })
      .finally(() => {
        this.clearValueInput()
        this.setParamsButton('Encurtar!', false)
      })
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

  validForm() {
    const rules = [
      {
        message: 'Campo obrigatório',
        isInvalid: () => this.valueInput.length <= 0,
      },
      {
        message: 'Link já encurtado',
        isInvalid: () =>
          this.links.some((link) =>
            Object.values(link).includes(this.valueInput)
          ),
      },
    ]

    let index = 0
    let currentRule = null
    while (index < rules.length) {
      const rule = rules[index]
      if (rule.isInvalid()) {
        currentRule = rule
        break
      }

      index++
    }

    const isValid = currentRule === null

    if (isValid) {
      this.inputWrapper.classList.remove('invalid')
    } else {
      this.input.focus()
      this.messageInput.innerText = currentRule.message
      this.inputWrapper.classList.add('invalid')
    }

    return isValid
  }

  addEventButtonControl() {
    this.buttonControl.onclick = () => {
      if (this.validForm()) {
        this.fetchApiShorten(this.valueInput)
      }
    }
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
