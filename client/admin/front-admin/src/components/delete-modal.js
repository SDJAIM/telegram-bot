import { store } from '../redux/store.js'
import { refreshTable } from '../redux/crud-slice.js'

class DeleteModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = ''
    this.tableEndpoint = ''
    document.addEventListener('showDeleteModal', this.showDeleteModal.bind(this))
  }

  connectedCallback () {
    this.render()
  }

  showDeleteModal (event) {
    const { endpoint, elementId } = event.detail
    this.tableEndpoint = endpoint
    this.endpoint = `${endpoint}/${elementId}`
    this.shadow.querySelector('.overlay').classList.add('active')
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

      .overlay {
        align-items: center;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
      }

      .overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .validate {
        background-color: #ffffff;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
        border-radius: 12px;
        width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }

      .overlay.active .validate {
        transform: translateY(0);
      }

      .option-buttons {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 1rem;
      }

      .option-buttons button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: "Nunito Sans", sans-serif;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .acepted-button button {
        background-color: #dc2626;
        color: white;
      }

      .acepted-button button:hover {
        background-color: #b91c1c;
      }

      .denied-button button {
        background-color: #f3f4f6;
        color: #111827;
      }

      .denied-button button:hover {
        background-color: #e5e7eb;
      }

      .notice-info {
        color: #1e293b;
        font-family: "Nunito Sans", sans-serif;
        font-size: 1.1rem;
        line-height: 1.5;
      }

      .notice-info span {
        color: inherit;
      }

    </style>

    <div class="overlay">
      <section class="validate">
        <div class="notice-info">
          <span>Está seguro que quiere eliminar los datos</span>
        </div>
        <div class="option-buttons">
          <div class="acepted-button">
            <button class="acepted-button">Sí</button>
          </div>
          <div class="denied-button">
            <button>No</button>
          </div> 
        </div> 
      </section>
    </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    const aceptedButton = this.shadow.querySelector('.acepted-button')
    const deniedButton = this.shadow.querySelector('.denied-button')

    aceptedButton.addEventListener('click', async () => {
      try {
        const response = await fetch(this.endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Error al eliminar el elemento')
        }

        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'Elemento eliminado correctamente',
            type: 'success'
          }
        }))

        store.dispatch(refreshTable(this.tableEndpoint))

        this.shadow.querySelector('.overlay').classList.remove('active')
      } catch (error) {
        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'No se han podido eleminar el dato',
            type: 'error'
          }
        }))

        this.shadow.querySelector('.overlay').classList.remove('active')
      }
    })

    deniedButton.addEventListener('click', event => {
      this.shadow.querySelector('.overlay').classList.remove('active')
    })
  }
}
customElements.define('delete-modal-component', DeleteModal)
