class Message extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    document.addEventListener('notice', this.handleMessage.bind(this))
  }

  async connectedCallback () {
    await this.render()
  }

  handleMessage (event) {
    const { message, type } = event.detail
    const spanMessage = this.shadowRoot.querySelector('.message span')
    spanMessage.textContent = message

    const colorElement = this.shadowRoot.querySelector('.color')
    colorElement.classList.remove('success', 'error')
    colorElement.classList.add(type)

    const colorTimeElement = this.shadowRoot.querySelector('.color-time')
    colorTimeElement.classList.remove('success', 'error')
    colorTimeElement.classList.add(type)

    colorTimeElement.style.transition = 'none'
    colorTimeElement.style.width = '0%'
    colorTimeElement.style.transition = 'width 5s linear'
    colorTimeElement.style.width = '100%'

    const messageElement = this.shadowRoot.querySelector('.notice')
    messageElement.classList.add('active')

    setTimeout(() => {
      messageElement.classList.remove('active')
      colorTimeElement.style.transition = 'none'
      colorTimeElement.style.width = '0%'
    }, 5000)
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .color-container {
        position: relative;
        width: 100%;
        height: 0.2rem;
        overflow: hidden;
        border-radius: 8px 8px 0 0;
      }

      .color,
      .color-time {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
      }

      .color {
        width: 100%;
        z-index: 0;
        opacity: 0.2;
      }

      .color-time {
        width: 0%;
        z-index: 1;
        transition: width 5s linear;
      }

      .success {
        background-color: #6366f1;
      }

      .error {
        background-color: #dc2626;
      }

      .notice {
        background-color: rgba(17, 24, 39, 0.95);
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateX(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
      }

      .notice.active {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }

      .message {
        padding: 1.25rem;
        color: white;
        font-family: "Nunito Sans", sans-serif;
        font-size: 0.95rem;
        min-width: 250px;
      }

    </style>

    <section class="notice">
      <div class="color-container">
        <div class="color"></div>
        <div class="color-time"></div>
      </div>
      <div class="message">
        <span></span>
      </div>
    </section>

    `
  }
}

customElements.define('message-component', Message)
