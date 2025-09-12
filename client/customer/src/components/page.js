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

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async getTemplate (path) {
    const routes = {
      '/': 'home.html'
    }
    // es un objeto '/' que dice 'si path es igual a /, entonces carga home.html' si no existe, carga 404.html. entonces se lo paso a una funcion que
    // se encarga de cargar la pagina.

    const filename = routes[path] || '404.html'

    await this.loadPage(filename)
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
