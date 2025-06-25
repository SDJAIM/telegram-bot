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
      *{
        box-sizing: border-box;
      }

      .overlay{
        align-items: center;
        background-color: hsl(0, 0%, 0%, 0.7);
        display: flex;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      }

      .overlay.active{
        opacity: 1;
        visibility: visible;
      }

      .validate {
        background-color: wheat;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 2rem;
        border: 2px solid;
        border-color: hsl(0, 0%, 0%);
        width: 25%;
      }

      .option-buttons{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

    </style>

    <div class="overlay">
      <section class="validate">
        <div calss= "notice-info">
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
