class Title extends HTMLElement {
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
      .title {
        padding: 1.5rem;
      }

      .title h1 {
        font-family: "Nunito Sans", sans-serif;
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0;
        line-height: 1.2;
      }
      </style>
      <div class="title">
        <h1><slot>Pedidos</slot></h1>
      </div>
      `
  }
}

customElements.define('title-component', Title)
