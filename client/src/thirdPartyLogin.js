import React, { Component } from 'react'
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

class OtherLogin extends Component{
    constructor(props){
        super(props);
        this.responseFacebook = this.responseFacebook.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
    }
    responseFacebook(res){
        console.log(res)
        const payload = {
            accessToken: res.accessToken
        }
        axios({
            url: '/facebookProfile',
            data: payload,
            method: 'POST'
        }).then((res)=>{
            localStorage.setItem('authToken', res.data.token)
            this.props.history.push("/tasks");
        }).catch((e)=>{
            console.log(e)
        })
    }
    responseGoogle(res){
        const payload = {
            accessToken: res.accessToken
        }
        axios({
            url: '/googleProfile',
            data: payload,
            method: 'POST'
        }).then((res)=>{
            localStorage.setItem('authToken', res.data.token)
            this.props.history.push("/tasks");
        }).catch((e)=>{
            console.log(e)
        })
    }
    render(){
        return (
            <>
                <h5>Or Login with </h5>
                <FacebookLogin
                    appId={process.env.FACEBOOK_APP_ID}
                    textButton="Facebook"
                    fields="name,email,picture"
                    callback={this.responseFacebook} />
                <GoogleLogin
                    clientId={process.env.GOOGLE_CLIENT_ID}
                    buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </>
        );
    }
}
export default OtherLogin;