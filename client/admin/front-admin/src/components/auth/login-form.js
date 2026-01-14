import { store } from '../../redux/store.js'
import { setUser } from '../../redux/auth-slice.js'

class LoginForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }

        .login-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-family: "Roboto", sans-serif;
          font-size: 1.75rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          font-family: "Roboto", sans-serif;
          color: #666;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-family: "Roboto", sans-serif;
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-group input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group input.error {
          border-color: #dc2626;
        }

        .error-message {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #b91c1c;
          font-family: "Roboto", sans-serif;
          font-size: 0.875rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          display: none;
        }

        .error-message.active {
          display: block;
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .links {
          margin-top: 1.5rem;
          text-align: center;
        }

        .links a {
          font-family: "Roboto", sans-serif;
          font-size: 0.875rem;
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .links a:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        .links .separator {
          color: #9ca3af;
          margin: 0 0.5rem;
        }
      </style>

      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder</p>
          </div>

          <div class="error-message"></div>

          <form>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="tu@email.com">
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>

            <button type="submit" class="submit-btn">Iniciar Sesión</button>
          </form>

          <div class="links">
            <a href="/admin/forgot-password">¿Olvidaste tu contraseña?</a>
            <span class="separator">|</span>
            <a href="/admin/register">Crear cuenta</a>
          </div>
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  setupEventListeners () {
    const form = this.shadow.querySelector('form')
    const errorMessage = this.shadow.querySelector('.error-message')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const submitBtn = this.shadow.querySelector('.submit-btn')
      submitBtn.disabled = true
      submitBtn.textContent = 'Cargando...'
      errorMessage.classList.remove('active')

      const formData = new FormData(form)
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Error al iniciar sesión')
        }

        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))

        store.dispatch(setUser(result.user))

        window.location.href = '/admin/usuarios'
      } catch (err) {
        errorMessage.textContent = err.message
        errorMessage.classList.add('active')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Iniciar Sesión'
      }
    })
  }
}

customElements.define('login-form-component', LoginForm)
