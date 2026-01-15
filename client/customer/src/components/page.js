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
      '/': 'home.html',
      '/login': 'login.html',
      '/register': 'register.html',
      '/forgot-password': 'forgot-password.html'
    }

    const protectedRoutes = {
      '/profile': 'profile.html',
      '/invoices': 'invoices.html'
    }

    // Check if it's a protected route
    if (protectedRoutes[path]) {
      if (!this.isAuthenticated()) {
        window.location.href = '/login'
        return
      }
      await this.loadPage(protectedRoutes[path])
      return
    }

    // Check if it's a public route
    if (publicRoutes[path]) {
      // Redirect to profile if already authenticated and trying to access login/register
      if (this.isAuthenticated() && (path === '/login' || path === '/register')) {
        window.location.href = '/profile'
        return
      }
      await this.loadPage(publicRoutes[path])
      return
    }

    // Default to 404
    await this.loadPage('404.html')
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()
    // this.basePath va a buscar la carpeta pages y el nombre del archivo que le hayas dicho, el nombre del archivo puede ser home.html, users.html, etc.
    // ahora en const html convertimos en texto el contenido del archivo que hemos cargado.

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
    // el componente tiene su propio shadowRoot, por lo que no se va a mezclar con el resto del DOM de la pagina,
    // y le asignamos el contenido del archivo que hemos cargado.
    // coges el fragmento de la url
    // fetch es una funcion que hace peticiones http, cuando estoy haciendo un await fetch le estoy haciendo la peticion a mi mismo, las peticiones las
    // gestiona el proxy que tengo montado en el servidor, que es el que se encarga de servir los archivos estaticos, y le digo que me traiga el archivo
  }
}

customElements.define('page-component', PageComponent)
