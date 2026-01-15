class CustomerRegisterComponent extends HTMLElement {
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

        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }

        .register-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-header h1 {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.75rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .register-header p {
          font-family: "Nunito Sans", sans-serif;
          color: #666;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-family: "Nunito Sans", sans-serif;
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
          font-family: "Nunito Sans", sans-serif;
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

        .message {
          border-radius: 6px;
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.875rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          display: none;
        }

        .message.error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .message.success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .message.active {
          display: block;
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-family: "Nunito Sans", sans-serif;
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
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.875rem;
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .links a:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        .back-home {
          text-align: center;
          margin-bottom: 1rem;
        }

        .back-home a {
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.875rem;
          color: #6366f1;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-home a:hover {
          text-decoration: underline;
        }

        .password-requirements {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #f3f4f6;
          border-radius: 4px;
        }

        .password-requirements small {
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.75rem;
          color: #6b7280;
          display: block;
        }
      </style>

      <div class="register-container">
        <div class="register-card">
          <div class="back-home">
            <a href="/">← Volver al inicio</a>
          </div>

          <div class="register-header">
            <h1>Crear Cuenta</h1>
            <p>Regístrate para acceder</p>
          </div>

          <div class="message"></div>

          <form>
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text" id="name" name="name" required placeholder="Tu nombre">
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="tu@email.com">
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" name="password" required placeholder="Mínimo 8 caracteres">
              <div class="password-requirements">
                <small>La contraseña debe tener al menos 8 caracteres</small>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Repite la contraseña">
            </div>

            <button type="submit" class="submit-btn">Crear Cuenta</button>
          </form>

          <div class="links">
            <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
          </div>
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  setupEventListeners () {
    const form = this.shadow.querySelector('form')
    const message = this.shadow.querySelector('.message')

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const submitBtn = this.shadow.querySelector('.submit-btn')
      submitBtn.disabled = true
      submitBtn.textContent = 'Registrando...'
      message.classList.remove('active', 'error', 'success')

      const formData = new FormData(form)
      const password = formData.get('password')
      const confirmPassword = formData.get('confirmPassword')

      if (password.length < 8) {
        message.textContent = 'La contraseña debe tener al menos 8 caracteres'
        message.classList.add('active', 'error')
        submitBtn.disabled = false
        submitBtn.textContent = 'Crear Cuenta'
        return
      }

      if (password !== confirmPassword) {
        message.textContent = 'Las contraseñas no coinciden'
        message.classList.add('active', 'error')
        submitBtn.disabled = false
        submitBtn.textContent = 'Crear Cuenta'
        return
      }

      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password
      }

      try {
        const response = await fetch('/api/auth/customer/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Error al registrar')
        }

        message.textContent = '¡Registro exitoso! Por favor revisa tu email para activar tu cuenta.'
        message.classList.add('active', 'success')
        form.reset()

        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000)
      } catch (err) {
        message.textContent = err.message
        message.classList.add('active', 'error')
      } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Crear Cuenta'
      }
    })
  }
}

customElements.define('customer-register-component', CustomerRegisterComponent)
