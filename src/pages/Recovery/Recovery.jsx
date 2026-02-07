import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../../services/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import './Recovery.css'

// Importe seus ícones SVG aqui...
import IconKeyhole from '../../assets/keyhole.svg?react'
import IconEmail from '../../assets/envelope.svg?react'
import IconWarning from '../../assets/warning.svg?react'

function Recovery() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            await sendPasswordResetEmail(auth, email)
            toast.success('Se este e-mail estiver cadastrado, você receberá as instruções em instantes.')
            setTimeout(() => {
                navigate('/')
            }, 4000)
        }

        //Tratamento de erros do firebase
        catch (err) {
            console.log(err.code)

            if (err.code === 'auth/user-not-found') {
                setError('Email não encontrado.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Email inválido.')
            } else {
                setError('Ocorreu um erro inesperado. Tente novamente mais tarde.')
            }
        }

        finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='container'>

            {/* Bloco de Logo */}
            <div className='div-logo'>
                <IconKeyhole width={40} height={40} />
            </div>

            {/* Bloco de Titulo */}
            <div className='title-group'>
                <h1>Recuperar acesso</h1>
                <p className='text-tittle'>Insira seu e-mail da sua conta para receber as instruções de redefinição.</p>
            </div>

            <form onSubmit={handleResetPassword}>
                {/* Bloco de Email */}
                <div className='input-email-group'>
                    <label htmlFor="email">E-mail</label>
                    <div className="input-icon-group">
                        <IconEmail width={32} height={32} />
                        <input id="email"
                            name='email'
                            type="email"
                            placeholder='seu@email.com'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            required />
                    </div>
                </div>

                {/* Feedback Error */}
                {error && (
                    <span className='feedback-error'>
                        <IconWarning width={32} height={32} />
                        <p>
                            {error}
                        </p>
                    </span>
                )}

                {/* Botão de Login */}
                <button className='button' type="submit" disabled={isLoading}>
                    Enviar e-mail
                </button>

                <div className='login-footer'>
                    <p className='text-footer'>
                        Lembrou da senha?

                        <Link to="/"> Entrar</Link>
                    </p>
                </div>
            </form>

        </div>
    )
}


export default Recovery;
