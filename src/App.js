import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './components/Products/Products'
import { Login } from './components/Login/Login';

function parseJwt(token) {
  try {
    const base64url = token.split('.')[1]
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16).slice(-2))
    }).join(''))
    console.log(jsonPayload)

    return JSON.parse(jsonPayload)
  } catch (err) {
    console.log(err)
    return false
  }
}

let tokenValid = (localStorage.getItem('token'));
console.log(tokenValid)

function App() {
  return (
    <>
      {tokenValid ? <Products /> : <Login />}
    </>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<Products></Products>}></Route>
    //   </Routes>
    // </BrowserRouter>
  );
}

export default App;
