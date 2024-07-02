import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../App.css';

const BuyButton = props => {
  const { product, isSmall, addToCart } = props;
  let classes = "button is-primary is-pulled-right"
  if (isSmall) {
    classes += " is-small is-outlined"
  }
  if (product.stock > 0) {
    return(
    <button
    className={classes}
    onClick={() =>
      addToCart({
        id: product.name,
        product,
        amount: 1
      })
    }
  >
    Köp nu
  </button>
)
  } else {
    return (
      <button style={{display: "none"}}/>
    )
  }
}
const Description = props => {
  const [overflow, setOverflow] = useState("hidden");
  const { product } = props;

    return (
      <div style={{ minHeight: 200, overflow: overflow}}>
      <b style={{ textTransform: "capitalize" }}>
      {product.name}
    </b>
    <div ><ul>
    {product.description.map(function(item, i){
    if (overflow === "hidden"){
    if (i < 5){
    return <li key={i}><p>{item}</p></li>}
    else if (i < 6 && product.description.length > 6) {
      return <li onClick={() => setOverflow("visible")} key={i}><p>...</p></li>
    }else if (i < 6 && product.description.length === 6) {
      return <li key={i}><p>{item}</p></li>
    }
  } else {
      return <li onClick={() => setOverflow("hidden")} key={i}><p>{item}</p></li>
    }
    })}

  
    </ul></div>
    </div>

  )
}


const ProductItem = props => {  
  const { nameToUrl, product, imagesLink, history, search, foundProduct } = props;
  const urlName = nameToUrl(product.name)

  let modalInitState = false
  if (foundProduct && search.startsWith(`?product=${urlName}`)) {
    modalInitState = true
  }

  const [modalState, toggleModal] = useState(modalInitState);


  const pushProduct = () => {
    history.push(`/products?product=${urlName}`)
    toggleModal(true)
  }

  const pushProducts = () => {
    history.push("/products")
    toggleModal(false)
  }

  useEffect(() => {
    if (search.startsWith(`?product=${urlName}`)) {
      pushProduct()
    } else {
      if (!modalState && !foundProduct){
      pushProducts()
    }}
  }, [history.location.pathname])

  return (
      <div className="box" style={{height: 274}}>
        <div className="media">
          <div className="media-left">
            <figure className="image is-300">
              <img
              onClick={() => {pushProduct()}}
              className="is-rounded"
                src={`${imagesLink}${product.imageName}.jpg`}
                alt={product.description}
              />
            </figure>
            <div style={{marginTop: 10, display: "flex"}}>
            <span style={{marginRight: 60}} className="tag is-small is-primary">{product.price} sek</span>
            {product.stock > 0 ? (
              <div className="icon-text">
              <span className="icon has-text-success">
              <FontAwesomeIcon icon={faCheck}/>

              </span>
              <span>I lager</span>
            </div>
            ): (
              <div className="icon-text">
              <span className="icon has-text-danger">
              <FontAwesomeIcon icon={faTimes}/>

              </span>
              <span>Ej i lager</span>
            </div>
            )}
              </div>
          </div>
          
          <div className="media-content">
          <Modal 
            closeModal={() => pushProducts()} 
            modalState={modalState}
            title={product.name}
            product={product}
            addToCart={props.addToCart}
          >
            
                <div className="product-modal-box">
                <img
                style={{marginLeft: "auto", marginRight: "auto", borderRadius: 8}}
              className="is-rounded product-modal-box"
                src={`${imagesLink}${product.imageName}.jpg`}
                alt={product.name}
              />
              <div style={{marginLeft: "auto", marginRight: "auto", paddingLeft: 10}}>
               <h5 style={{ textTransform: "capitalize" }}>
      {product.name}
    </h5>
    <div ><ul style={{listStyleType: "none", marginLeft: 0}}>
    {product.description.map(function(item, i){
      return <li key={i}><p>{item}</p></li>
    })}
    </ul>
      </div>
      
      </div>
              </div>
            </Modal>
          <div style={{overflow: "auto", maxHeight: 200}}>
          <Description product={product}/>
          </div>
          <div style={{marginTop: 10}}>
<BuyButton product={product} isSmall={true} addToCart={props.addToCart}/>
            </div>
          </div>
        </div>
       
      </div>
  );
};

const Modal = ({ children, closeModal, modalState, title, product, addToCart}) => {
  if(!modalState) {
    return null;
  }
  
  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card product-modal">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body" style={{height: "auto", overflowY: "auto"}}>
          <div className="content">
            {children}
          </div>
        </section>
        <footer className="modal-card-foot">
          <a className="button is-primary is-outlined" onClick={closeModal}>Cancel</a>
          <div style={{marginLeft: "auto"}}>
          <BuyButton product={product} addToCart={addToCart}/>
          </div>
        </footer>
      </div>
    </div>
  );
}


export default ProductItem;
