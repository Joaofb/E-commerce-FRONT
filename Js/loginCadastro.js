/* ===== IMPLEMENTAÇÃO DE OPTION */
let elementSelectIdade = document.querySelector('#idade')

for (let index = 1; index <= 35; index++) {
  const elementOption = document.createElement('option')
  elementOption.value = String(index)
  elementOption.text = String(index)
  elementSelectIdade.append(elementOption)
}

const elementOption = document.createElement('option')
elementOption.value = 'mode_35'
elementOption.text = '+35'
elementSelectIdade.append(elementOption)

/* ===== FIM DE IMPLEMENTAÇÃO DE OPTION */
let modalLogin = document.querySelector('#modal_login')
let modalCadastro = document.querySelector('#modal_cadastro')
let authProjectContainer = document.querySelector('#auth_project')
let authProjectLabel = document.querySelector('#auth_project label')
let authProjectNomeUsuario = document.querySelector('#auth_project span')
let authProjectBtnSair = document.querySelector('#auth_project #sair_conta')
let authProjectBtnLoginCadastro = document.querySelector('#auth_project p')
const estiloModalLogin = window.getComputedStyle(modalLogin)

let senhaInput = document.querySelector('#auth_login #senha')
let emailInput = document.querySelector('#auth_login #email')

// cadastro
let inputsCadastro = document.querySelectorAll('#auth_cadastro input')
let selectGenero = document.querySelector('#auth_cadastro #genero')
let selectIdade = document.querySelector('#auth_cadastro #idade')

function mostrarSenha(qual_modal) {
  if (!!!qual_modal)
    return console.error('É necessário passar o parâmetro para a função: " mostrarSenha(qual_modal: string) "')

  let element = document.querySelector(`#auth_${qual_modal} #senha`)

  if (element.type === 'password')
    element.type = 'text'
  else
    element.type = 'password'
}

function abrirModal() {
  modalLogin.style.display = 'flex'
  document.body.style.overflow = 'hidden'
}

function fecharModais() {
  modalLogin.style.display = 'none'
  modalCadastro.style.display = 'none'
}

function closeModal(qual_modal) {
  if (!!!qual_modal)
    return console.error('É necessário passar o parâmetro para a função: " closeModal(qual_modal: string) "')

  switch (qual_modal) {
    case 'login':
      senhaInput.value = ''
      emailInput.value = ''
      modalLogin.style.display = 'none'
      document.body.style.overflow = 'scroll'
      break
    case 'cadastro':
      inputsCadastro.forEach(elementInput => elementInput.value = '')
      selectGenero.value = ''
      selectIdade.value = ''
      modalCadastro.style.display = 'none'
      document.body.style.overflow = 'scroll'
      break
    default:
      break
  }
}

function abrirModalDeNovaConta() {
  modalLogin.style.display = 'none'
  modalCadastro.style.display = 'flex'
}

function validateEmail(mail) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  if (regex.test(mail))
    return true

  alert('Por favor, digite um email válido!')
  localStorage.removeItem('email')
  return false
}

async function hashSenha(value) {
  if (!value) return console.error('Input inválido')

  try {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(36).padStart(2, '0')).join('')
  } catch (error) {
    console.error(error)
  }
}

function todosValoresSaoIguais(array) {
  return array === 1
}

function confirmarSenha(value) {
  return value === localStorage.getItem('senha')
}

function manipulaçãoDeAuth() {
  authProjectLabel.innerText = 'Olá, seja bem-vindo'
  authProjectBtnSair.classList.add('deslogar')
  authProjectBtnSair.innerText = 'Sair'
  authProjectNomeUsuario.classList.add('limite_de_caracteres')
  authProjectNomeUsuario.innerText = localStorage.getItem('nome_usuario')
  authProjectContainer.removeChild(authProjectBtnLoginCadastro)
}

document.querySelector('#form_login').addEventListener('submit', async (event) => {
  event.preventDefault()
  event.stopPropagation()
  let errorForm = false
  let errorCredenciais = false

  if (senhaInput.value.trim() != '') {
    let senhaDigitada = await hashSenha(senhaInput.value)

    if (senhaDigitada !== localStorage.getItem('senha'))
      errorCredenciais = true
  }

  let dataValueEmail = localStorage.getItem('email')
  if (emailInput.value.trim() != '' && validateEmail(emailInput.value)) {
    if (dataValueEmail !== emailInput.value)
      errorCredenciais = true
  }

  if (senhaInput.value.trim() == '' && emailInput.value.trim() == '') {
    errorForm = true
  }

  if (errorCredenciais) {
    alert('Erro ao tentar fazer login, por favor verifique suas credenciais e tente novamente!')
    return
  }

  if (errorForm) {
    alert('Todos os campos são obrigatórios!')
    return
  }

  if (!errorCredenciais) {
    localStorage.setItem('authCompleted', true)
    manipulaçãoDeAuth()
    fecharModais()
  }
})

function Cadastrando(event) {
  let errorForm = false

  inputsCadastro.forEach(async (element, index) => {
    let elementInput = element

    if (!elementInput) {
      localStorage.clear()
      errorForm = false
      return
    }

    switch (elementInput.id) {
      case 'nome':
        localStorage.setItem('nome_usuario', elementInput.value)
        break
      case 'email':
        if (validateEmail(elementInput.value)) {
          localStorage.setItem('email', elementInput.value)
          break;
        }
        break
      case 'senha':
        let senha = await hashSenha(elementInput.value)
        localStorage.setItem('senha', senha)
        break
      default:
        break
    }

    if (elementInput.value.trim() == '') {
      errorForm = true
      return
    }
  })

  localStorage.setItem('genero', selectGenero.value)
  localStorage.setItem('idade', selectIdade.value)

  if (errorForm) {
    localStorage.clear()
    alert('Todos os campos são obrigatórios!')
    return
  }

  if (!errorForm) {
    goBackLogin()
    return
  }
}

function finalizarNovoCadastro() {
  Cadastrando()
}

function goBackLogin() {
  modalLogin.style.display = 'flex'
  modalCadastro.style.display = 'none'
}

function deslogar() {
  localStorage.removeItem('authCompleted')
  document.location.reload()
}

window.onload = () => {
  if (Boolean(localStorage.getItem('authCompleted')))
    manipulaçãoDeAuth()
}