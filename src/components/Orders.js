import React, {useEffect} from "react";
import { Redirect } from "react-router-dom";
import withContext from "../withContext";

const Orders = props => {
  
  const { orders } = props.context;
let orderInfo = {}
const updateOrder = () => {
  props.context.updateOrder(orderInfo)
  orderInfo = {}
}
  
  useEffect(() => {
    document.getElementById("root").style.backgroundImage = null;

  });
  return props.context.user ? (
   
    <>
      <div className="container">
        <div className="column columns is-multiline">
         



              <div className="column columns is-multiline">
              <table className="table is-striped is-fullwidth">
              <thead>
              <tr className="is-black">
                <th>Email</th>
                <th>Mobile</th>
                <th>ID Number</th>
                <th>Shipped</th>
                <th>Remove</th>
               
              </tr>
            </thead>
            <tbody>
            {
            orders.map((order, index) => order.show && (
              <>
              <tr key={index} className="is-dark">
                <td>
                  {order.customer.email}
                </td>
                <td>
                {order.customer.mobile}
                </td>
                <td>
                {order.customer.idnumber}
                </td>
                <td>
                <label className="checkbox">
                  <input onChange={() => {orderInfo[order._id] = !orderInfo[order._id]}} name={order._id} type="checkbox" value={order.shipped}/>{" "}
                  Shipped
                </label>
                </td>
                <td>
                <button onClick={() => props.context.removeOrder(order._id)} className="button is-primary" style={{color: "white"}}>Remove</button>
                </td>
              </tr>
              <tr>
                <td  colspan={5}>
                <table className="table is-striped is-fullwidth">
              <thead>
              <tr className="is-black">
                <th></th>
              <th>Product</th>
                <th>Quantity</th>
                <th>Sum</th>
               
              </tr>
            </thead>
            <tbody>
              {Object.keys(order.order).map((item, index) => (
                <>
                <tr key={index} className="is-black">
                <td><img
                className="image is-64x64 is-rounded"
                src={`/images/${order.order[item].imageName}.jpg`}
                alt={item.item}
              /></td>
              <td>
              {order.order[item].item}
              </td>
              <td>
                {order.order[item].quantity}
              </td>
              <td>
                {order.order[item].price} sek
              </td>
              </tr>
              </>
              ))
            }
            

            <tr className="is-black">
              <td></td>
              <td>Total sum:</td>
              <td>{order.total} sek</td>
              <td></td>
              <td></td>
            </tr>

            </tbody>
            </table>
            </td>
              </tr>
              </>
            ) )}

           
            </tbody>
              </table>
              <button onClick={() => updateOrder()} className="button is-primary" style={{color: "white"}}>Save</button>


           
            
          </div>


{/* 
              // <orderItem
              //   order={order}
              //   key={index}
              //   addToCart={props.context.addToCart}
              // /> */}
            
       
        </div>
      </div>
    </>
  ): (
    <Redirect to="/products" />
  );
};

export default withContext(Orders);
