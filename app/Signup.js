import React from "react";
import update from 'immutability-helper'
import APIInvoker from "./utils/APIInvoker";
import {Link} from 'react-router-dom'
import browserHistory from './History'

class Signup extends React.Component {
    constructor(){
        super(...arguments)
        this.state = {
            username: '',
            name: '',
            password: '',
            userOk: false,
            license: false
        }
    }

    handleInput(e){
        let field = e.target.name
        let value = e.target.value
        let type = e.target.type

        if(field === 'username') {
            value = value.replace(' ','').replace('@','').substring(0,15)
            this.setState(update(this.state,{[field] : {$set: value}}))
        } else if(type === 'checkbox'){
            this.setState(update(this.state,{[field]:{$set: e.target.checked}}))
        }else {
            this.setState(update(this.state,{[field]:{$set: value}}))
        }
    }

    validateUser(e){
        let username = e.target.value
        APIInvoker.invokeGET('/usernameValidate/' + username, response => {
            this.setState(update(this.state,{userOk: {$set: true}}))
            this.usernameLabel.innerHTML = response.message
            this.usernameLabel.className = 'fadeIn animated ok'
        },error => {
            this.setState(update(this.state,{userOk: {$set: false}}))
            this.usernameLabel.innerHTML = error.message
            this.usernameLabel.className = 'fadeIn animated fail'
        })
    }

    signup(e){
        e.preventDefault()

        if(!this.state.license){
            this.submitBtnLabel.innerHTML = 'Acept terms & conditions'
            this.submitBtnLabel.className = 'shake animated'
            return
        }else if(!this.state.userOk) {
            this.submitBtnLabel.innerHTML = 'Check username please'
            this.submitBtnLabel.className = ''
            return
        }

        this.submitBtnLabel.innerHTML = ''
        this.submitBtnLabel.className = ''

        let request = {
            'name': this.state.name,
            'username': this.state.username,
            'password': this.state.password
        }

        APIInvoker.invokePOST('/signup',request,response => {
            browserHistory.push('/login')
            window.location.reload()
        },error => {
            this.submitBtnLabel.innerHTML = error.error
            this.submitBtnLabel.className = 'shake animated'
        })
    }

    render(){

        return(
            <div id="signup">
                <div className="container" >
                    <div className="row" >
                        <div className="col-xs-12" >

                        </div>
                    </div>
                </div>
                <div className="signup-form" >
                    <form onSubmit={this.signup.bind(this)}>
                        <h1>Join Twitter today</h1>
                        <input type='text' value={this.state.username} placeholder='@username' name='username' id="username" onBlur={this.validateUser.bind(this)} onChange={this.handleInput.bind(this)} />
                        <label id="usernameLabel" ref={self => this.usernameLabel = self} htmlFor='username' ></label>

                        <input type='text' value={this.state.name} placeholder='Name' name='name' id='name' onChange={this.handleInput.bind(this)} />
                        <label id='nameLabel' htmlFor="name" ref={self => this.nameLabel = self} ></label>

                        <input type='password' id='passwordLabel' value={this.state.password} placeholder='Password' name='password' onChange={this.handleInput.bind(this)} />
                        <label htmlFor="passwordLabel" ref={self => this.passwordLabel = self} ></label>

                        <input id="lecense" type='checkbox' ref = {self => this.license = self} value={this.state.license} name='license' onChange={this.handleInput.bind(this)} />
                        <label htmlFor="license" > Agree terms and conditions</label>

                        <button className="btn btn-primary btn-lg" id="submitBtn" onClick={this.signup.bind(this)}>Sign up</button>
                        <label id="submitBtnLabel" htmlFor="submitBtn" ref = {self => this.submitBtnLabel = self} className='shake animated hidden' ></label>

                        <p className="bg-danger user-test">Create a new user or use the user <strong>test/1234</strong></p>

                        <p>Already have an Account? <Link to={'/login'}>Sign in</Link></p>
                    </form>
                </div>
            </div>
        )
    }

}

export default Signup