class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  connectedCallback () {
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  isAuthenticated () {
    return !!localStorage.getItem('token')
  }

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async getTemplate (path) {
    const publicRoutes = {
      '/admin/login': 'login.html',
      '/admin/register': 'register.html',
      '/admin/forgot-password': 'forgot-password.html'
    }

    const protectedRoutes = {
      '/admin/usuarios': 'users.html',
      '/admin/categorias-de-eventos': 'event-categories.html',
      '/admin/promotores': 'promoters.html',
      '/admin/faqs': 'faqs.html',
      '/admin/heroes': 'hero.html',
    }

    if (path.startsWith('/admin/reset-password/')) {
      await this.loadPage('reset-password.html')
      return
    }

    if (publicRoutes[path]) {
      if (this.isAuthenticated() && path === '/admin/login') {
        window.location.href = '/admin/usuarios'
        return
      }
      await this.loadPage(publicRoutes[path])
      return
    }

    if (!this.isAuthenticated()) {
      window.location.href = '/admin/login'
      return
    }

    const filename = protectedRoutes[path] || '404.html'
    await this.loadPage(filename)
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)
