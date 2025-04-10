class SubscriptionForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    this.data = {
      title: 'promote a new product or service',
      info: 'star your business today with a great and strong landing page mado to enchance the marketers workflow.',
      featured: 'subscripción por un año',
      start: 'Empieza a usarlo',
      instructions: 'Te enviaremos un correo electrónico con las instrucciones para que puedas comenzar a utilizar nuestro bot.',
      textButton: 'Subscribirme'
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
      }

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
      }

      h1, h2, h3, h4, h5, h6, p{
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      img{
        object-fit: cover;
        width: 100%;
      }

      .subscription-form{
        align-items: center;
        background-color: hsl(198, 100%, 85%);
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        min-height: 100vh;
        padding: 3rem 1rem;

        @media (min-width: 768px) {
          padding: 3rem 10%;
        }

        @media (min-width: 1280px) {
          grid-template-columns: 1fr 1fr;
          padding: 3rem 10%;
        }
      }

      .explanation {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @media (min-width: 1280px) {
          align-items: flex-start;
        }
      }

      .explanation-title h3 {
        font-size: 2rem;
        font-weight: 800;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 3rem;
        }

        @media (min-width: 1280px) {
          font-size: 3rem;
          line-height: 3rem;
          text-align: left;
        }
      }

      .explanation-info p{
        color: hsl(0, 0%, 50%);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 2rem;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 2rem;
        }

        @media (min-width: 1280px) {
          text-align: left;
        }
      }

      .explanation-featured{
        background-color: rgba(0, 0, 0, 0.5); 
        backdrop-filter: blur(10px);
        padding: 1rem;
        width: max-content;
      }

      .explanation-featured span{
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .form-container {
        background-color: white;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        width: 100%;
      }

      .info-area {
        display: flex;
      }

      .info-area-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .info-area-title h4 {
        font-size: 1.8rem;
        font-weight: 800;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .info-area-subtitle span {
        color: hsl(0, 0%, 50%);
        font-size: 1rem;
        font-weight: 600;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .info-area-icon svg {
        animation: top-bottom 2s infinite;
        width: 5rem;
        fill: hsl(0, 0%, 70%);
        text-align: center;
      }

      @keyframes top-bottom {
        0%, 100%, 20%, 50%, 80% {
          -webkit-transform: translateY(0);
          -ms-transform: translateY(0);
          transform: translateY(0);
        }

        40% {
          -webkit-transform: translateY(-8px);
          -ms-transform: translateY(-8px);
          transform: translateY(-8px);
        }
        60% {
          -webkit-transform: translateY(-4px);
          -ms-transform: translateY(-4px);
          transform: translateY(-4px);
        }
      }

      .form form{
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
      }

      .form-element-input input {
        border: 2px solid rgb(192, 192, 192);
        border-radius: 1.5rem;
        font-size: 1rem;
        outline: none;
        padding: 1rem;
        width: 100%;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .form-element-input input:hover {
        border-color: hsl(200, 77%, 52%);
      }

      .form-element-button button{
        background-color: hsl(200, 77%, 52%);
        border-radius: 1rem;
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1rem;
        width: 100%;

        @media (min-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .form-element-button button:hover{
        background-color: hsl(200, 77%, 42%);
      }
    </style>

    <section class="subscription-form">
      <div class="explanation">
        <div class="explanation-title">
          <h3>${this.data.title}</h3>
        </div>
        <div class="explanation-info">
          <p>${this.data.info}</p>
        </div>
        <div class="explanation-featured">
          <span>${this.data.featured}</span>
        </div>
      </div>
      <div class="form-container">
        <div class="info-area">
          <div class="info-area-text">
            <div class="info-area-title">
              <h4>${this.data.start}</h4>
            </div>
            <div class="info-area-subtitle">
              <span>${this.data.instructions}</span>
            </div>
          </div>
          <div class="info-area-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hand-pointing-down</title><path d="M9.9,21V11L6.7,12.69L6.5,12.72C6.19,12.72 5.93,12.6 5.74,12.4L5,11.63L9.9,7.43C10.16,7.16 10.5,7 10.9,7H17.4C18.17,7 18.9,7.7 18.9,8.5V12.86C18.9,13.47 18.55,14 18.05,14.2L13.11,16.4L11.9,16.53V21A1,1 0 0,1 10.9,22A1,1 0 0,1 9.9,21M18.9,5H10.9V2H18.9V5Z" /></svg>
          </div>
        </div>
        <div class="form">
          <form>
            <div class="form-element">
              <div class="form-element-input">
                <input type="text" placeholder="Dirección de correo">
              </div>
            </div>
            <div class="form-element-button">
              <button>${this.data.textButton}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
    `
  }
}

customElements.define('subscription-form-component', SubscriptionForm)
