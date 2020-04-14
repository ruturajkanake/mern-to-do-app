import React, { Component } from 'react'
import {Link} from "react-router-dom";
import "./Register.css" ;
import axios from 'axios'

class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      age: null
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.resetUserInputs=this.resetUserInputs.bind(this);
  }
  
  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();

    const payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      age: this.state.age
    }

    axios({
      url: '/users',
      method: 'POST',
      data: payload
    }).then((res)=>{
      localStorage.setItem('authToken', res.data.token)
      console.log(res)
      this.props.history.push("/tasks");
      this.resetUserInputs()
    }).catch((err)=>{
      console.log(err)
      this.resetUserInputs()
    })

  }

  resetUserInputs(){
    this.setState({
      name: '',
      email: '',
      password: '',
      age: '',
      avatar: '',
    })
  }

  render() {
    return (
      <div className="Register">
        <h4>New User? Register</h4>
        <form onSubmit={this.handleSubmit} className="Form-Main">
          <div className="Form-Set">
            <label htmlFor="name">Name</label>
            <div className="Form-Text">
              <i class="far fa-user"></i>
              <input 
                type="text" 
                placeholder="Enter Your Name"
                value={this.state.name}
                name="name" 
                id="name"
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className="Form-Set">
            <label htmlFor="email">Email</label>
            <div className="Form-Text">
              <i class="fas fa-envelope-open"></i>
              <input 
                placeholder="john@example.com"
                type="email" 
                id="email"
                value={this.state.email}
                name="email"
                onChange={this.handleChange}
                />
            </div>
          </div>
          <div className="Form-Set">
            <label htmlFor="password">Password</label>
            <div className="Form-Text">
              <i class="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="************"
                value={this.state.password}
                name="password"
                id="password"
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className="Form-Set">
            {/* <div className="Form-Small-Set"> */}
              <label htmlFor="age">Age</label>
              <div className="Form-Text">
                <i class="fas fa-birthday-cake"></i>
                <input 
                  type="text" 
                  placeholder="Your Age"
                  id="age"
                  value={this.state.age}
                  name="age"
                  onChange={this.handleChange}
                  />
              {/* </div> */}
            </div>
            {/* <div className="Form-Small-Set">
              <label htmlFor="avatar">Avatar</label>
              <div className="Form-Small-Text">
                <i class="fas fa-portrait"></i>
                <input 
                  type="text" 
                  placeholder="Choose a File"
                  id="avatar"
                  value={this.state.avatar}
                  name="avatar"
                  onChange={this.handleChange}
                  />
                  <i class="fab fa-google-drive"></i>
              </div> 
            </div> */}
          </div>
          <button className="Register-Button">Register 
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
        <h5>Already Have Account? <Link to="/login">Login</Link></h5>
      </div>
    )
  }
}

export default Register;