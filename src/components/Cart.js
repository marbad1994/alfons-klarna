import React, { useEffect, useState, useCallback } from "react";
import withContext from "../withContext";
import { createOrder } from "../lambdas/order";
import { createSession } from '../lambdas/session';


// KLARNA API-ANVÄNDARNAMN
// K924982_6e547d5b83db

// KLARNA API-LÖSENORD
// 6EG4qOJmqp8w8PDX


const Cart = props => {
  const { cart, addToCart, removeFromCart, removeProductFromCart } = props.context;
  const cartKeys = Object.keys(cart || {});

 const [status, setStatus] = useState("cart");
 const [orderId, setOrderId] = useState("");

 const getTotalSum = (cart) => {
  let sum = 0
  for (let key in cart) {
    let price = cart[key].product.price;
    let amount = cart[key].amount;
    sum += (price*amount)
  }
  return sum;
}

const imageUrl = ( imageName ) =>  {
  return `${props.context.imagesLink}${imageName}.jpg`
}


const toOderLine = ({ name, price, serial, imageName, quantity }) => ({
  type: "physical",
  reference: serial,
  image_url: imageUrl(imageName),
  name,
  quantity: quantity,
  unit_price: price*100,
  tax_rate: 2500,
  total_amount: (quantity * price*100),
  total_discount_amount: 0,
  total_tax_amount: parseInt(((quantity * price) * 0.2)*100)
});


  useEffect(() => {
    document.getElementById("root").style.backgroundImage = null;
  })


  const pay = useCallback(async () => {
    setStatus("paying");
    

    const response = await createSession({
      order_lines: props.context.order.map(toOderLine)
    },
    props);

    const { client_token } = response.body;
    const Klarna = window.Klarna;
    Klarna.Payments.init({
      client_token
    });

    Klarna.Payments.load(
      {
        container: "#klarna-payments-container",
        payment_method_category: "pay_later",
        show_form: true
      },
      res => {
        console.log(res);
      }
    );
  }, [setStatus]);

  const authorize = useCallback(async () => {

    const Klarna = window.Klarna;
    Klarna.Payments.authorize(
      {
        payment_method_category: "pay_later",
        auto_finalize: true
      },
      async ({ authorization_token }) => {
        const response = await createOrder({
          authorization_token,
          order_lines: props.context.order.map(toOderLine)
        },
        props);
        setOrderId(response.body.order_id);
        setStatus("completed");
        props.context.clearCart()
      }
    );
  
  }, [setStatus, setOrderId]);
  
  return (
    <>
      <div className="container" style={{minHeight: 600}}>
        {cartKeys.length > 0 ? (
          <div className="column columns is-multiline">
            <div className="title has-text-grey-light" style={{marginTop: 20}}><h1>Kundvagn</h1></div>
              <table className="table is-striped is-fullwidth">
              <thead>
              <tr className="is-black">
                <th></th>
                <th>Produkt</th>
                <th>Antal</th>
                <th>Summa</th>
                <th>Ta bort</th>
               
              </tr>
            </thead>
            <tbody>
            {cartKeys.map(key => (
              <tr key={key} className="is-black">
                <td><img
                className="image is-64x64 is-rounded"
                src={`${props.context.imagesLink}${cart[key].product.imageName}.jpg`}
                alt={cart[key].product.imageName}
              /></td>
                <td>
                  {cart[key].product.name}
                </td>
                <td>
                <div className="buttons has-addons are-small">
                  <button className="button is-primary"  onClick={() =>
                  addToCart({id: cart[key].id, product: cart[key].product, amount: 1})
                }>+</button>
                  <button className="button is-primary is-outlined" style={{color: "white"}}>{cart[key].amount}</button>
                  <button className="button is-primary" onClick={() =>  removeFromCart({id: cart[key].id, product: cart[key].product, amount: 1})}>-</button>
                </div>
                </td>
                <td>
                  {cart[key].amount * cart[key].product.price} sek
                </td>
                <td>
            <span onClick={() => removeProductFromCart(key)} className="delete is-large"></span>
                </td>
              </tr>
            ))}

            <tr className="is-black">
              <td></td>
              <td>Total summa:</td>
              <td>{getTotalSum(cart)} sek</td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
              </table>

            <div className="column is-12 is-clearfix">
              <br />
              <div className="is-pulled-right">
                <button
                  onClick={props.context.clearCart}
                  className="button is-primary is-outlined "
                >
                  Rensa kundvagn
                </button>{" "}
                <button
                  className="button is-primary"
                  onClick={pay}
                >
                  Slutför köp
                </button>

            </div>
             {status === "paying" && (
        <>

            <div
              className="outer-klarna-box"
            >
              <div id="klarna-payments-container"></div>
          <button className="checkout-button" onClick={authorize} style={{marginTop: 20}}>
            Gå till betalning
          </button>
          </div>
        </>
      )}
              
            </div>

          </div>
        ) : (
          <>
          <div className="column">
            <div className="title has-text-grey-light"><h1>Kolla in vår kollektion</h1></div>
            {status === "completed" && <b style={{color: "#b5b5b5", fontSize: 20}}>Tack för din beställning<br/>Ditt ordernummer är: {orderId}</b>}
            <a href="https://greatsecret.se/products" style={{marginLeft: "auto", marginRight: "auto"}}  className="button is-primary is-outlined" >Kollektion</a>
            {/* <a onClick={() => props.history.push("products")} style={{marginLeft: "auto", marginRight: "auto"}}  className="button is-primary" >Kollektion</a> */}
          </div>
          </>
        )}
      </div>
    </>
  );
};


export default withContext(Cart);
