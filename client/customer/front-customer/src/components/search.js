class SearchComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.suggestions = []
    this.debounceTimeout = null
    this.searchCache = new Map()
    this.currentController = null

    this.config = {
      debounceTime: 500,
      cacheTimeout: 300000, // 5 minutos
      fetchTimeout: 8000,
      maxSuggestions: 5,
      errorDisplayTime: 3000
    }

    this.bindMethods()
  }

  bindMethods () {
    this.handleInput = this.handleInput.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  connectedCallback () {
    this.render()
    this.setupEventListeners()
  }

  disconnectedCallback () {
    document.removeEventListener('click', this.handleClickOutside)
    this.cancelPendingRequest()
  }

  render () {
    this.shadow.innerHTML = this.getTemplate()
  }

  getTemplate () {
    return /* html */`
      <style>${this.getStyles()}</style>
      <div class="search-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Buscar..."
          aria-label="Buscar"
        >
        <div class="suggestions-container"></div>
      </div>
    `
  }

  getStyles () {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      :host {
        position: relative;
        display: block;
        width: 100%;
        max-width: 500px;
        margin: 0 auto 20px;
      }

      .search-container {
        position: relative;
      }

      .search-input {
        width: 100%;
        padding: 12px 20px;
        border: 1px solid hsl(0, 0%, 40%);
        border-radius: 25px;
        font-family: "SoehneBuch", sans-serif;
        font-size: 16px;
        background: hsl(235, 7%, 25%);
        color: #fff;
        outline: none;
        transition: all 0.3s ease;
      }

      .search-input:focus {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
      }

      .search-input::placeholder {
        color: hsl(0, 0%, 60%);
      }

      .suggestions-container {
        position: absolute;
        width: 100%;
        background: hsl(235, 7%, 31%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,.2);
        margin-top: 8px;
        display: none;
        z-index: 100;
        overflow: hidden;
        border: 1px solid hsl(0, 0%, 40%);
      }

      .suggestions-container.visible {
        display: block;
      }

      .suggestion-item {
        padding: 12px 20px;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
      }

      .suggestion-item:hover, 
      .suggestion-item.highlighted {
        background-color: rgba(231, 76, 60, 0.1);
      }

      .suggestion-icon {
        margin-right: 10px;
        color: #e74c3c;
      }

      .loading {
        opacity: 0.7;
      }

      @media (max-width: 480px) {
        :host { padding: 0 15px; }
        .search-input { 
          padding: 10px 16px;
          font-size: 14px; 
        }
      }
    `
  }

  setupEventListeners () {
    const input = this.shadow.querySelector('.search-input')
    input.addEventListener('input', this.handleInput)
    input.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('click', this.handleClickOutside)
  }

  handleInput (e) {
    const value = e.target.value.trim()

    this.clearDebounce()
    this.cancelPendingRequest()

    if (!value) {
      this.hideSuggestions()
      return
    }

    if (value.length >= 3) {
      this.showLoading()
    }

    this.debounceTimeout = setTimeout(() => {
      this.fetchSuggestions(value)
    }, this.config.debounceTime)
  }

  handleKeyDown (e) {
    const container = this.getSuggestionsContainer()
    if (!container.classList.contains('visible')) return

    const items = container.querySelectorAll('.suggestion-item')
    if (items.length === 0) return

    const currentIndex = this.getHighlightedIndex(items)
    const keyHandlers = {
      ArrowDown: () => this.highlightNextItem(items, currentIndex),
      ArrowUp: () => this.highlightPreviousItem(items, currentIndex),
      Enter: () => this.selectHighlightedItem(items, currentIndex),
      Escape: () => this.hideSuggestions()
    }

    if (keyHandlers[e.key]) {
      e.preventDefault()
      keyHandlers[e.key]()
    }
  }

  getHighlightedIndex (items) {
    return Array.from(items).findIndex(item =>
      item.classList.contains('highlighted')
    )
  }

  highlightNextItem (items, currentIndex) {
    this.removeHighlight(items)
    const nextIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0
    this.highlightItem(items[nextIndex])
  }

  highlightPreviousItem (items, currentIndex) {
    this.removeHighlight(items)
    const prevIndex = (currentIndex <= 0) ? items.length - 1 : currentIndex - 1
    this.highlightItem(items[prevIndex])
  }

  removeHighlight (items) {
    items.forEach(item => item.classList.remove('highlighted'))
  }

  highlightItem (item) {
    item.classList.add('highlighted')
    item.scrollIntoView({ block: 'nearest' })
  }

  selectHighlightedItem (items, currentIndex) {
    if (currentIndex > -1) {
      this.selectSuggestion(items[currentIndex])
    }
  }

  handleClickOutside (e) {
    if (!this.shadow.contains(e.target)) {
      this.hideSuggestions()
    }
  }

  async fetchSuggestions (query) {
    if (query.length < 3) {
      this.clearSuggestions()
      return
    }

    const cached = this.getFromCache(query)
    if (cached) {
      this.suggestions = cached
      this.showSuggestions()
      return
    }

    try {
      const data = await this.makeApiRequest(query)
      this.suggestions = Array.isArray(data) ? data : []
      this.saveToCache(query, this.suggestions)
      this.showSuggestions()
    } catch (error) {
      this.handleFetchError(error)
    }
  }

  async makeApiRequest (query) {
    this.currentController = new AbortController()
    const timeoutId = setTimeout(() => {
      this.currentController?.abort()
    }, this.config.fetchTimeout)

    try {
      const response = await fetch(`/api/customer/search?query=${encodeURIComponent(query)}`, {
        signal: this.currentController.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } finally {
      this.currentController = null
    }
  }

  handleFetchError (error) {
    console.error('Error fetching suggestions:', error)
    this.clearSuggestions()

    const errorMessages = {
      AbortError: 'La búsqueda está tardando demasiado. Intenta con menos caracteres.',
      504: 'Servidor ocupado. Por favor, intenta nuevamente en un momento.'
    }

    const message = errorMessages[error.name] || errorMessages[error.message.includes('504')] ||
                   'Error temporal en la búsqueda. Intenta más tarde.'

    this.showError(message)
  }

  // Cache methods
  getFromCache (query) {
    const cached = this.searchCache.get(query)
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.data
    }
    return null
  }

  saveToCache (query, data) {
    this.searchCache.set(query, {
      data,
      timestamp: Date.now()
    })
    this.cleanupCache()
  }

  cleanupCache () {
    if (this.searchCache.size > 50) {
      const now = Date.now()
      for (const [key, value] of this.searchCache.entries()) {
        if (now - value.timestamp > this.config.cacheTimeout) {
          this.searchCache.delete(key)
        }
      }
    }
  }

  // UI methods
  showLoading () {
    this.showSuggestionItem('⏳', 'Buscando...', ['loading'])
  }

  showError (message) {
    this.showSuggestionItem('⚠️', message)
    setTimeout(() => this.hideSuggestions(), this.config.errorDisplayTime)
  }

  showSuggestionItem (icon, text, extraClasses = []) {
    const container = this.getSuggestionsContainer()
    container.innerHTML = ''
    container.appendChild(this.createSuggestionItem(icon, text, extraClasses))
    container.classList.add('visible')
  }

  showSuggestions () {
    const container = this.getSuggestionsContainer()
    container.innerHTML = ''

    if (this.suggestions.length === 0) {
      this.showNoResults()
    } else {
      this.showResults()
    }

    container.classList.add('visible')
  }

  showNoResults () {
    this.showSuggestionItem('❌', 'No se encontraron productos')
  }

  showResults () {
    const container = this.getSuggestionsContainer()
    this.suggestions.slice(0, this.config.maxSuggestions).forEach(product => {
      container.appendChild(this.createProductSuggestion(product))
    })
  }

  createProductSuggestion (product) {
    const item = this.createSuggestionItem('🔍', product.name)
    item.dataset.id = product.id
    item.tabIndex = 0

    item.addEventListener('click', () => this.selectSuggestion(item))
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        this.selectSuggestion(item)
      }
    })

    return item
  }

  createSuggestionItem (icon, text, extraClasses = []) {
    const item = document.createElement('div')
    item.classList.add('suggestion-item', ...extraClasses)
    item.innerHTML = /* html */`
      <div class="suggestion-icon">${icon}</div>
      <div class="suggestion-text">${this.escapeHtml(text)}</div>
    `
    return item
  }

  hideSuggestions () {
    this.getSuggestionsContainer().classList.remove('visible')
  }

  clearSuggestions () {
    this.suggestions = []
    this.hideSuggestions()
  }

  selectSuggestion (item) {
    const input = this.shadow.querySelector('.search-input')
    const productName = item.querySelector('.suggestion-text').textContent

    input.value = productName
    this.hideSuggestions()

    this.dispatchEvent(new CustomEvent('product-selected', {
      detail: {
        id: item.dataset.id,
        name: productName
      },
      bubbles: true,
      composed: true
    }))
  }

  // Utility methods
  getSuggestionsContainer () {
    return this.shadow.querySelector('.suggestions-container')
  }

  clearDebounce () {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout)
      this.debounceTimeout = null
    }
  }

  cancelPendingRequest () {
    if (this.currentController) {
      this.currentController.abort()
      this.currentController = null
    }
  }

  escapeHtml (text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

customElements.define('search-component', SearchComponent)
