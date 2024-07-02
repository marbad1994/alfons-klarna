import React, { Component } from "react";
import withContext from "../withContext";
import { Redirect } from "react-router-dom";
import axios from 'axios';


class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.product;
  }

  componentDidMount = () => {
      document.getElementById("root").classList.remove("home-bg")
  }

  componentDidUpdate = () => {
      if (this.props.save) {
        this.save()
      }
  }

  

  save = async () => {
    const { _id, name, price, stock, description, imageName, serial } = this.state;
    console.log(this.state)
    if (name && price) {
      let descriptionString = description.join("\n")

      await axios.put(
        `${this.props.context.apiLink}collection`,
        { _id, name, price, stock, descriptionString, imageName, serial },
      )
        this.props.setClick()
        this.props.context.editProduct(this.state)
      
      this.setState(
        { flash: { status: 'is-success', msg: 'Product updated successfully' }}
      );

    } else {
      this.setState(
        { flash: { status: 'is-danger', msg: 'Please enter name and price' }}
      );
    }
    return;
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value, error: "" });

  render() {

    const { name, price, stock, description, imageName, serial } = this.state;

    const { user } = this.props.context;

    return !(user && user.accessLevel < 1) ? (
      <Redirect to="/" />
    ) : (
      
        <form onSubmit={this.save} style={{width: "100%"}}>
          <div className="columns is-mobile is-centered">
            <div className="column">
              <div className="field">
                <label className="label">Product Name: </label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="field">
                <label className="label">Serial: </label>
                <input
                  className="input"
                  type="text"
                  name="serial"
                  value={serial}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="field">
                <label className="label">Price: </label>
                <input
                  className="input"
                  type="number"
                  name="price"
                  value={price}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="field">
                <label className="label">Available in Stock: </label>
                <input
                  className="input"
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Image Name: </label>
                <input
                  className="input"
                  type="text"
                  name="imageName"
                  value={imageName}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label className="label">Description: </label>
                <textarea
                  className="textarea"
                  type="text"
                  rows="2"
                  style={{ resize: "none" }}
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </div>
              {this.state.flash && (
                <div className={`notification ${this.state.flash.status}`}>
                  {this.state.flash.msg}
                </div>
              )}
            </div>
          </div>
        </form>
    );
  }
}

export default withContext(EditProduct);
