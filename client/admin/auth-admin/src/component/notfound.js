class NotFound extends HTMLElement
{
  constructor ()
  {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback ()
  {
    await this.loadData()
    await this.render()
  }

  loadData ()
  {
    this.data =
    {
      title: '404',
      svg: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;"
        xml:space="preserve">
        <rect x="0" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0s" dur="0.6s"
            repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0s" dur="0.6s"
            repeatCount="indefinite" />
        </rect>
        <rect x="10" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.15s" dur="0.6s"
            repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.15s" dur="0.6s"
            repeatCount="indefinite" />
        </rect>
        <rect x="20" y="13" width="4" height="5" fill="#333">
          <animate attributeName="height" attributeType="XML" values="5;21;5" begin="0.3s" dur="0.6s"
            repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="13; 5; 13" begin="0.3s" dur="0.6s"
            repeatCount="indefinite" />
        </rect>
      </svg>`,
      errorTitle: 'THE PAGE',
      cause: 'WAS NOT FOUND',
      button: 'RETURN TO HOME',
      buttonLink: `${import.meta.env.VITE_BASE_URL}`
    }
  }

  render ()
  {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        font-family: "Roboto", sans-serif;
        padding: 0;
        margin: 0;
        color: white;
      }

      .errorPage {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: #33CC99;
      }

      .code404 {
        font-size: 10rem;
      }

      .divider hr {
        border: 2px solid white;
        width: 25rem;
      }

      .errorTitle {
        font-size: 3rem;
      }

      .cause {
        font-size: 1.5rem;
      }

      .return button {
        font-family: "Roboto", sans-serif;
        background-color: white;
        color: #33cc99;
        font-size: 2rem;
        border-color: white;
        cursor: pointer;
        margin-top: 1rem;
        padding: 1rem 0.5rem;
      }

      .loader {
        margin: 0 0 2em;
        height: 100px;
        width: 20%;
        text-align: center;
        padding: 1em;
        margin: 0 auto 1em;
        display: inline-block;
        vertical-align: top;
      }
      .loader svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      svg path,
      svg rect {
        fill: #ffffff;
      }
    </style>

    <section class="errorPage">
      <div class="code404">
        <h1>${this.data.title}</h1>
      </div>
      <!-- 6 -->
      <div class="loader loader">
        <svg>${this.data.svg}</svg>
      </div>
      <div class="divider">
        <hr>
      </div>
      <div class="errorTitle">
        <h2>${this.data.errorTitle}</h2>
      </div>
      <div class="cause">
        <h3>${this.data.cause}</h3>
      </div>
      <div class="return">
        <a href="${this.data.buttonLink}"><button>${this.data.button}</button></a>
      </div>
    </section>
    `
  }
}

customElements.define('not-found-component', NotFound)
