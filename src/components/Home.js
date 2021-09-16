import React, { Component } from 'react';
import { Card, Button} from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import "./Home.css";


export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: []
        }
    }
    componentDidMount() {
        const token = this.props.token
        fetch('http://localhost:8000/categories',{
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer "+ token.replace(/^"(.*)"$/, '$1')
            },
        }
            )
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.setState({ categories: data })
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }
    render() {
        if(localStorage.getItem('isAdmin')){
            return <Redirect to="/admin/dashboard"/>
        }
        return (
            <div className="row">
                {this.state.categories.map(categories =>   
                        <Card key={categories.id} className="categories_align card-hover" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{categories.name}</Card.Title>
                            <Card.Text>
                                {categories.description}
                            </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            <Link to={`/product/${categories.id}`}><Button variant="primary">See More>></Button></Link>
                        </Card.Body>
                    </Card>
            )}
            </div>
        );
    }
}