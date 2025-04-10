class Cards extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  async loadData () {
    this.data = {
      title: 'Fácil de usar',
      description: 'Tan simple como decir qué productos buscas, las características que te interesan y cuanto estás dispuesto a pagas. Nuestro bot se encargará de buscarlo por ti y te notificará cuando encuentre algo que se ajuste a tus preferencias.',
      images: {
        xs: './images/airpods/go_airpods__ed69m4vdask2_large.png',
        sm: './images/airpods/go_airpods__ed69m4vdask2_large.png',
        md: './images/airpods/go_airpods__ed69m4vdask2_large.png',
        lg: './images/airpods/go_airpods__ed69m4vdask2_large.png'
      },
      cards: [
        {
          title: 'Siri, text Rigo, "I\'m on my way"',
          color: 'white',
          images: {
            xs: './images/text/go_iphone__rgcqxe88k6y6_small.png',
            sm: './images/text/go_iphone__rgcqxe88k6y6_small.png',
            md: './images/text/go_iphone__rgcqxe88k6y6_small.png',
            lg: './images/text/go_iphone__rgcqxe88k6y6_small.png'
          }
        },
        {
          title: 'Siri, remind me to water plants when I get home',
          color: 'black',
          images: {
            xs: './images/remind/go_tile_1__c3xn44p0q22q_large.png',
            sm: './images/remind/go_tile_1__c3xn44p0q22q_large.png',
            md: './images/remind/go_tile_1__c3xn44p0q22q_large.png',
            lg: './images/remind/go_tile_1__c3xn44p0q22q_large.png'
          }
        },
        {
          title: 'Siri, text Rigo, "I\'m on my way"',
          color: 'white',
          images: {
            xs: './images/helpful/go_tile_2__r3t0enbq5lea_large.jpg',
            sm: './images/helpful/go_tile_2__r3t0enbq5lea_large.jpg',
            md: './images/helpful/go_tile_2__r3t0enbq5lea_large.jpg',
            lg: './images/helpful/go_tile_2__r3t0enbq5lea_large.jpg'
          }
        }
      ]
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      *{
        box-sizing: border-box;
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

      .cards{
        align-items: center;
        background: linear-gradient(hsl(240, 33%, 99%), hsl(334, 60%, 83%), hsl(215, 58%, 34%));
        border-bottom-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem;

        @media (min-width: 768px) {
          padding: 2rem 10%;
        }

        @media (min-width: 1280px) {
          padding: 2rem 20%;
        }
      }

      .cards-info{
        display: flex;
        flex-direction: column;
        gap: 5rem;
        padding-bottom: 5rem;

        @media (min-width: 1024px) {
          gap: 7rem;
        }

        @media (min-width: 1280px) {
          gap: 3rem;
        }

        @media (min-width: 3000px) {
          gap: 15rem;
        }
      }

      .cards-title{
        align-items: center;
        display: flex;
        position: relative;

        @media (min-width: 1280px) {
          width: 80%;
        }
      }

      .cards-title-gradient h2{
        background: linear-gradient(270deg,  hsl(331, 52%, 70%), hsl(219, 50%, 36%));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-size: 5rem;
        font-weight: 700;
        
        @media (min-width: 768px) {
          font-size: 10rem;
          line-height: 11rem;
        }

        @media (min-width: 1280px) {
          font-size: 10rem;
          line-height: 11rem;
        }
      }

      .cards-image{
        position: absolute;
        left: 55%; 
        top: 50%;
        width: 40%; 

        @media (min-width: 768px) {
          left: 60%;
          width: 30%;
        }

        @media (min-width: 1024px) {
          left: 50%;
          width: 30%;
        }

        @media (min-width: 1280px) {
          left: 70%;
          top: 30%;
          width: 30%;
        }

        @media (min-width: 3000px) {
          left: 60%;
          top: 30%;
          width: 20%;
        }
      }

      .cards-description p{
        color: hsl(240, 2%, 55%);
        font-size: 1.2rem;

        @media (min-width: 768px) {
          font-size: 2rem;
        }
      }

      .cards-list{
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .card{
        border-radius: 2rem;
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        padding: 2.5rem 2.5rem 0 2.5rem;

        @media (min-width: 1024px) {
          grid-template-columns: 1fr 1fr;
        }

        @media (min-width: 1280px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      .card.white{
        background: hsl(0, 0%, 100%);
      }

      .card.black{
        background: linear-gradient(hsl(209, 54%, 22%), hsl(240, 47%, 9%));
        padding: 2.5rem;
      }

      .card-title h4{
        font-size: 2rem;
        font-weight: 700;
        line-height: 2rem;

        @media (min-width: 768px) {
          font-size: 3rem;
          line-height: 3rem;
        }
      }

      .card.white .card-title h4 span{
        -webkit-background-clip: text;
        background: linear-gradient(270deg,  hsl(331, 52%, 70%), hsl(219, 50%, 36%));
        background-clip: text;
        color: transparent;
      }

      .card.black .card-title h4{
        color: hsl(0, 0%, 100%);
      }

      .card.black .card-title h4 span{
        -webkit-background-clip: text;
        background: linear-gradient(270deg,  hsl(334, 98%, 82%), hsl(312, 53%, 68%));
        background-clip: text;
        color: transparent;
      }

      .card-image img{
        display: block;
      }
    </style>

    <section class="cards">
      <div class="cards-info">
        <div class="cards-title">
          <div class="cards-title-gradient">
            <h2>${this.data.title}</h2>
          </div>
          <div class="cards-image">
            <picture>
              <source srcset="${this.data.images.lg}" media="(min-width: 1920px)">
              <source srcset="${this.data.images.md}" media="(min-width: 1024px)">
              <source srcset="${this.data.images.sm}" media="(min-width: 768px)">
              <source srcset="${this.data.images.xs}" media="(min-width: 480px)">
              <img src="${this.data.images.xs}" alt="Imagen de prueba de Picsum">
            </picture>
          </div>
        </div>
        <div class="cards-description">
          <p>
            ${this.data.description}
          </p>
        </div>
      </div>
      <div class="cards-list"></div>
    </section>
    `

    this.data.cards.forEach(card => {
      const cardsList = this.shadow.querySelector('.cards-list')
      const cardElement = document.createElement('div')
      cardElement.classList.add('card', card.color)
      cardsList.appendChild(cardElement)

      const cardTitle = document.createElement('div')
      cardTitle.classList.add('card-title')
      cardElement.appendChild(cardTitle)

      const cardTitleH4 = document.createElement('h4')
      cardTitleH4.textContent = card.title
      cardTitle.appendChild(cardTitleH4)

      const cardImage = document.createElement('div')
      cardImage.classList.add('card-image')
      cardElement.appendChild(cardImage)

      const picture = document.createElement('picture')
      cardImage.appendChild(picture)

      const sourceLg = document.createElement('source')
      sourceLg.srcset = card.images.lg
      sourceLg.media = '(min-width: 1920px)'
      picture.appendChild(sourceLg)

      const sourceMd = document.createElement('source')
      sourceMd.srcset = card.images.md
      sourceMd.media = '(min-width: 1024px)'
      picture.appendChild(sourceMd)

      const sourceSm = document.createElement('source')
      sourceSm.srcset = card.images.sm
      sourceSm.media = '(min-width: 768px)'
      picture.appendChild(sourceSm)

      const sourceXs = document.createElement('source')
      sourceXs.srcset = card.images.xs
      sourceXs.media = '(min-width: 480px)'
      picture.appendChild(sourceXs)

      const img = document.createElement('img')
      img.src = card.images.xs
      img.alt = 'Imagen de prueba de Picsum'
      picture.appendChild(img)
    })
  }
}

customElements.define('cards-component', Cards)
