import React, { Component } from "react";
import withContext from "../withContext";
import axios from 'axios';

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phonenumber: "",
      adress: "",
      orderNumber: 0
    };
  }

  componentDidMount = async () => {
    console.log(this.props)
    document.getElementById("root").style.backgroundImage = null;
    const orderNumber = await axios.get(`${this.props.context.apiLink}order-number`)
    console.log(orderNumber)

    this.props.context.setOrderNumber(parseInt(orderNumber.data)+10000)
  }


  handleChange = e => this.props.context.setCustomerDetails(e)

  render() {
    return (
      <>
        
        <form onSubmit={this.checkout}>
          <div className="columns is-mobile is-centered">
            <div className="column">
              <div className="field">
                <label className="label">Email: </label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Telefonnummer: </label>
                <input
                  className="input"
                  type="numerical"
                  name="phonenumber"
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Address: </label>
                <input
                  className="input"
                  type="text"
                  name="adress"
                  onChange={this.handleChange}
                />
              </div>
              {this.state.error && (
                <div className="has-text-danger">{this.state.error}</div>
              )}
              
            </div>
          </div>
        </form>
      </>
    ) 
  }
}

export default withContext(Checkout);
