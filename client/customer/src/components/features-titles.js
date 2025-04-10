class FeaturesTitles extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    this.data = [
      {
        title: 'Filtra',
      },
      {
        title: 'Automatiza',
      },
      {
        title: 'Ahorra',
      }
    ]
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
      }

      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .features-titles{
        align-items: center;
        background-color: hsl(200, 77%, 52%);
        display: flex;
        flex-direction: column;
        height: 175vh;
        justify-content: center;
        position: relative;
        width: 100%;

        @media (min-width: 1024px) {
          height: 200vh;
        }

        @media (min-width: 1280px) {
          height: 250vh;
        }
      }

      .features-titles ul li {
        color: hsl(0, 0%, 100%);
        font-size: 3rem;
        height: 100vh;
        margin-top: calc(-80vh + 1.1em);
        padding-top: 50vh;
        position: sticky;
        top: 0;
        transform: translateY(calc((var(--index) - var(--items)* .5)* 1.5em));

        @media (min-width: 768px) {
          font-size: 5rem;
        }
      }

      .features-titles ul li:first-child{
        margin-top: 0;
      }

      .features-titles-footer{
        background-color: hsl(240, 33%, 99%);
        bottom: 0;
        display: block;
        position: absolute;
        width: 100%;
      }

      .features-titles-footer-backgroud-waves svg{
        fill: hsl(200, 77%, 52%);
        width: 100%;
      }

      .features-titles-footer-background-color{
        background-color: hsl(240, 33%, 99%);
        height: 10rem;
      }
    </style>

    <section class="features-titles">
      <div class="features-titles-list">
        <ul style="--items: ${this.data.length}"></ul>
      </div>
      <div class="features-titles-footer">
        <div class="features-titles-footer-backgroud-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path d="M0,256L30,229.3C60,203,120,149,180,133.3C240,117,300,139,360,170.7C420,203,480,245,540,224C600,203,660,117,720,74.7C780,32,840,32,900,53.3C960,75,1020,117,1080,160C1140,203,1200,245,1260,266.7C1320,288,1380,288,1410,288L1440,288L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path></svg>
        </div>
      </div>
    </section>
    `

    this.data.forEach((featureTitle, index) => {
      const ul = this.shadow.querySelector('ul')
      const li = document.createElement('li')
      li.style.setProperty('--index', index)
      li.textContent = featureTitle.title
      ul.appendChild(li)
    })
  }
}

customElements.define('features-titles-component', FeaturesTitles)
