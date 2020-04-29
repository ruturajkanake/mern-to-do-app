import React, { Component } from 'react'
import {Link} from "react-router-dom";
import "./Register.css" ;
import axios from 'axios';
import OtherLogin from "./thirdPartyLogin";
import Modal from 'react-modal';


class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      age: null,
      isActive: false,
      code: null,
      randomCode: Math.floor(100000 + Math.random() * 900000)
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.toggleModal=this.toggleModal.bind(this);
    this.resetUserInputs=this.resetUserInputs.bind(this);
    this.verifyEmail=this.verifyEmail.bind(this);
    
  }

  componentDidMount(){
    if(localStorage.authToken){
      this.props.history.push("/tasks");
    }
  }


  componentWillMount(){
    Modal.setAppElement('body')
  }
  
  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  verifyEmail(){

    const payload = {
      name: this.state.name,
      email: this.state.email,
      code: this.state.randomCode
    }

    axios({
      url: '/userVerification',
      method: 'POST',
      data: payload
    }).then((res)=>{
      console.log(res.data)
      this.setState({
        isActive: !this.state.isActive
      })
    }).catch((err)=>{
      console.log(err)
    })
  }

  toggleModal(){

    this.setState({
      isActive: !this.state.isActive
    })

  }

  handleSubmit(e){
    e.preventDefault();

    const payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      age: this.state.age
    }
    let num = this.state.randomCode
    num = num.toString()

    if(this.state.code === num ){

      axios({
        url: '/users',
        method: 'POST',
        data: payload
      }).then((res)=>{
        localStorage.setItem('authToken', res.data.token)
        this.props.history.push("/tasks");
        this.resetUserInputs()
      }).catch((err)=>{
        console.log(err)
        this.resetUserInputs()
      })
    }

  }

  resetUserInputs(){
    this.setState({
      name: '',
      email: '',
      password: '',
      age: '',
      code: null
    })
  }

  render() {
    return (
      <div className="Register">
        <h4>New User? Register</h4>
        <div className="Form-Main">
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
                required
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
                required
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
                required
                placeholder="************"
                value={this.state.password}
                name="password"
                id="password"
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className="Form-Set">
              <label htmlFor="age">Age</label>
              <div className="Form-Text">
                <i class="fas fa-birthday-cake"></i>
                <input 
                  type="number" 
                  placeholder="Your Age"
                  id="age"
                  value={this.state.age}
                  name="age"
                  onChange={this.handleChange}
                  />
            </div>
          </div>
          <button className="Register-Button" onClick={this.verifyEmail} >Register 
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Modal classes */}
        <Modal isOpen={this.state.isActive} onRequestClose={this.toggleModal} className='modal-verify'>
          <div className="verify-text">
            <h4>The code has been sent to {this.state.email}</h4>
            <p>Enter the code below.</p>
          </div>
          <input 
            type="number" 
            placeholder="0 0 0 0 0 0"
            id="code"
            value={this.state.code}
            name="code"
            onChange={this.handleChange}
          />
          <button className="verify" onClick={this.handleSubmit}>Verify</button>
        </Modal>

        <h5>Already Have Account? <Link to="/login">Login</Link></h5>
        <OtherLogin history={this.props.history}/>
      </div>
    )
  }
}

export default Register;