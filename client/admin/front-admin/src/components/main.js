class Main extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {}

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>

      main{
        display: grid;
        gap: 2rem;
        grid-template-columns: 2fr 4fr;
        padding: 1rem 2%;
      }

      </style>
      
      <main>
        <slot></slot>
      </main>
      `
  }
}

customElements.define('main-component', Main)
