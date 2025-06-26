class Menu extends HTMLElement {
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

      .menu {
        padding: 1rem;
      }

      .menu-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 0.75rem;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .menu-button:hover {
        background-color: rgba(99, 102, 241, 0.1);
      }

      .menu-button:active {
        background-color: rgba(99, 102, 241, 0.2);
      }

      .menu-button svg {
        fill: #6366f1;
        width: 2rem;
        height: 2rem;
        transition: fill 0.2s ease;
      }

      .menu-button:hover svg {
        fill: #4f46e5;
      }

      </style>
      <section class="menu">
          <div class="menu-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>apps</title><path d="M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z" /></svg>
          </div>
      </section>`
  }
}

customElements.define('menu-component', Menu)
