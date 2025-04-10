class Hero extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = {}
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  loadData () {
    this.data = {
      title: 'Un bot de Telegram para buscar tus productos favoritos',
      description: 'Ahorra dinero perfeccionando y automatizando tus búsquedas gracias a nuestra IA.',
      buttonText: 'Comenzar'
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
      
      .hero{
        background-color: hsl(198, 100%, 85%);
        height: 100vh;
        max-height: 100vh;
        position: relative;

        @media (min-width: 1024px) {
          height: 125vh;
          max-height: 125vh;
        }

        @media (min-width: 1280px) {
          height: 120vh;
          max-height: 120vh;
        }
      }

      .hero-info{
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        padding: 2rem;
        position: absolute;
        top: 5%;
        width: 100%;

        @media (min-width: 768px) {
          gap: 4rem;
        }

        @media (min-width: 1024px) {
          gap: 3rem;
        }
      }

      .hero-title h1{
        font-size: 1.5rem;
        font-weight: 800;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 3rem;
        }
      }

      .hero-description p{
        color: hsl(0, 0%, 50%);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 2rem;
        text-align: center;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .hero-button button{
        background-color: hsl(200, 77%, 52%);
        border-radius: 1rem;
        color: hsl(0, 0%, 100%);
        font-size: 1.1rem;
        font-weight: 600;
        padding: 1rem 2rem;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .hero-button button:hover{
        background-color: hsl(200, 77%, 42%);
      }

      .plane{
        animation: paper-plane-scoping 2s alternate infinite;
        animation-timing-function: linear;
        bottom: 35%;
        left: 35%;
        position: absolute;
        width: 30%;
        z-index: 1005;

        @media (min-width: 768px) {
          bottom: 40%;
          left: 35%;
          width: 25%;
        }

        @media (min-width: 1024px) {
          bottom: 40%;
          left: 40%;
          width: 20%;
        }

        @media (min-width: 1280px) {
          bottom: 55%;
          left: 45%;
          width: 10%;
        }
      }

      .plane svg {
        animation: paper-plane-soaring 4s forwards infinite;
        animation-timing-function: ease-in-out;
        width: 100%;
      }

      @-webkit-keyframes paper-plane-scoping {
        0% {
          transform: translateY(0px);
        }

        100% {
          transform: translateY(100px);
        }
      }

      @-webkit-keyframes paper-plane-soaring {
        0% {
          transform: rotate(0deg);
        }
        40% {
          transform: rotate(15deg);
        }
        50% {
          transform: rotate(15deg);
        }
        60% {
          transform: rotate(-10deg);
        }
        70% {
          transform: rotate(-10deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }

      .clouds {
        bottom: 0;
        left: 0;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 45vh;

        @media (min-width: 1280px) {
          top: 35vh;
        }
      }

      .cloud {
        animation: cloud-movement 8s linear infinite forwards;
        fill: hsl(0, 0%, 100%);
        opacity: 1;
        position: absolute;
        right: 0;
        top: 20%;
      }

      .cloud.front {
        z-index: 9;
      }

      .cloud.background {
        z-index: 1;
      }

      .cloud.smaller {
        margin-right: 20vw;
        width: 10vw;
        margin-top: 5vh;
      }

      .cloud.small {
        margin-right: 10vw;
        width: 15vw;
      }

      .cloud.big {
        margin-top: 5vh;
        margin-right: 8vw;
        width: 40vw;
      }

      .cloud.massive {
        margin-top: 2vh;
        margin-right: 0;
        width: 50vw;
      }

      .slow {
        animation-duration: 9.2s;
      }

      .slower {
        animation-duration: 11.2s;
      }

      .slowest {
        animation-duration: 13.5s;
      }

      .super-slow {
        animation-duration: 20.5s;
      }

      @keyframes cloud-movement {
        0% {
          opacity: 0.1;
          transform: translateX(20vw);
        }
        10% {
          opacity: 0.7;
        }
        90% {
          opacity: 0;
        }
        100% {
          opacity: 0;
          transform: translateX(-50vw);
        }
      }

      .hero-image{
        bottom: 2%;
        left: 15%;
        position: absolute;
        width: 70%;
        z-index: 1001;

        @media (min-width: 768px) {
          bottom: 10%;
          left: 25%;
          width: 50%;
        }

        @media (min-width: 1024px) {
          bottom: 15%;
          left: 37%;
          width: 30%;
        }

        @media (min-width: 1280px) {
          bottom: 15%;
          left: 38%;
          width: 25%;
        }
      }

      .hero-image img{
        filter: drop-shadow(0 1rem 1rem hsl(200, 87%, 15%));
      }

      .hero-footer-background-waves,
      .hero-footer-background-color {
        margin: 0;
        padding: 0;
      }

      .hero-footer{
        bottom: 0;
        position: absolute;
        width: 100%;
        z-index: 10;
      }

      .hero-footer-background-waves svg{
        display: block; 
        fill: hsl(200, 77%, 52%);
        width: 100%;
      }

      .hero-footer-background-color{
        background-color: hsl(200, 77%, 52%);
        height: 10rem;

        @media (min-width: 1280px) {
          height: 1rem;
        }
      }
    </style>

    <section class="hero">
      <div class="hero-info">
        <div class="hero-title">
          <h1>${this.data.title}</h1>
        </div>
        <div class="hero-description">
          <p>
            ${this.data.description}
          </p>
        </div>
        <div class="hero-button">
          <button>${this.data.buttonText}</button>
        </div>
      </div>

      <div class="plane">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 1131.53 379.304" enable-background="new 0 0 1131.53 379.304"
        xml:space="preserve">
        <polygon fill="hsl(0, 0%, 85%)" points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223  "/>
        <polygon fill="hsl(60, 1%, 77%)" points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102   "/>
        </svg>
      </div>
        
      <div class="clouds">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 762 331" class="cloud big front slowest">
            <path d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
            c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
            C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
            S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"/>
        </svg>

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 762 331" class="cloud background smaller">
            <path d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
            c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
            C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
            S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"/>
        </svg>

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 762 331" class="cloud small slow">
            <path d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
            c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
            C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
            S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"/>
        </svg>

        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 762 331" class="cloud massive super-slow">
            <path d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
            c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
            C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
            S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"/>
        </svg>
      </div>
        
      <div class="hero-image">
        <picture>
          <source srcset="./images/hero.webp" media="(min-width: 1920px)">
          <source srcset="./images/hero.webp" media="(min-width: 1024px)">
          <source srcset="./images/hero.webp" media="(min-width: 768px)">
          <source srcset="./images/hero.webp" media="(min-width: 480px)">
          <img src="./images/hero.webp" alt="Imagen de prueba de Picsum">
        </picture>
      </div>

      <div class="hero-footer">
        <div class="hero-footer-background-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path d="M0,64L34.3,101.3C68.6,139,137,213,206,234.7C274.3,256,343,224,411,192C480,160,549,128,617,101.3C685.7,75,754,53,823,58.7C891.4,64,960,96,1029,122.7C1097.1,149,1166,171,1234,165.3C1302.9,160,1371,128,1406,112L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
          </svg>
        </div>
        <div class="hero-footer-background-color"></div>
      </div> 
    </section>
    `
  }
}

customElements.define('hero-component', Hero)
