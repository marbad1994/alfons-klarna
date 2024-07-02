
import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Home from './components/Home';
import Footer from './components/Footer';
import ToolTipCart from './components/ToolTipCart';
import Products from './components/Products';
import Orders from './components/Orders';
import Terms from './components/Terms';
import About from './components/About';
import NotFound from './components/NotFound';
import Context from "./Context";
import {BrowserView, MobileView} from 'react-device-detect';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      order: [],
      products: [],
      quantity: 0,
      rootElement: props.rootElement,
      style: {display: 'none'},
      email: "",
      mobile: "",
      adress: "",
      orderNumber: 0,
      apiLink: "https://greatsecret.herokuapp.com/api/v1/",
      imagesLink: "http://www.greatsecret.se/images/",
      width: 0,
      metaHeight: 0
    };
    this.routerRef = React.createRef();
  }

  async componentDidMount() {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");
    let quantity = localStorage.getItem("quantity");

    const products = await axios.get(`${this.state.apiLink}collection`);
    quantity = quantity ? JSON.parse(quantity) : 0;
    user = user ? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.setState({ quantity, user,  products: products.data, cart});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
}

  updateWindowDimensions = () => {
    let metaHeight = this.divElement.clientHeight;
      this.setState({ width: window.innerWidth, metaHeight: metaHeight });
  };

  login = async (username, password) => {
    const res = await axios.post(
      `${this.state.apiLink}login`,
      JSON.stringify({ username: username, password: password }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .catch((res) => {
      return { status: 401, message: 'Unauthorized' }
    })
    console.log(res)

    if(res.status === 200) {
      console.log(jwt_decode(res.data.accessToken))
      const { username } = jwt_decode(res.data.accessToken)
      const user = {
        username,
        token: res.data.accessToken,
        accessLevel: username === 'admin' ? 0 : 1
      }

      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  logout = e => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callback && callback());
  };

  editProduct = (product) => {
    let products = this.state.products.slice();
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === product._id) {
        products[i] = product
      }
    }
    this.setState({ products })
  }

  removeProduct = (id) => {
    axios.delete(
      `${this.state.apiLink}collection/${id}`
    )
    let products = this.state.products.slice();
    for (let i = 0; i < products.length; i++) {
      if (products[i]._id === id) {
        products.pop(i)
        break
      }
    }
    this.setState({ products })
  }

  removeOrder = (id) => {
    axios.delete(
      `${this.state.apiLink}orders/${id}`
    )
    let orders = this.state.orders.slice();
    let products = this.state.products.slice();
    for (let i = 0; i < orders.length; i++) {
      if (orders[i]._id === id) {
        orders[i].show = false
        orders[i].orderStatus = "removed"
        for (let n = 0; n < orders[i].order.length; n++) {
          let order = orders[i].order
          let product = order[n].item
          let quantity = order[n].quantity

          products.map(p => {
            if (p.name === product) {
              p.stock = p.stock + quantity;
      
              axios.put(
                `${this.state.apiLink}collection/${p._id}`,
                { stock: p.stock },
              )
            }
            return p;
          });
        }
        break
      }
    }
    this.setState({ orders, products })
  }

  updateOrder = (orderInfo) => {

    let orders = this.state.orders.slice();
    for (let i = 0; i < orders.length; i++) {
      let id = orders[i]._id
     
      if (id in orderInfo && orders[i].shipped !== orderInfo[id]) {
        axios.put(
          `${this.state.apiLink}orders/${id}`,
          {shipped: orderInfo[id]}
        )
        orders[i].shipped = orderInfo[id]
        orders[i].show = !orderInfo[id]
      }
    }
    this.setState({ orders })
  }

  addToCart = cartItem => {
    let cart = this.state.cart;
    let quantity;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
      quantity = this.state.quantity
    } else {
      quantity = this.state.quantity + 1
    }

    let cartData = this.state.order
    let item = {name: cartItem.product.name, price: cartItem.product.price, serial: cartItem.product.serial, imageName: cartItem.product.imageName, quantity: cart[cartItem.id].amount}
    cartData.push(item)
    // Object.values(this.state.order).map((value) => {
    //   let data = {}
    //   data["name"] = value.product.name
    //   data["price"] = value.product.price
    //   data["serial"] = value.product.serial
    //   data["imageName"] = value.product.imageName
    //   data["quantity"] = value.amount

    //   cartData.push(data)
    // })
    localStorage.setItem("quantity", quantity)
    this.setState({quantity: quantity})
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart: cart, order: cartData });
  };

  removeFromCart = cartItem => {
    let cart = this.state.cart;
    
    cart[cartItem.id].amount -= cartItem.amount;
    
    if (cart[cartItem.id].amount < 1) {
      this.removeProductFromCart(cartItem.id)
    } 
    let quantity = this.state.quantity - 1

    localStorage.setItem("quantity", quantity)
    this.setState({quantity: quantity})
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeProductFromCart = cartItemId => {
    let cart = this.state.cart;
    let amount = cart[cartItemId].amount
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("quantity", this.state.quantity-amount)
    this.setState({quantity: this.state.quantity-amount})
    this.setState({ cart });
  };

  clearCart = () => {
    const cart = this.state.cart;
    const products = this.state.products.map(p => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.put(
          `${this.state.apiLink}collection/${p._id}`,
          { stock: p.stock },
        )
      }
      return p;
    });
    localStorage.removeItem("cart");
    localStorage.setItem("quantity", 0)
    this.setState({ cart: {}, quantity: 0, products: products });
  };

  checkout = async () => {
    if (!this.state.adress || !this.state.email || !this.state.phonenumber || !this.state.orderNumber) {
      return;
    }
    const customer = {adress: this.state.adress, email: this.state.email, phonenumber: this.state.phonenumber}
    const cart = this.state.cart;
    let total = 0;
    

    let order = Object.keys(cart).map(p => {
      total += cart[p].product.price
      return {item: cart[p].id, quantity: cart[p].amount, price: cart[p].product.price, imageName: cart[p].product.imageName}
    })

    const products = this.state.products.map(p => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.put(
          `${this.state.apiLink}collection/${p._id}`,
          { stock: p.stock },
        )
      }
      return p;
    });
    axios.post(
     `${this.state.apiLink}order`,
     JSON.stringify({customer: customer, order: order, total: total, orderNumber: this.state.orderNumber}),
     {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    )
    this.setState({ products });
    this.clearCart();
  };

  setCustomerDetails = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  }

  setOrderNumber = (orderNumber) => {
    this.setState({orderNumber: orderNumber})
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          removeProductFromCart: this.removeProductFromCart,
          addToCart: this.addToCart,
          login: this.login,
          addProduct: this.addProduct,
          editProduct: this.editProduct,
          removeProduct: this.removeProduct,
          clearCart: this.clearCart,
          checkout: this.checkout,
          setCustomerDetails: this.setCustomerDetails,
          updateOrder: this.updateOrder,
          removeOrder: this.removeOrder,
          setOrderNumber: this.setOrderNumber
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
        <div 
              ref={ (divElement) => { this.divElement = divElement } }
              className="meta-text"
              style={{marginTop: (this.state.metaHeight * -1), zIndex: -2000, color: "#1A1E3A"}}
            >
          <h2>sexleksaker online</h2>
          <h3>sexleksaker online</h3>
          </div>
          <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 "><a style={{marginTop: 7}} href="/index"><img className="no-copy" src={`/images/logo-text-tp.png`} alt="Sexleksaker Online"/></a></b>
              <label
                role="button"
                className="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div  className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                  <Link to="/index" className="navbar-item">
                  Hem
                </Link>
                <Link to="/products" className="navbar-item" >
                  Kollektion
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <>
                  <Link to="/add-product" className="navbar-item">
                    Add Product
                  </Link>
                  <Link to="/admin-products" className="navbar-item">
                  Product Overview
                </Link>
                </>
                )}

             

                <Link to="/about" className="navbar-item" 
             
                 >
                  Om oss
                  
                </Link>
                {this.state.user && (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                  Logout
                </Link>
                )}
                
              </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
                style={this.state.width > 1022 ? {position: "absolute", right: this.state.width*0.01} : {position: "static", right: "auto"}}
                >
              <BrowserView>

              <Link to="/cart" style={this.state.width > 1022 ? {marginTop: 5}: {marginTop: -20}} className="navbar-item"  onMouseEnter={e => {
                  this.setState({style: {display: 'block', zIndex: 2, position: "absolute", right: "4%"}});
               
              }}

              >
                Kundvagn
                <span
                  className="tag is-primary"
                  style={{ marginLeft: "5px" }}
                >
                  { this.state.quantity }
                </span>
              </Link>
              </BrowserView>
              <MobileView>

              <Link to="/cart" style={this.state.width > 1022 ? {marginTop: 9}: {marginTop: -20}} className="navbar-item"  

              >
                Kundvagn
                <span
                  className="tag is-primary"
                  style={{ marginLeft: "5px" }}
                >
                  { this.state.quantity }
                </span>
              </Link>
              </MobileView>
              </div>
            </nav>

            <ToolTipCart/>
            <Switch onMouseEnter={e => {
                  this.setState({style: {display: 'none'}});
                 }}>
              <Route exact path="/" component={Home} />
              <Route exact path="/index" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route path="/products" component={ProductList} />
              <Route exact path="/admin-products" component={Products} />
              <Route exact path="/orders" component={Orders} />
              <Route exact path="/terms" component={Terms} />
              <Route component={NotFound} />
            </Switch>

          </div>
          <Footer/>
        </Router>
      </Context.Provider>
    );
  }
}
