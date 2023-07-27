"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
const BASE_URL = 'https://e-comm-lilac.vercel.app';
export default function Home() {
  const [Product, setProduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [locCart, setLocCart] = useState(false)
  useEffect(() => {
    const fun =()=>{
       fetch('https://fakestoreapi.com/products').then(e=>e.json()).then((e)=>{
        setProduct(e.map(e=> ({...e,quan: 1, gst: 12, price: (e.price).toFixed(2)})))
        
        
      })
    }
    fun()
  }, [])
  
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <i className="bi bi-cart-check-fill px-2" onClick={()=>setLocCart(!locCart)}>{cart.length}</i>
        </div>
      </nav>
      {locCart && <Cart Product={Product} setCart={setCart} Cart={cart} />}
      {!locCart && <Hom Product={Product} setProduct={setProduct} setCart={setCart} cart={cart} />}
      {cart.length >0?
        !locCart?(<button onClick={()=>setLocCart(!locCart)} className="opacity-75 btn btn-primary col-sm-4 col-md-3 col-lg-2 shadow-lg rounded-end my-4 rounded-0 fixed-bottom">{'₹ '+(cart.reduce((a,b)=> a = a+b.price*b.quan, 0)).toFixed(2)}</button>):''
      :''}
    </>
  )
}


function Hom({Product, setCart, cart, setProduct}) {
  const up =(e)=>{
    setProduct(Product.map(x=>{
      if(x.id === e.id){
        x.quan++
      }
      return x
    }));
  }
  const down =(e)=>{
    setProduct(Product.map(x=>{
      if(x.id === e.id){
        if(x.quan === 1){
          x.quan = 1
          setCart(cart.filter(y=> y.id != x.id));
        }else{
          
        x.quan--
        }
      }
      return x
    }));
  }
  const add = (e)=>{
    setCart(cart.concat(e));
    console.log(e);
  }
  return (
    <div className='row m-0 g-2'>
      {Product.map(e=>(
      <div className="card mx-auto" style={{width: '18rem'}} key={e.id}>
        <img src={e.image} style={{width: '100%', height: '100px'}} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{e.title}</h5>
          <h6 className="card-text">{'₹ '+(e.price)}</h6>
          {cart.filter((x) =>x.id == e.id).length > 0?(
          <div className="input-group mb-3">
            <span className="input-group-text" onClick={()=>down(e)}>-</span>
            <p className={`text-center pt-1 col-8 disabled`}>{e.quan}</p>
            <span className="input-group-text" onClick={()=> up(e)} >+</span>
          </div>
          ):(
          <button className="btn btn-primary w-100" onClick={()=>add(e)}>Add</button>
          )}
          
        </div>
      </div>
      ))}
    </div>
  )
}


function Cart({Cart, setCart}) {
  const onlineCh = async ()=>{
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
		const data = await axios.post(BASE_URL+'/api/razorpay', {Razorpay: ((Cart.reduce((a,b)=> a = a+b.price*b.quan, 0))*100).toFixed(2)}).then((t) =>
			t.data
		)

		console.log(data)
		const options = {
			key: "rzp_test_AT7nTPD9PEhBSB",
			currency: data.currency,
			amount: data.id,
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: BASE_URL+'/vercel.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
        ch()
			},
			prefill: {
				name,
				email: 'sdfdsjfh2@ndsfdf.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open() 
  }
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  const ch =()=>{
    const uu = uuidv4();
    axios.post('/api/orderDetail/post',{
      "orderId": uu,
      "userId":"545",
      "amount":`${(Cart.reduce((a,b)=> a = a+b.price, 0))}`,
      "add":"hhjhhhjhj",
      "con":"2474872125"
    }).then((e)=>{
      if(e.data.success){
        axios.post(BASE_URL+'/api/orderdtail/',
          Cart.map(e=>
            ({
              orderId: uu,
              productId: e.id,
              quantity: e.quan,
              amount: (e.price)

            })
            )
        ).then(e=>{
          if(e.data.status){
            setCart([]);
          }
        }).catch((e)=>console.log( e))
      }
    }).catch((e)=>console.log( e))
  }
  return (
    <>
      {Cart.length > 0?(
      <div className="table-responsive">
        <table className="table overflow-auto">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">quan</th>
              <th scope="col">price</th>
              <th scope="col">IGST</th>
              <th scope="col">CGST</th>
              <th scope="col">BeforeTax </th>
              <th scope="col">Tot</th>
            </tr>
          </thead>
          <tbody>
            {Cart.map(e=>(
            <tr key={e.id}>
              <th scope="row">{e.id}</th>
              <td>{e.title}</td>
              <td>{e.quan}</td>
              <td>{(e.price)}</td>
              <td>{(((e.gst/2)/100)*e.price).toFixed(2)}</td>
              <td>{(((e.gst/2)/100)*e.price).toFixed(2)}</td>
              <td>{((e.price*e.quan)-(((e.gst)/100)*e.price)).toFixed(2)}</td>
              <td>{(e.price*e.quan)}</td>
            </tr>))}
            <tr>
              <th scope="row" onClick={(onlineCh)}>CheckOut</th>
              <td className="text-end">Total</td>
              <td>{(Cart.reduce((a,b)=> a = a+b.quan, 0))}</td>
              <td></td>
              <td>{(Cart.reduce((a,b)=> a = a+(((b.gst/2)/100)*b.price)*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+(((b.gst/2)/100)*b.price)*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+((b.price*b.quan)-(((b.gst)/100)*b.price))*b.quan, 0)).toFixed(2)}</td>
              <td>{(Cart.reduce((a,b)=> a = a+b.price*b.quan, 0)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ):(
        <h5 className="text-center text-danger">No Item</h5>
      )}
    </>
  )
}