import React, { Component } from 'react';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Alert, Col, Container, Row } from 'react-bootstrap';

class AddProduct extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            category_id: "",
            product_name: "",
            description: "",
            price: "",
            image: "",
            variant: "",
            message: "",
            added: false
        }

        this.setCategoryID = this.setCategoryID.bind(this);
        this.setProductName = this.setProductName.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setImage = this.setImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setAdded = this.setAdded.bind(this);
    }

    componentDidMount() {
        const token = this.props.token

        fetch("http://localhost:8000/categories", {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
        })
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

    setProductName(event) {
        this.setState({ product_name: event.target.value });
    }

    setDescription(event) {
        this.setState({ description: event.target.value });
    }

    setCategoryID(event) {
        console.log(event.target.value)
        this.setState({ category_id: event.target.value });
    }

    setImage(event) {
        console.log(event.target.files[0])
        this.setState({ image: event.target.files[0] });
    }

    setPrice(event) {
        this.setState({ price: event.target.value });
    }

    setAdded(value) {
        this.setState({ added: value });
    }

    handleSubmit(event) {
        event.preventDefault()
        
        let formData = new FormData();
        formData.append('name', this.state.product_name);
        formData.append('description', this.state.description);
        formData.append('category_id', this.state.category_id,);
        formData.append('image', this.state.image);
        formData.append('price', this.state.price);
        
        this.addProduct(formData);
    }

    async addProduct(details) {
        const token = this.props.token
        return fetch('http://localhost:8000/product/add', {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
            body: details
        })
            .then(response => {
                if (!response.ok) {
                    this.setState({ added: true });
                    this.setState({ variant: "danger" })
                    return response.json();
                }
                else {
                    this.setState({ added: true });
                    this.setState({ variant: "success" })
                    this.setState({ product_name: "" })
                    this.setState({ description: "" })
                    return response.json();
                }
            })
            .then(data => {
                this.setState({ message: data.detail })

            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    render() {
        if(!this.state.categories){
            return "Please add category"
        }
        return (
            <div className="Login">
                <Container fluid="md">
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Alert show={this.state.added} 
                                variant={this.state.variant} 
                                onClick={() => this.setAdded(false)} 
                                dismissible
                                size="sm"
                            >
                                <center>
                                    {this.state.message}
                                </center>
                            </Alert>
                        </Col>
                    </Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group size="lg" controlId="product_name" className="mb-3">
                            <Form.Label> Product Name </Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.product_name}
                                onChange={this.setProductName}
                            />
                        </Form.Group>

                        <Form.Group size="lg" controlId="product_description" className="mb-3">
                            <Form.Label> Description </Form.Label>
                            <Form.Control
                                type="text"
                                value={this.state.description}
                                onChange={this.setDescription}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="category_id" className="mb-3">
                            <Form.Label> Category </Form.Label>
                            <select className="form-control" name="city" onChange={this.setCategoryID}>
                                <option> --choose category-- </option>
                                {this.state.categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Choose Image</Form.Label>
                            <Form.Control className="form-control" type="file" size="sm" onChange={this.setImage}/>
                        </Form.Group>

                        <Form.Group size="lg" controlId="product_price" className="mb-3">
                            <Form.Label> Price </Form.Label>
                            <Form.Control
                                type="text"
                                value={this.state.price}
                                onChange={this.setPrice}
                            />
                        </Form.Group>

                        <Button block type="submit" disabled={!(this.state.product_name && this.state.description)}>
                            Save Details
                        </Button>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default AddProduct;