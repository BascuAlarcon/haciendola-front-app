import React, { useState } from 'react'
import Products from '../Products/Products'
import { showAlert } from '../../utils/function'
import axios from 'axios'

export const Login = () => {

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loginSuccesful, setLoginSuccesful] = useState(false)
    const [validate, setValidate] = useState(false)

    const [emailR, setEmailR] = useState([])
    const [passwordR, setPasswordR] = useState([])

    const [correo, setCorreo] = useState([])
    const [pass, setPass] = useState([])

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            showAlert('Credenciales incorrectas', 'warning')
        }
        const data = { email, password }
        fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(resp => resp.json())
            .then(result => {
                if (result.token) {
                    localStorage.setItem('token', result.token)
                    localStorage.setItem('email', result.email)
                    setLoginSuccesful(true)
                } else {
                    setLoginSuccesful(false)
                    showAlert('credenciales incorrectas', 'warning')
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const handleRegister = (e) => {
        e.preventDefault();
    }

    const registerAccount = () => {
        const data = { email: emailR, password: passwordR }
        fetch('http://localhost:3001/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(resp => resp.json())
            .then(result => {
                if (result.id) {
                    showAlert('La cuenta ha sido creada', 'success')
                    setEmailR('')
                    setPasswordR('')
                } else {
                    showAlert('El correo ya existe', 'error')
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const prevDef = (e) => {
        e.preventDefault()
    }

    const recoverPassword = async () => {
        try {
            await axios({ method: 'PATCH', url: `http://localhost:3001/api/v1/auth/recoverPassword`, data: { email: correo, password: pass } }).then(function (resp) {
                showAlert('La contraseña se ha actualizado', 'info')
                setPass('')
                setCorreo('')
            }).catch(function (err) {
                showAlert('Ha ocurrido un error', 'error')
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {loginSuccesful ? <Products /> :

                <div className="row">
                    <div className="col">
                        <div className='login-container'>
                            <form action="" className='login-form'>
                                <label htmlFor="">Email</label>
                                <input onChange={(event) => { setEmail(event.target.value) }} id="email" name="email" type="text" />
                                <label htmlFor="">Password</label>
                                <input onChange={(event) => { setPassword(event.target.value) }} id="password" name="password" type="password" />
                                <button className='m-1 btn btn-success' type='submit' onClick={handleLogin}>Login</button>
                                <button data-bs-toggle='modal' data-bs-target='#modalRecover' className='m-1 btn btn-warning' type='submit' onClick={prevDef}>Recuperar Contraseña</button>
                                <button data-bs-toggle='modal' data-bs-target='#modalRegister' className='m-1 btn btn-primary' onClick={handleRegister}>Crear Cuenta</button>
                            </form>
                        </div>
                    </div>
                    {/* Recuperar Contraseña */}

                    {/* Crear cuenta  */}
                    <div id='modalRegister' className='modal fade' aria-hidden='true'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <label className='h5'>Crear cuenta</label>
                                    <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                                </div>
                                <div className='modal-body'>
                                    <input type='hidden' id='id'></input>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='emailR' className='form-control' placeholder='Email' value={emailR}
                                            onChange={(e) => setEmailR(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='passwordR' className='form-control' placeholder='Password' value={passwordR}
                                            onChange={(e) => setPasswordR(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button onClick={() => registerAccount()} className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i>Crear
                                    </button>
                                    <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='modalRecover' className='modal fade' aria-hidden='true'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <label className='h5'>Recuperar contraseña</label>
                                    <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                                </div>
                                <div className='modal-body'>
                                    <input type='hidden' id='id'></input>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='correo' className='form-control' placeholder='Ingrese su Correo' value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='pass' className='form-control' placeholder='Ingrese su nueva contraseña' value={pass}
                                            onChange={(e) => setPass(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button onClick={() => recoverPassword()} className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i>Guardar nueva contraseña
                                    </button>
                                    <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

