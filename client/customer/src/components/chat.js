class Chat extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.open = false
    this.messages = []
  }

  connectedCallback () {
    this.render()
    this.setupEventListeners()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      
      /* Replaced Sass variables with static values */
      .scrollbar-width { width: 5px; }
      .chat-thread-bgd-color { background-color: rgba(25, 147, 147, 0.2); }
      .chat-thread-msg-arrow-size { width: 10px; height: 10px; }
      .chat-thread-avatar-size { width: 25px; height: 25px; }
      /* chat-thread-offset = avatar-size + 20px = 45px */

      .chat-button {
        cursor: pointer;
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: white;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(-45deg, #183850 0, #183850 25%, #192C46 50%, #22254C 75%, #22254C 100%);
        background-attachment: fixed;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14);
        transition: all 250ms ease-out;
        z-index: 1000;
        opacity: 1 !important;
        visibility: visible !important;
      }

      .chat-button:hover {
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }

      .chat-button.expanded {
        width: 300px;
        height: 400px;
        max-height: 400px;
        border-radius: 8px;
        cursor: auto;
      }

      .chat {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        transition: all 250ms ease-out;
      }

      .chat.enter {
        opacity: 1;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        margin: 10px;
      }

      .header {
        flex-shrink: 0;
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title {
        flex-grow: 1;
        font-size: 1.1rem;
        font-weight: 500;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
      }

      .messages {
        padding: 10px;
        margin: 0;
        list-style: none;
        overflow-y: scroll;
        flex-grow: 1;
        border-radius: 4px;
      }

      .messages::-webkit-scrollbar {
        width: 5px;
      }

      .messages::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: rgba(25, 147, 147, 0.1);
      }

      .messages::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(25, 147, 147, 0.2);
      }

      .message {
        position: relative;
        clear: both;
        display: inline-block;
        padding: 14px;
        margin: 0 0 20px 0;
        font: 12px/16px 'Noto Sans', sans-serif;
        border-radius: 10px;
        background-color: rgba(25, 147, 147, 0.2);
        word-wrap: break-word;
        max-width: 81%;
      }

      .message.self {
        float: left;
        margin-left: 45px;
        color: #0EC879;
        animation: show-chat-even 0.15s 1 ease-in;
      }

      .message.other {
        float: right;
        margin-right: 45px;
        color: #0AD5C1;
        animation: show-chat-odd 0.15s 1 ease-in;
      }

      .footer {
        flex-shrink: 0;
        display: flex;
        padding-top: 10px;
      }

      .text-box {
        border-radius: 3px;
        background: rgba(25, 147, 147, 0.2);
        width: 100%;
        color: #0EC879;
        padding: 8px;
        border: none;
        margin-right: 5px;
      }

      .send-btn {
        background: transparent;
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 3px;
        cursor: pointer;
      }

      @keyframes show-chat-even {
        0% { margin-left: -480px; }
        100% { margin-left: 45px; }
      }

      @keyframes show-chat-odd {
        0% { margin-right: -480px; }
        100% { margin-right: 45px; }
      }
    </style>

    <div class="chat-button">
      <svg class="chat-icon" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z"/>
      </svg>
      <div class="chat">
        <div class="header">
          <span class="title">¿En qué podemos ayudarte?</span>
          <button class="close-btn">
            <svg class="close-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <ul class="messages"></ul>
        <div class="footer">
          <input type="text" class="text-box" placeholder="Escribe tu mensaje...">
          <button class="send-btn">Enviar</button>
        </div>
      </div>
    </div>
    `
  }

  setupEventListeners () {
    const chatBtn = this.shadow.querySelector('.chat-button')
    const closeBtn = this.shadow.querySelector('.close-btn')
    const sendBtn = this.shadow.querySelector('.send-btn')
    const textBox = this.shadow.querySelector('.text-box')

    chatBtn.addEventListener('click', () => this.toggleChat())
    closeBtn.addEventListener('click', () => this.toggleChat())
    sendBtn.addEventListener('click', () => this.sendMessage())
    textBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage()
    })
  }

  toggleChat () {
    const chat = this.shadow.querySelector('.chat-button')
    const chatWindow = this.shadow.querySelector('.chat')

    this.open = !this.open
    chat.classList.toggle('expanded')
    chatWindow.classList.toggle('enter')
  }

  async sendMessage () {
    const input = this.shadow.querySelector('.text-box')
    const message = input.value.trim()
    if (!message) return

    this.addMessage(message, 'self')
    input.value = ''

    const response = await this.getAIResponse(message)
    this.addMessage(response, 'other')
  }

  addMessage (text, type) {
    const messagesContainer = this.shadow.querySelector('.messages')
    const messageElement = document.createElement('li')
    messageElement.classList.add('message', type)
    messageElement.textContent = text
    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  async getAIResponse (message) {
    try {
      const response = await fetch('/api/customer/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: message,
          threadId: this.threadId || null
        })
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()
      this.threadId = data.threadId
      return data.answer
    } catch (error) {
      console.error('Error al obtener respuesta:', error)
      return 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta nuevamente.'
    }
  }
}

customElements.define('chat-component', Chat)
