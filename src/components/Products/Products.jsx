import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { showAlert } from '../../utils/function';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Login } from '../Login/Login';

const Products = () => {
    const url = 'http://localhost:3001/api/v1/products';
    const [products, setProducts] = useState([])
    const [id, setId] = useState([])
    const [handle, setHandle] = useState([])
    const [title, setTitle] = useState([])
    const [description, setDescription] = useState([])
    const [sku, setSku] = useState([])
    const [grams, setGrams] = useState([])
    const [stock, setStock] = useState([])
    const [price, setPrice] = useState([])
    const [compare, setCompare] = useState([])
    const [barcode, setBarcode] = useState([])
    const [action, setAction] = useState([])

    const [password, setPassword] = useState([])
    const [newPassword, setNewPassword] = useState([])

    const [loginSuccesful, setLoginSuccesful] = useState(false)

    useEffect(() => {
        getProducts();
        let tokenValid = (localStorage.getItem('token'));
        if (tokenValid) {
            setLoginSuccesful(true);
        }
    })

    const getProducts = async () => {
        try {
            const token = localStorage.getItem('token')
            const resp = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            setProducts(resp.data);
        } catch (err) {
            console.log(err)
        }
    }

    const openModal = (option, id, handle, title, description, sku, grams, stock, price, compare, barcode) => {
        setId('');
        setHandle('');
        setTitle('');
        setDescription('');
        setSku('');
        setGrams('');
        setStock('');
        setPrice('');
        setCompare('');
        setBarcode('');
        if (option === 1) {
            setAction('Agregar Producto')
        } else {
            setAction('Editar Producto')
            setId(id)
            setHandle(handle)
            setTitle(title)
            setDescription(description)
            setSku(sku)
            setGrams(grams)
            setStock(stock)
            setPrice(price)
            setCompare(compare)
            setBarcode(barcode)

        }
        window.setTimeout(function () {
            document.getElementById('handle').focus();
        }, 500)
    }

    const validate = () => {
        var parameters;
        var method;
        if (handle.trim() === '') { }

        if (action === 'Agregar Producto') {
            parameters = { handle: handle, title: title, description: description, sku: sku, grams: grams, stock: stock, price: price, compare: compare, barcode: barcode }
            method = 'POST'
        } else {
            parameters = { handle: handle, title: title, description: description, sku: sku, grams: grams, stock: stock, price: price, compare: compare, barcode: barcode }
            method = 'PATCH'
        }
        send(method, parameters)
    }

    const send = async (method, parameters) => {
        const token = localStorage.getItem('token')
        if (method === 'POST') {
            await axios({
                method: method, url: 'http://localhost:3001/api/v1/products/', data: parameters, headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (resp) {
                setHandle('')
                setTitle('')
                setDescription('')
                setSku('')
                setGrams('')
                setStock('')
                setPrice('')
                setCompare('')
                setBarcode('')
                showAlert('El producto se ha creado', 'success')
            }).catch(function (err) {
                console.log(err)
                if (err.response.status === 401) {
                    showAlert('401 - Unauthorized', 'error')
                } else {
                    showAlert('Ha ocurrido un error')
                }
            })
        }
        if (method === 'PATCH') {
            await axios({ method: method, url: `http://localhost:3001/api/v1/products/${id}`, data: parameters }).then(function (resp) {
                showAlert('El producto se ha editado', 'success')
            }).catch(function (err) {
                showAlert('Ha ocurrido un error editando el producto', 'error')
            })
        }
    }

    const deleteProduct = (id) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: '¿Desea borrar el producto?',
            icon: 'question',
            text: 'No podrá volver',
            showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setId(id);
                await axios({ method: 'DELETE', url: `http://localhost:3001/api/v1/products/${id}` }).then(function (resp) {
                    showAlert('El producto se ha eliminado', 'success')
                }).catch(function (err) {
                    showAlert('Ha ocurrido un error borrando el producto', 'error')
                })
            }
        })

    }

    const logout = () => {
        setLoginSuccesful(false);
        localStorage.clear();
    }

    const updatePassword = async () => {
        let email = (localStorage.getItem('email'));
        if (email) {
            await axios({ method: 'PATCH', url: `http://localhost:3001/api/v1/auth/updatePassword`, data: { email, password, newPassword } }).then(function (resp) {
                showAlert('La contraseña se ha actualizado', 'info')
                setPassword('')
                setNewPassword('')
            }).catch(function (err) {
                console.log(err)
                if (err.response.data.status === 2)
                    showAlert('Contraseña Incorrecta. Debe ingresar su contraseña actual.', 'warning')
                else {
                    showAlert('Ha ocurrido un error', 'error')
                }
            })
        }
    }

    return (
        <>
            {loginSuccesful ?
                <div className='App'>
                    <div className='container-fluid'>
                        <div className='row mt-3'>
                            <div className='col-md-5 offset-md-5'>
                                <div className='d-grid mx-auto'>
                                    <button onClick={() => openModal(1)} className='btn btn-dark m-2' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                        <i className='fa-solid fa-circle-plus'></i>Agregar
                                    </button>
                                    <button data-bs-toggle='modal' data-bs-target='#update' className='btn btn-dark m-2'>
                                        <i className='fa-solid fa-circle-plus'></i>Cambiar contraseña
                                    </button>
                                    <button onClick={() => logout()} className='btn btn-dark m-2'>
                                        <i className='fa-solid fa-circle-plus'></i>Cerrar Sesion
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-12 col-lg-12 offset-0'>
                                <div className='table-responsive'>
                                    <table className='table table-bordered'>
                                        <thead>
                                            <tr><th>#</th><th>HANDLE</th><th>TITLE</th><th>DESCRIPTION</th><th>SKU</th><th>GRAMS</th><th>STOCK</th><th>PRICE</th><th>COMPARE</th><th>BARCODE</th></tr>
                                        </thead>
                                        <tbody className='table-group-divider'>
                                            {products.map((product, i) => (
                                                <tr key={product.id}>
                                                    <td>{(i + 1)}</td>
                                                    <td>{product.handle}</td>
                                                    <td>{product.title}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.sku}</td>
                                                    <td>{product.grams}</td>
                                                    <td>{product.stock}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.compare}</td>
                                                    <td>{product.barcode}</td>
                                                    <td>
                                                        <button onClick={() =>
                                                            openModal(2, product.id, product.handle, product.title, product.description, product.sku, product.grams, product.stock, product.price, product.compare, product.barcode)}
                                                            data-bs-toggle='modal' data-bs-target='#modalProducts' className='btn btn-warning'>
                                                            Editar
                                                        </button>
                                                        &nbsp;
                                                        <button onClick={() => deleteProduct(product.id)} className='btn btn-danger'>
                                                            X
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='modalProducts' className='modal fade' aria-hidden='true'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <label className='h5'>{action}</label>
                                    <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                                </div>
                                <div className='modal-body'>
                                    <input type='hidden' id='id'></input>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='handle' className='form-control' placeholder='Handle' value={handle}
                                            onChange={(e) => setHandle(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='title' className='form-control' placeholder='Title' value={title}
                                            onChange={(e) => setTitle(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='description' className='form-control' placeholder='Description' value={description}
                                            onChange={(e) => setDescription(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='sku' className='form-control' placeholder='Sku' value={sku}
                                            onChange={(e) => setSku(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='grams' className='form-control' placeholder='Grams' value={grams}
                                            onChange={(e) => setGrams(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='stock' className='form-control' placeholder='Stock' value={stock}
                                            onChange={(e) => setStock(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='price' className='form-control' placeholder='Price' value={price}
                                            onChange={(e) => setPrice(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='compare' className='form-control' placeholder='Compare' value={compare}
                                            onChange={(e) => setCompare(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                        <input type='text' id='barcode' className='form-control' placeholder='Barcode' value={barcode}
                                            onChange={(e) => setBarcode(e.target.value)}></input>
                                    </div>
                                    <div className='d-grid col-6 mx-auto'>
                                        <button onClick={() => validate()} className='btn btn-success'>
                                            <i className='fa-solid fa-floppy-disk'></i>Guardar
                                        </button>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actualizar contraseña  */}
                    <div id='update' className='modal fade' aria-hidden='true'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <label className='h5'>Actualizar contraseña</label>
                                    <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                                </div>
                                <div className='modal-body'>

                                    <div className='input-group mb-3'>
                                        <input type='text' id='passwordR' className='form-control' placeholder='Contraseña Actual' value={password}
                                            onChange={(e) => setPassword(e.target.value)}></input>
                                    </div>
                                    <div className='input-group mb-3'>
                                        <input type='text' id='newPassword' className='form-control' placeholder='Nueva Contraseña' value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}></input>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button onClick={() => updatePassword()} className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i>Actualizar
                                    </button>
                                    <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <Login />}
        </>
    )
}

export default Products