class User extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = null
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    const response = await fetch('/api/customer/users')
    this.data = await response.json()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
      <div class="users">
      </div>
    `

    this.data.forEach(user => {
      const userElement = document.createElement('div')
      userElement.classList.add('user')
      userElement.innerHTML = `
        <p>ID: ${user.id}</p>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
      `
      this.shadow.querySelector('.users').appendChild(userElement)
    })
  }
}

customElements.define('users-component', User)
