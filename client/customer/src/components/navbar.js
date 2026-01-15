class NavbarComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  isAuthenticated () {
    return !!localStorage.getItem('token')
  }

  getUserName () {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        return JSON.parse(user).name
      } catch (e) {
        return null
      }
    }
    return null
  }

  render () {
    const isAuth = this.isAuthenticated()
    const userName = this.getUserName()

    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
          width: 100%;
        }

        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .logo {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #2c3e50;
          text-decoration: none;
          cursor: pointer;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1rem;
          color: #2c3e50;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-link:hover {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
        }

        .btn-primary {
          font-family: "Nunito Sans", sans-serif;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          border: none;
          padding: 0.625rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }

        .btn-secondary {
          font-family: "Nunito Sans", sans-serif;
          background: transparent;
          color: #3498db;
          border: 2px solid #3498db;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #3498db;
          color: white;
        }

        .user-menu {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: "Nunito Sans", sans-serif;
          font-size: 1rem;
          color: #2c3e50;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 0.5rem;
          min-width: 200px;
          display: none;
          overflow: hidden;
        }

        .dropdown-menu.active {
          display: block;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1.25rem;
          text-align: left;
          background: none;
          border: none;
          font-family: "Nunito Sans", sans-serif;
          font-size: 1rem;
          color: #2c3e50;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .logo {
            font-size: 1.25rem;
          }

          .nav-menu {
            gap: 0.75rem;
          }

          .nav-link, .btn-primary, .btn-secondary {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }

          .user-name {
            display: none;
          }
        }
      </style>

      <nav class="navbar">
        <a href="/" class="logo">YourBrand</a>

        <div class="nav-menu">
          ${!isAuth ? /* html */`
            <a href="/login" class="nav-link">Iniciar Sesión</a>
            <button class="btn-primary" data-action="register">Registrarse</button>
          ` : /* html */`
            <span class="user-name">Hola, ${userName || 'Usuario'}</span>
            <div class="dropdown">
              <button class="dropdown-btn" data-action="toggle-dropdown">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M5.5 21a7.5 7.5 0 0 1 15 0"/>
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" data-action="profile">Mi Perfil</button>
                <button class="dropdown-item" data-action="invoices">Mis Facturas</button>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" data-action="logout">Cerrar Sesión</button>
              </div>
            </div>
          `}
        </div>
      </nav>
    `

    this.setupEventListeners()
  }

  setupEventListeners () {
    this.shadow.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action

      if (action) {
        e.preventDefault()
        this.handleAction(action)
      }
    })

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.shadow.contains(e.target)) {
        const dropdown = this.shadow.querySelector('.dropdown-menu')
        if (dropdown) {
          dropdown.classList.remove('active')
        }
      }
    })
  }

  handleAction (action) {
    switch (action) {
      case 'register':
        window.location.href = '/register'
        break
      case 'toggle-dropdown':
        const dropdown = this.shadow.querySelector('.dropdown-menu')
        dropdown.classList.toggle('active')
        break
      case 'profile':
        window.location.href = '/profile'
        break
      case 'invoices':
        window.location.href = '/invoices'
        break
      case 'logout':
        this.logout()
        break
    }
  }

  logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }
}

customElements.define('navbar-component', NavbarComponent)
