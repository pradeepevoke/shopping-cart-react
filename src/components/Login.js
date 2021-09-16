import React, { Component } from 'react';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types'
import './Login.css';


export default class Login extends Component{

    static propTypes = {
        setToken: PropTypes.func.isRequired,
    };
    
    static isAuthenticated() {
        const token = localStorage.getItem('token')
        if (token) return true;
    }

    constructor(props) {
        super(props)

        this.state = {
            username : "",
            password : "",
            access_token:"",
            authenticated: true
        }

        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setUsername(event) {
        this.setState({ username: event.target.value });
    }

    setPassword(event) {
        this.setState({ password: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.loginUser({ username: this.state.username, password: this.state.password });
        if (this.state.authenticated){
            this.props.setToken(this.state.access_token)
            this.props.setIsAdmin(this.state.access_token)
        } 
    }

    async loginUser(credentials){
        const qs = require('qs');
        return fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify(credentials)
        })
        .then(response => {
            if(!response.ok){
                this.setState({ authenticated : false });
            }
            else{
                this.setState({ authenticated : true });
                return response.json();
            }
        })
        .then(data => {
            if(this.state.authenticated){
                localStorage.setItem('authenticated', true)
                this.setState({ access_token : data.access_token });
            }
        })
    }

    render(){
        return (
            <div className="Login">
                <Container fluid="md">
    
                    <Form onSubmit={this.handleSubmit}>
                        {!this.state.authenticated && 
                            <center>
                                <h6 className="error-msg">Invalid Credentials</h6>
                            </center>
                        }
                        <Form.Group size="lg" controlId="username" className="mb-3">
                            <Form.Label> username </Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value={this.state.username}
                                onChange={this.setUsername}
                            />
                        </Form.Group>
    
                        <Form.Group size="lg" controlId="password" className="mb-3">
                            <Form.Label> Password </Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.password}
                                onChange={this.setPassword}
                            />
                        </Form.Group>
                        <center>
                            <Button block type="submit" disabled={!(this.state.username && this.state.password  )}>
                                Login
                            </Button>
                        </center>
                    </Form>
                </Container>
            </div>
        );
    }
}
