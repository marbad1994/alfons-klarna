import React, {useEffect} from "react";
import ProductItem from "./ProductItem";
import withContext from "../withContext";
import IconBar from './IconBar';
const nameToUrl = (name) => {
  let url = name.replaceAll(" ", "-")
  url = url.toLowerCase()
  return url
}

const checkSearch = (products, search) => {
  let match = false
  products.map(product => {
      if (search.startsWith(nameToUrl(`?product=${product.name}`))) {
        match = true
      }
  })
  return match
}
const ProductList = props => {
  const { products, imagesLink, addToCart } = props.context;
  const { history } = props;
  let search = history.location.search
  let foundProduct = checkSearch(products, search)

  useEffect(() => {
    document.getElementById("root").style.backgroundImage = null;
    document.getElementById("root").style.display = null;
    
  });

  return (
   
    <>
          <div className="container" style={{minHeight: 600}}>
<IconBar/>
         <div className="column">
            <div className="title has-text-grey-light"><h1>Kollektion</h1></div>
            </div>
      <br />
        <div className="column columns is-multiline">
          {products && products.length ? (
            products.map((product, index) => (
              <div className="column is-half">
              <ProductItem
                nameToUrl={nameToUrl}
                foundProduct={foundProduct}
                search={search}
                product={product}
                key={index}
                addToCart={addToCart}
                imagesLink={imagesLink}
                history={history}

              />
              </div>
            ))
          ) : (
            <div className="column">
              <span className="title has-text-grey-light">
                No products found!
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withContext(ProductList);
