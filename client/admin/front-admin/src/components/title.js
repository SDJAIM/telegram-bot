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
      .title h1{
        font-family:"Nunito Sans", sans-serif;
        margin: 0;
      }
      </style>
      <div class="title">
        <h1><slot>Pedidos</slot></h1>
      </div>
      `
  }
}

customElements.define('title-component', Title)
