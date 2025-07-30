import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class BotForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      const formElement = currentState.crud.formElement
      if (
        formElement.data &&
        formElement.endPoint === this.endpoint &&
        !isEqual(this.formElementData, formElement.data)
      ) {
        this.formElementData = formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
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

      .form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .form-header {
        align-items: center;
        background-color: #f9fafb;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e5e7eb;
        border-radius: 8px 8px 0 0;
        overflow: visible;
        height: 3rem;
      }

      .form-header-buttons {
        align-items: center;
        display: flex;
        gap: 0.25rem;
      }

      .form-header-buttons > div {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .form-header-buttons > div:hover {
        background-color: #f3f4f6;
      }

      .form-header-buttons svg {
        fill: #6366f1;
        width: 1.8rem;
        transition: fill 0.2s ease;
      }

      .form-header-buttons > div:hover svg {
        fill: #4f46e5;
      }

      .validation-errors {
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        color: #b91c1c;
        font-family: "Nunito Sans", sans-serif;
        font-size: 0.875rem;
        padding: 0.75rem;
        margin-bottom: 1rem;
        display: none;
      }

      .validation-errors.active {
        display: block;
      }

      .validation-errors ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .form-body{
        padding: 1rem;
      }

      .form-element {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-element-label label {
        font-family: "Nunito Sans", sans-serif;
        font-size: 0.95rem;
        color: #374151;
        font-weight: 500;
      }

      .form-element-input input,
      .form-element-input textarea,
      .form-element-input select {
        background-color: #ffffff;
        font-family: "Nunito Sans", sans-serif;
        height: 2.5rem;
        outline: none;
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      .form-element-input textarea {
        height: 6rem;
        resize: vertical;
      }

      .form-element-input input.error,
      .form-element-input textarea.error,
      .form-element-input select.error {
        border-color: #dc2626;
      }

      .error-message {
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-element-input input:focus,
      .form-element-input textarea:focus,
      .form-element-input select:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .tooltip {
        position: absolute;
        background-color: #4f46e5;
        color: #ffffff;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        white-space: nowrap;
        transform: translateY(-120%);
        margin-bottom: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s ease;  
        z-index: 10;
      }

      .button {
        position: relative;
      }

      .button:hover .tooltip {
        opacity: 1;
      }
      </style>
      <section class="form">
        <div class="form-header">
            <div class="form-header-buttons">
                <div class="button clean-button">
                  <span class="tooltip">Resetear</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>broom</title><path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" /></svg>
                </div>
                <div class="button save-button">
                  <span class="tooltip">Guardar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>content-save</title><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" /></svg>
                </div>
            </div>
        </div>
        <div class="form-body">
          <div class="validation-errors">
            <div class="close-validation-errors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
            </div>
            <ul></ul>
          </div>
          <form>
            <input type="hidden" name="id">
            <div class="form-element">
              <div class="form-element-label">
                <label for="platform">Plataforma</label>
              </div>
              <div class="form-element-input">
                <select id="platform" name="platform">
                  <option value="">Selecciona una plataforma</option>
                  <option value="telegram">Telegram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="discord">Discord</option>
                </select>
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="name">Nombre</label>
              </div>
              <div class="form-element-input">
                <input type="text" id="name" name="name">
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="description">Descripción</label>
              </div>
              <div class="form-element-input">
                <textarea id="description" name="description"></textarea>
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="token">Token</label>
              </div>
              <div class="form-element-input">
                <input type="text" id="token" name="token">
              </div>
            </div>
          </form>
        </div>
    </section>
  `

    this.renderButtons()
  }

  renderButtons () {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
      }
    })

    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()

      if (event.target.closest('.save-button')) {
        const form = this.shadow.querySelector('form')
        const formData = new FormData(form)
        const formDataJson = {}

        for (const [key, value] of formData.entries()) {
          formDataJson[key] = value
        }

        const id = this.shadow.querySelector('[name="id"]').value
        const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
        const method = id ? 'PUT' : 'POST'
        delete formDataJson.id

        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJson)
          })

          if (!response.ok) {
            throw response
          }

          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()

          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'Datos guardados correctamente',
              type: 'success'
            }
          }))
        } catch (error) {
          if (error.status === 500) {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: {
                message: 'No se han podido guardar los datos',
                type: 'error'
              }
            }))
          }

          if (error.status === 422) {
            const data = await error.json()
            this.showValidationErrors(data.message)
          }
        }
      }

      if (event.target.closest('.clean-button')) {
        this.resetForm()
      }

      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }

  resetForm () {
    const form = this.shadow.querySelector('form')
    form.reset()
    this.shadow.querySelector('[name="id"]').value = ''
    this.formElementData = null
    this.shadow.querySelectorAll('.error-message').forEach(el => el.remove())
    this.shadow.querySelectorAll('.form-element-input input').forEach(input => {
      input.classList.remove('error')
    })
  }

  showValidationErrors (errors) {
    const validationErrorsContainer = this.shadow.querySelector('.validation-errors')
    validationErrorsContainer.classList.add('active')

    const validationErrorsContainerList = this.shadow.querySelector('.validation-errors ul')
    validationErrorsContainerList.innerHTML = ''
    this.shadow.querySelectorAll('.form-element-input input').forEach(input => {
      input.classList.remove('error')
    })

    errors.forEach(error => {
      const li = document.createElement('li')
      li.textContent = error.message
      validationErrorsContainer.appendChild(li)
      this.shadow.querySelector(`[name="${error.path}"]`).classList.add('error')
    })
  }

  closeValidationErrors () {
    const validationErrorsContainer = this.shadow.querySelector('.validation-errors')
    validationErrorsContainer.classList.remove('active')
    validationErrorsContainer.querySelector('ul').innerHTML = ''
  }
}

customElements.define('bots-form-component', BotForm)
