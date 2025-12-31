import { useState } from 'react'
import './style.css'

import { auth } from '../../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
/* import { sendPasswordResetEmail } from "firebase/auth"; */


// Importe seus ícones SVG aqui...
import IconKeyhole from '../../assets/keyhole.svg?react'
import IconEmail from '../../assets/envelope.svg?react'
import IconLock from '../../assets/lock.svg?react'
import IconUser from '../../assets/user.svg?react'
import IconWarning from '../../assets/warning.svg?react'
import IconCheck from '../../assets/checkCircle.svg?react'
import IconX from '../../assets/xCircle.svg?react'
import IconWarningCircle from '../../assets/warningCircle.svg?react'

const passwordRequirements = [
  { id: 1, requirement: 'Pelo menos 8 caracteres' },
  { id: 2, requirement: 'Pelo menos uma letra maiúscula' },
  { id: 5, requirement: 'Um número ou símbolo (@, #, $)' },
]

function Home() {

  //Estados para armazenar os dados do usuario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //Estados para controlar o fluxo do formulario
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    email: '',
    password: '',
    general: '',
  })

  //Função para alternar entre tela de login e tela de cadastro e limpar os campos
  const toggleView = (e) => {
    e.preventDefault()

    setName('')
    setEmail('')
    setPassword('')
    setError({ email: '', password: '', general: '' })
    setIsRegistering(!isRegistering)
  }


  //Função para verificar requisitos de senha
  const checkPasswordRequirements = (id) => {
    switch (id) {
      case 1: return password.length >= 8
      case 2: return (/[A-Z]/.test(password))
      case 5: return (/[0-9@#$]/.test(password))
      default: return false
    }
  }

  const isPasswordStrong = passwordRequirements.every(item => checkPasswordRequirements(item.id))

  //Função para verificar requisitos de senha
  const getRequirementStatus = (isMet) => {
    if (password.length === 0) return { icon: <IconWarningCircle />, class: 'status-empty' };
    if (isMet) return { icon: <IconCheck />, class: 'status-met' };
    return { icon: <IconX />, class: 'status-not-met' };
  }

  const handleAuth = async (e) => {
    e.preventDefault()

    setError({ email: '', password: '', general: '' });

    if (isRegistering && !isPasswordStrong) {
      setError(({ ...error, password: 'Ops! Sua senha ainda não atende a todos os requisitos de segurança.' }))
      return
    }

    setIsLoading(true)


    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name })
        alert('Conta criada com sucesso!')
        setIsRegistering(false);

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        alert('Login realizado com sucesso!')
      }
    }

    //Tratamento de erros do firebase
    catch (error) {
      console.log(error.code)

      let newErrors = { email: '', password: '', general: '' }

      if (error.code === 'auth/invalid-email' || error.code === 'auth/invalid-credential') {
        newErrors.general = 'Email ou senha inválidos.'
      } else if (error.code === 'auth/too-many-requests') {
        newErrors.general = 'Muitas tentativas. Tente novamente mais tarde.'
      } else {
        newErrors.general = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      }

      setError(newErrors)
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
        <h1>{isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta!'}</h1>
        <p className='text-tittle'>{isRegistering ? 'Crie sua conta para acessar o painel.' : 'Entre com as suas credenciais para acessar o painel.'}</p>
      </div>


      <form onSubmit={handleAuth}>

        {/* Bloco de Nome */}
        {isRegistering && (
          <div className='input-name-group'>
            <label htmlFor="name">Nome</label>
            <div className="input-icon-group">
              <IconUser width={32} height={32} />
              <input id="name"
                name='name'
                type="text"
                placeholder='seu nome'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
            </div>
          </div>
        )}


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
                setError({ ...error, email: '', general: '' });
              }}
              required />
          </div>
        </div>

        {/* Bloco de Senha */}
        <div className='box-password'>
          <div className='input-password-group'>
            <div className='input-label-group'>
              <label htmlFor="password">Senha</label>
              {!isRegistering && <a href="#">Esqueceu a senha?</a>}
            </div>
            <div className={`input-icon-group ${error.password ? 'error-border' : ''}`}>
              <IconLock width={32} height={32} />
              <input id="password"
                name='password'
                type="password"
                placeholder='••••••••'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError({ ...error, password: '', general: '' });
                }}
                required />
            </div>
          </div>

          {/* Bloco de requisitos de senhas */}
          {isRegistering && (
            <div className="password-requirements-list">
              {passwordRequirements.map((item) => {
                const isMet = checkPasswordRequirements(item.id)

                const status = getRequirementStatus(isMet)

                return (
                  <div key={item.id} className={`requirement-item ${status.class}`}>
                    <span className='requirement-icon'>{status.icon}</span>
                    <p className='requirement-text'>{item.requirement}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>


        {/* Feedback Error */}
        {(error.email || error.password || error.general) && (
          <span className='feedback-error'>
            <IconWarning width={32} height={32} />
            <p>
              {error.email || error.password || error.general}
            </p>
          </span>
        )}


        <button className='button-login' type="submit"
          disabled={isLoading}>

          {isLoading ? 'Carregando...' : (isRegistering ? 'Criar conta' : 'Entrar')}
        </button>

        <div className='login-footer'>
          <p className='text-footer'>
            {isRegistering ? 'Já tem uma conta? ' : 'Não tem uma conta? '}

            <a href="#" onClick={toggleView}>{isRegistering ? 'Entrar' : 'Cadastre-se'}</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Home
