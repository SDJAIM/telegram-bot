class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () { }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>

          header{ 
            align-items: center;
            background-color: transparent;
            display: flex;
            justify-content: space-between;
            padding: 2rem 2%;
          }

      </style>
      <header>
        <slot></slot>
      </header>
      `
  }
}

customElements.define('header-component', Header)
