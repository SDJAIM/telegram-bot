class Login extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' })
        this.data = {}
    }

    async connectedCallback() {
        console.log(window)
        await this.checkSignin()
        await this.render()
    }
    
    async checkSignin() {

        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/check-signin`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (result.ok) {
                const data = await result.json()
                window.location.href = data.redirection
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        this.shadow.innerHTML = /* html */`
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont,
                        'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
                        'Open Sans', 'Helvetica Neue', sans-serif;
                }

                .login-box {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 400px;
                    padding: 40px;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.5);
                    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
                    border-radius: 10px;
                }

                .login-box h2 {
                    margin: 0 0 30px;
                    color: #fff;
                    text-align: center;
                }

                .login-box .user-box {
                    position: relative;
                }

                .login-box .user-box input {
                    width: 100%;
                    padding: 10px 0;
                    font-size: 16px;
                    color: #fff;
                    margin-bottom: 30px;
                    border: none;
                    border-bottom: 1px solid #fff;
                    outline: none;
                    background: transparent;
                }

                .login-box .user-box label {
                    position: absolute;
                    top: 0;
                    left: 0;
                    padding: 10px 0;
                    font-size: 16px;
                    color: #fff;
                    pointer-events: none;
                    transition: 0.5s;
                }

                .login-box .user-box input:focus ~ label,
                .login-box .user-box input:valid ~ label {
                    top: -20px;
                    left: 0;
                    color: #03e9f4;
                    font-size: 12px;
                }

                .login-box form a {
                    position: relative;
                    display: inline-block;
                    padding: 10px 20px;
                    color: #03e9f4;
                    font-size: 16px;
                    text-decoration: none;
                    text-transform: uppercase;
                    overflow: hidden;
                    transition: 0.5s;
                    margin-top: 40px;
                    letter-spacing: 4px;
                }

                .login-box button {
                    margin-top: 20px;
                    padding: 10px 24px;
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                    border: none;
                    border-radius: 6px;
                    color: #111;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
                    transition: all 0.25s ease;
                }

                .login-box button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
                    filter: brightness(1.05);
                }

                .login-box button:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                }

                .login-box button:focus {
                    outline: none;
                }
                .bottom {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    justify-content: space-between; 
                    color: white;
                }
            </style>

            <div class="login-box">
                <h2>Login</h2>

                <form>
                    <div class="user-box">
                        <input type="email" name="email" required="">
                        <label>Email</label>
                    </div>

                    <div class="user-box">
                        <input type="password" name="password" required="">
                        <label>Password</label>
                    </div>
                    <div class="bottom">
                        <span>He olvidado la contraseña</span> 
                        <button type="submit">Acceder</button>
                    </div>
                </form>
            </div>
        `
        const form = this.shadow.querySelector('form')

        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            const formData = new FormData(form)
            const formDataJson = Object.fromEntries(formData.entries())

            try {
                const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataJson)
                })

                if (result.ok) {
                    const data = await result.json()
                    window.location.href = data.redirection
                } else {
                    const error = await result.json()
                    console.log(error.message)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
}

customElements.define('login-component', Login)
