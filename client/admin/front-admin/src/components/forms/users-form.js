import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class UserForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/users'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
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

      .form-header-tabs{
        height: 100%;
      }

      .form-header-tabs ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        height: 100%;
      }

      .form-header-tabs ul li {
        align-items: center;
        background-color: #f3f4f6;
        display: flex;
        font-family: "Nunito Sans", sans-serif;
        height: 100%;
        padding: 0 1rem;
        color: #6b7280;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-right: 0.5rem;
      }

      .form-header-tabs ul li:hover {
        cursor: pointer;
      }

      .form-header-tabs ul li.active {
        background-color: #4f46e5;
        color: #ffffff;

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

      .form-body{
        padding: 1rem;
      }

      .form-body form {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(2, 1fr);
        padding: 1rem 0;
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

      .form-element-input input {
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

      .form-element-input input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .form-element-input select {
        font-family: "Nunito Sans", sans-serif;
        height: 2.5rem;
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background-color: #ffffff;
        transition: all 0.2s ease;
      }

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
            <div class="form-header-tabs">
                <ul>
                    <li class="active">General</li>
                    <li>Imágenes</li>
                </ul>
            </div>
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
            <form>
                <input type="hidden" name="id">
                <div class="form-element">
                    <div class="form-element-label">
                        <label for="nombre">Nombre</label>
                </div>
                    <div class="form-element-input">
                        <input type="text" id="nombre" name="name">
                    </div>
                </div>
                <div class="form-element">
                    <div class="form-element-label">
                        <label for="email">Email</label>
                    </div>
                    <div class="form-element-input">
                        <input type="email" id="email" name="email">
                    </div>
                </div>
            </form>
        </div>
    </section>
  `

    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.save-button').addEventListener('click', async event => {
      event.preventDefault()

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
          throw new Error(`Error al guardar los datos: ${response.statusText}`)
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
        document.dispatchEvent(new CustomEvent('notice', {
          detail: {
            message: 'No se han podido guardar los datos',
            type: 'error'
          }
        }))
      }
    })

    this.shadow.querySelector('.clean-button').addEventListener('click', async event => {
      this.resetForm()
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

  showError (input, message) {
    const errorElement = document.createElement('div')
    errorElement.className = 'error-message'
    errorElement.textContent = message
    errorElement.style.color = '#ff4444'
    errorElement.style.fontSize = '0.8rem'
    errorElement.style.marginTop = '0.2rem'
    input.classList.add('error')
    input.parentElement.appendChild(errorElement)
  }

  validateEmail (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }
}

customElements.define('users-form-component', UserForm)
