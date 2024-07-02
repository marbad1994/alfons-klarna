import React, {useEffect, useState} from "react";
import { Redirect } from "react-router-dom";
import withContext from "../withContext";
import EditProduct from "./EditProduct";


const Products = props => {
  
  const { products } = props.context;
  const [modalState, toggleModal] = useState(false);
  const [save, toggleSave] = useState(false);
  const [product, setProduct] = useState({});
  const showEditProduct = (currentProduct) => {
    setProduct(currentProduct)
    toggleModal(!modalState)
  }
  
  useEffect(() => {
    document.getElementById("root").style.backgroundImage = null;
    console.log(props)

  });
 
 
  return props.context.user ? (
   
    <>
      <div className="container">
        <div className="column columns is-multiline">
         

              <div className="column columns is-multiline">
              <table className="table is-striped is-fullwidth">
              <thead>
              <tr className="is-black">
                <th></th>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Remove</th>
               
              </tr>
            </thead>
            <tbody>
            { products.map((product, index) => (
              <tr key={index} className="is-black">
                <td><img
                className="image is-64x64 is-rounded"
                src={`/images/${product.imageName}.jpg`}
                alt={product.description}
              /></td>
                <td>
                  {product.name}
                </td>
                <td>
               {product.stock}
                </td>
                <td>
               {product.price}
                </td>
                <td>
                <button onClick={() => showEditProduct(product)} className="button is-primary is-outlined" style={{color: "white"}}>Edit</button>
                </td>
                <td>
                <button onClick={() => props.context.removeProduct(product._id)} className="button is-primary" style={{color: "white"}}>Remove</button>
                </td>
              </tr>
             )) }

           
            </tbody>
              </table>

           
            
          </div>

            
       
        </div>
        <Modal 
            closeModal={() => toggleModal(!modalState)} 
            modalState={modalState} 
            title="Edit Product"
            setClick={() => toggleSave(true)}
          >
            <EditProduct setClick={() => toggleSave(false)} save={save} context={props.context} product={product}/>
              
            </Modal>
      </div>
    </>
  ): (
    <Redirect to="/products" />
  );
};
const Modal = ({ children, closeModal, modalState, title, setClick }) => {
  if(!modalState) {
    return null;
  }
  
  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            {children}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary is-outlined" onClick={closeModal}>Close</button>
          <button className="button is-primary"onClick={setClick}>Save</button>
        </footer>
      </div>
    </div>
  );
}
export default withContext(Products);
