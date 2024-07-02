import React, { useEffect, useState } from "react";
import withContext from "../withContext";

const getTotalSum = (cart) => {
  let sum = 0
  for (let key in cart) {
    let price = cart[key].product.price;
    let amount = cart[key].amount;
    sum += (price*amount)
  }
  return sum;
}

const ToolTipCart = props => {

  const { cart, addToCart, removeProductFromCart, removeFromCart } = props.context;
  const cartKeys = Object.keys(cart || {});
  const [hidden, setStyle] = useState(true)

  useEffect(() => {
    if (hidden) {
      props.context.style = {display: 'none'}
    } else {
      props.context.style = {display: 'block', zIndex: 2, right: props.context.width*0.01}
    }
  }, [hidden]); 

  return (
    <>
    {cartKeys.length > 0 && 
      <div className="container" style={props.context.style}
                onMouseOut={e => {
                  setStyle(true)
                }}
                 onMouseLeave={e => {
                  setStyle(false);
                 }}>
        <div style={{backgroundColor: "#272A3F", borderRadius: 10, boxShadow: "1px 1px 3px 3px rgba(0, 0, 0, 0.5)", marginTop: 12}}>
        
          <div className="column columns is-multiline"> 
              <table className="table is-striped">
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
            <span onClick={() => removeProductFromCart(key)} className="delete"></span>
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
          
          </div>
        
        </div>
      </div>
       }
    </>
  );
};

export default withContext(ToolTipCart);
