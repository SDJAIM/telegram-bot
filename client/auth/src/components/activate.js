class Activation extends HTMLElement
{
    constructor ()
    {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.data = {}
    }

    async connectedCallback ()
    {
        await this.render()
    }

    render ()
    {
        this.shadow.innerHTML =
    /* html */`
    <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }

      .main {
          justify-items: center;
          height: 100dvh;
          align-content: center;
      }

      .content {
          width: min(520px, 100%);
          background: rgba(255, 255, 255, 0.96);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.55);
      }

      h1 {
          font-size: 26px;
          margin-bottom: 10px;
          color: #111827;
      }

      p {
          font-size: 15px;
          color: #374151;
          margin-bottom: 16px;
      }

      .rules {
          display: grid;
          gap: 10px;
          padding-left: 1.2rem;
          margin: 14px 0 18px;
      }

      .rules li {
          font-size: 13px;
          color: #374151;
      }

      form {
          display: grid;
          gap: 12px;
      }

      input {
          width: 100%;
          padding: 12px 14px;
          font-size: 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          outline: none;
      }

      .error {
          display: none;
          font-size: 13px;
          color: #b91c1c;
          margin-top: 4px;
      }

      .divider {
          height: 1px;
          background: #eef2f7;
          margin: 18px 0 10px;
      }

      .actions {
          display: flex;
          gap: 12px;
          margin-top: 18px;
      }

      .btn {
          border: 0;
          cursor: pointer;
          padding: 12px 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
      }

      .btn-primary {
          background: #111827;
          color: #fff;
      }

      .btn-secondary {
          background: #fff;
          color: #111827;
          border: 1px solid #e5e7eb;
      }
  </style>

  <section class="main">
      <section class="content">
          <h1>Activación de cuenta</h1>
          <p>Pon una contraseña para activar la cuenta.</p>

          <ul class="rules">
              <li>Debe incluir de <strong>8 a 16 caracteres</strong>.</li>
              <li>Debe incluir al menos <strong>una mayúscula</strong>, <strong>un símbolo</strong> y <strong>un número</strong>.</li>
          </ul>

          <form id="activationForm">
                <input name="password" type="password" placeholder="Añade la contraseña">
                <input name="repeat-password" type="password" placeholder="Repite la contraseña">
                <div class="error" id="error"></div>

                <div class="actions">
                    <button class="btn btn-primary" id="activateBtn" href="#">Activar cuenta</button>
                </div>
          </form>

          <div class="divider"></div>

          <div class="message"><span></span></div>

      </section>
  </section>
  `

        this.shadow.querySelector('form').addEventListener('submit', async (event) =>
        {
            event.preventDefault()
            const password = this.shadow.querySelector('input[name="password"]').value
            const repeatPassword = this.shadow.querySelector('input[name="repeat-password"]').value
            const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

            console.log(password, repeatPassword)

            if (password !== repeatPassword) {
                this.shadow.querySelector('.message span').textContent = 'Las contraseñas no coinciden'
                return
            }

            if (!password || !repeatPassword) {
                this.shadow.querySelector('.message span').textContent = 'Los campos no pueden estar vacios'
                return
            }

            if (!regex.test(password)) {
                this.shadow.querySelector('.message span').textContent = 'La contraseña no cumple con los requisitos mínimos'
                return
            }

            const urlParams = new URLSearchParams(window.location.search)
            const token = urlParams.get('token')

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
            })

            if (response.ok) {
                this.shadow.querySelector('.message span').textContent = 'Cuenta activada correctamente'
                const form = this.shadow.querySelector('.form')
                form.reset()
                setTimeout(() =>
                {
                    window.location.href = '/login'
                }, 2000)
            } else {
                const data = await response.json()
                this.shadow.querySelector('.message span').textContent = data.message
            }
        })
    }
}

customElements.define('activation-component', Activation)
