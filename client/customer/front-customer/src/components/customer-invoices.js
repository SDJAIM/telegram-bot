class CustomerInvoicesComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.invoices = []
  }

  async connectedCallback () {
    await this.loadInvoices()
    this.render()
  }

  async loadInvoices () {
    // Simulación de datos - reemplazar con llamada real a API
    this.invoices = [
      {
        id: 1,
        number: 'INV-2024-001',
        date: '2024-01-15',
        amount: 149.99,
        status: 'paid',
        description: 'Suscripción Premium - Enero 2024'
      },
      {
        id: 2,
        number: 'INV-2023-012',
        date: '2023-12-15',
        amount: 149.99,
        status: 'paid',
        description: 'Suscripción Premium - Diciembre 2023'
      },
      {
        id: 3,
        number: 'INV-2023-011',
        date: '2023-11-15',
        amount: 149.99,
        status: 'paid',
        description: 'Suscripción Premium - Noviembre 2023'
      }
    ]
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .invoices-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .invoices-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }

        .invoices-header h1 {
          font-family: "Nunito Sans", sans-serif;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .invoices-header p {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.125rem;
          color: #7f8c8d;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: "Nunito Sans", sans-serif;
          color: #3498db;
          text-decoration: none;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .back-link:hover {
          text-decoration: underline;
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

        .invoices-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoices-table thead {
          background: #f8f9fa;
        }

        .invoices-table th {
          font-family: "Nunito Sans", sans-serif;
          text-align: left;
          padding: 1rem;
          color: #2c3e50;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
        }

        .invoices-table td {
          font-family: "Nunito Sans", sans-serif;
          padding: 1rem;
          border-bottom: 1px solid #ecf0f1;
          color: #2c3e50;
        }

        .invoices-table tbody tr:hover {
          background: #f8f9fa;
        }

        .invoice-number {
          font-weight: 600;
          color: #3498db;
        }

        .invoice-amount {
          font-weight: 600;
          color: #27ae60;
          font-size: 1.125rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-paid {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-overdue {
          background: #f8d7da;
          color: #721c24;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          font-family: "Nunito Sans", sans-serif;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-view {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
        }

        .btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }

        .btn-download {
          background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
          color: white;
        }

        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(149, 165, 166, 0.4);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state svg {
          margin-bottom: 1.5rem;
          opacity: 0.3;
        }

        .empty-state h3 {
          font-family: "Nunito Sans", sans-serif;
          font-size: 1.5rem;
          color: #7f8c8d;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          font-family: "Nunito Sans", sans-serif;
          color: #95a5a6;
        }

        @media (max-width: 768px) {
          .invoices-table {
            font-size: 0.875rem;
          }

          .invoices-table th,
          .invoices-table td {
            padding: 0.75rem 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      </style>

      <div class="invoices-container">
        <a href="/profile" class="back-link">
          ← Volver al perfil
        </a>

        <div class="invoices-header">
          <h1>Mis Facturas</h1>
          <p>Historial completo de tus transacciones</p>
        </div>

        <div class="card">
          <h2>Facturas Recientes</h2>

          ${this.invoices.length === 0 ? /* html */`
            <div class="empty-state">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h3>No tienes facturas</h3>
              <p>Tus facturas aparecerán aquí cuando realices tu primera compra</p>
            </div>
          ` : /* html */`
            <table class="invoices-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.invoices.map(invoice => /* html */`
                  <tr>
                    <td class="invoice-number">${invoice.number}</td>
                    <td>${new Date(invoice.date).toLocaleDateString('es-ES')}</td>
                    <td>${invoice.description}</td>
                    <td class="invoice-amount">$${invoice.amount.toFixed(2)}</td>
                    <td>
                      <span class="status-badge status-${invoice.status}">
                        ${invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-view" data-action="view" data-id="${invoice.id}">Ver</button>
                        <button class="btn btn-download" data-action="download" data-id="${invoice.id}">Descargar</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `

    this.setupEventListeners()
  }

  setupEventListeners () {
    this.shadow.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]')
      if (!target) return

      const action = target.dataset.action
      const invoiceId = target.dataset.id

      if (action === 'view') {
        this.viewInvoice(invoiceId)
      } else if (action === 'download') {
        this.downloadInvoice(invoiceId)
      }
    })
  }

  viewInvoice (id) {
    const invoice = this.invoices.find(inv => inv.id === parseInt(id))
    if (invoice) {
      alert(`Ver factura: ${invoice.number}\n\nDescripción: ${invoice.description}\nMonto: $${invoice.amount}\nFecha: ${invoice.date}`)
      // Aquí podrías abrir un modal o redirigir a una página de detalle
    }
  }

  downloadInvoice (id) {
    const invoice = this.invoices.find(inv => inv.id === parseInt(id))
    if (invoice) {
      // Simulación de descarga
      alert(`Descargando factura: ${invoice.number}\n\nEn una implementación real, se generaría un PDF de la factura.`)

      // Implementación real podría ser:
      // window.open(`/api/invoices/${id}/download`, '_blank')
    }
  }
}

customElements.define('customer-invoices-component', CustomerInvoicesComponent)
