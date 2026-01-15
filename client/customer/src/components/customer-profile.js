class CustomerProfileComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.user = null
  }

  async connectedCallback () {
    await this.loadUserData()
    this.render()
  }

  async loadUserData () {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/auth/customer/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return
        }
        throw new Error('Error al cargar datos del usuario')
      }

      this.user = await response.json()
      localStorage.setItem('user', JSON.stringify(this.user))
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  render () {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}')

    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }

        .profile-header h1 {
          font-family: "Nunito Sans", sans-serif;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .profile-header p {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.125rem;
          color: #7f8c8d;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .card h2 {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #3498db;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-family: "Nunito Sans", sans-serif;
          font-weight: 600;
          color: #7f8c8d;
          font-size: 0.875rem;
        }

        .info-value {
          font-family: "Nunito Sans", sans-serif;
          color: #2c3e50;
          font-size: 1rem;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (min-width: 768px) {
          .quick-actions {
            grid-template-columns: 1fr 1fr;
          }
        }

        .action-btn {
          font-family: "Nunito Sans", sans-serif;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
        }

        .stat-value {
          font-family: "Nunito Sans", sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-family: "Nunito Sans", sans-serif;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .loading {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>

      <div class="profile-container">
        ${!this.user ? /* html */`
          <div class="loading">
            <div class="loading-spinner"></div>
            <p style="margin-top: 1rem; font-family: 'Nunito Sans', sans-serif; color: #7f8c8d;">Cargando perfil...</p>
          </div>
        ` : /* html */`
          <div class="profile-header">
            <h1>Mi Perfil</h1>
            <p>Bienvenido/a de nuevo, ${user.name || 'Usuario'}</p>
          </div>

          <div class="profile-grid">
            <div class="card">
              <h2>Información Personal</h2>
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span class="info-value">${user.name || 'No especificado'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email || 'No especificado'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Miembro desde:</span>
                <span class="info-value">${user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estado:</span>
                <span class="info-value" style="color: #27ae60; font-weight: 600;">Activo</span>
              </div>
            </div>

            <div class="card">
              <h2>Estadísticas</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">0</div>
                  <div class="stat-label">Facturas</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                  <div class="stat-value">$0</div>
                  <div class="stat-label">Total Gastado</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card" style="margin-top: 2rem;">
            <h2>Acciones Rápidas</h2>
            <div class="quick-actions">
              <button class="action-btn" data-action="invoices">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Ver Mis Facturas
              </button>
              <button class="action-btn secondary" data-action="support">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Soporte
              </button>
            </div>
          </div>
        `}
      </div>
    `

    this.setupEventListeners()
  }

  setupEventListeners () {
    this.shadow.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action

      if (action === 'invoices') {
        window.location.href = '/invoices'
      } else if (action === 'support') {
        alert('Funcionalidad de soporte próximamente')
      }
    })
  }
}

customElements.define('customer-profile-component', CustomerProfileComponent)
