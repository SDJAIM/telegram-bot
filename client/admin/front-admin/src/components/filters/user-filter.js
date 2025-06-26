class UserFilter extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = ''
    this.tableEndpoint = ''
    document.addEventListener('showFilterModal', this.showFilterModal.bind(this))
  }

  connectedCallback () {
    this.render()
  }

  showFilterModal (event) {
    this.shadow.querySelector('.overlay').classList.add('active')
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      * {
        box-sizing: border-box;
      }

      .overlay {
        align-items: center;
        background-color: hsl(0, 0%, 0%, 0.9);
        display: flex;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
      }

      .overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .filter-modal {
        background-color: #1b0044;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        border-radius: 12px;
        width: 400px;
        border: 1px solid hsl(240, 50%, 40%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .filter-field {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .filter-field label {
        font-weight: bold;
        color: white;
        font-family: "Nunito Sans", sans-serif;
      }

      .filter-field input {
        padding: 0.75rem;
        border: 1px solid hsl(240, 50%, 40%);
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        font-family: "Nunito Sans", sans-serif;
        transition: border-color 0.3s ease;
      }

      .filter-field input:focus {
        outline: none;
        border-color: hsl(271, 100%, 66%);
      }

      .filter-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .filter-buttons button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: "Nunito Sans", sans-serif;
        font-weight: bold;
        transition: all 0.3s ease;
      }

      .apply-button {
        background-color: hsl(240, 50%, 40%);
        color: white;
      }

      .apply-button:hover {
        background-color: hsl(271, 100%, 66%);
      }

      .reset-button {
        background-color: transparent;
        color: hsl(240, 50%, 40%);
        border: 1px solid hsl(240, 50%, 40%);
      }

      .reset-button:hover {
        color: hsl(271, 100%, 66%);
        border-color: hsl(271, 100%, 66%);
      }
    </style>

    <div class="overlay">
      <div class="filter-modal">
        <form>
          <div class="filter-field">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre">
          </div>
          <div class="filter-field">
            <label for="email">Email:</label>
            <input type="email" id="email">
          </div>
        </form>
        <div class="filter-buttons">
          <button class="apply-button">Aplicar filtros</button>
          <button class="reset-button">Restablecer</button>
        </div>
      </div>
    </div>
    `
    this.renderButtons()
  }

  renderButtons () {
    const applyButton = this.shadow.querySelector('.apply-button')
    const resetButton = this.shadow.querySelector('.reset-button')
    const overlay = this.shadow.querySelector('.overlay')

    applyButton.addEventListener('click', (e) => {
      e.preventDefault()

      const filters = {
        nombre: this.shadow.querySelector('#nombre').value,
        email: this.shadow.querySelector('#email').value,
        fechaCreacion: this.shadow.querySelector('#fecha-creacion')?.value || '',
        fechaActualizacion: this.shadow.querySelector('#fecha-actualizacion')?.value || ''
      }

      document.dispatchEvent(new CustomEvent('applyUserFilters', {
        detail: { filters }
      }))

      overlay.classList.remove('active')
    })

    resetButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      form.reset()

      // Dispatch event to notify filters have been reset
      document.dispatchEvent(new CustomEvent('resetUserFilters'))
    })

    // Close modal when clicking outside
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active')
      }
    })
  }
}

customElements.define('user-filter-component', UserFilter)
