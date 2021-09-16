import React, { Component, useContext } from 'react';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import {
    Accordion,
    AccordionContext,
    Alert,
    Card,
    Col,
    Container,
    Modal,
    Row,
    useAccordionButton
} from 'react-bootstrap';
import "./admin.css"
import { confirm } from 'react-bootstrap-confirmation';

function CustomToggle({ children, eventKey, callback }) {

    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Button
            type="button"
            variant={isCurrentEventKey ? "secondary" : "dark"}
            disabled={isCurrentEventKey}
            onClick={decoratedOnClick}
        >
            {children}
        </Button>
    );
}

class AddCategory extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            category_name: "",
            description: "",
            added: false,
            updated_added: false,
            variant: "",
            message: "",
            updated_variant: "",
            updated_message: "",
            modalShow: false,
            updated_id:""
        }

        this.setCategoryName = this.setCategoryName.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setAdded = this.setAdded.bind(this);
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    }

    fetchData() {
        const token = this.props.token
        fetch('http://localhost:8000/categories', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
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

    fetchCurrentCategory(id) {
        const token = this.props.token
        fetch(`http://localhost:8000/category/${id}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
        }
        )
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                this.setState({ category_name : data.name, description: data.description, updated_id: data.id })
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    componentDidMount() {
        this.fetchData()
    }

    setCategoryName(event) {
        this.setState({ category_name: event.target.value });
    }

    setDescription(event) {
        this.setState({ description: event.target.value });
    }

    setAdded(value) {
        this.setState({ added: value });
    }
    setUpdatedAdded(value){
        this.setState({ updated_added: value });
    }

    setModalShow(value, id) {
        this.setState({ modalShow: value });
        if (value) {
            this.fetchCurrentCategory(id)
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        this.addCategory({ name: this.state.category_name, description: this.state.description });
    }

    handleUpdateSubmit(event){
        event.preventDefault()
        this.updateCategory({ id: this.state.updated_id, 
                              name: this.state.category_name, 
                              description: this.state.description 
                            });
    }

    async addCategory(details) {
        const token = this.props.token

        return fetch('http://localhost:8000/category/add', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
            body: JSON.stringify(details)
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
                    this.setState({ category_name: "" })
                    this.setState({ description: "" })
                    this.fetchData()
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

    async updateCategory(details) {
        const token = this.props.token

        return fetch(`http://localhost:8000/category/${details.id}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
            },
            body: JSON.stringify(details)
        })
            .then(response => {
                if (!response.ok) {
                    this.setState({ updated_added: true });
                    this.setState({ variant: "danger" })
                    return response.json();
                }
                else {
                    this.setState({ updated_added: true });
                    this.setState({ updated_variant: "success" })
                    this.setState({ category_name: "" })
                    this.setState({ description: "" })
                    this.fetchData()
                    return response.json();
                }
            })
            .then(data => {
                this.setState({ updated_message: data.detail })

            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    deleteCategory = async (category_id) => {
        if (await confirm('NOTE: If you delete category it will delete all related prodcuts. Are you sure to delete this item?')) {
            const token = this.props.token
            fetch(`http://localhost:8000/category/${category_id}`, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token.replace(/^"(.*)"$/, '$1')
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json()
                    }
                    else {
                        this.fetchData()
                    }
                })
                .catch(error => {
                    this.setState({ errorMessage: error.toString() });
                    console.error('There was an error!', error);
                });
        }
    }

    render() {
        return (
            <div className="Login">
                <Container fluid="md">
                    <Accordion defaultActiveKey="0">
                        <CustomToggle eventKey="0" className="mb-3">Show Categories</CustomToggle>
                        <CustomToggle eventKey="1" className="mb-3">Add Category</CustomToggle>

                        <Accordion.Collapse eventKey="1">
                            <div className="top-allign">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group size="lg" controlId="category_name" className="mb-3">
                                        <Form.Label> Category Name </Form.Label>
                                        <Form.Control
                                            autoFocus
                                            type="text"
                                            value={this.state.category_name}
                                            onChange={this.setCategoryName}
                                        />
                                    </Form.Group>

                                    <Form.Group size="lg" controlId="category_description" className="mb-3">
                                        <Form.Label> Description </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.description}
                                            onChange={this.setDescription}
                                        />
                                    </Form.Group>
                                    <center>
                                        <Button className="mb-3" block type="submit" disabled={!(this.state.category_name && this.state.description)}>
                                            Save Details
                                        </Button>
                                    </center>
                                </Form>
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
                            </div>
                        </Accordion.Collapse>
                        <Accordion.Collapse eventKey="0" className="top-allign">
                            <div className="row">
                                {this.state.categories.map(categories =>
                                    <Card key={categories.id} className="categories_align card-hover" style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>{categories.name}</Card.Title>
                                            <Card.Text>
                                                {categories.description}
                                            </Card.Text>
                                            <Button variant="info" onClick={() => { this.setModalShow(true, categories.id) }} >Edit</Button>
                                            <Button variant="light" onClick={() => { this.deleteCategory(categories.id) }} >Delete</Button>
                                        </Card.Body>
                                    </Card>
                                )}
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                    <Modal
                        show={this.state.modalShow}
                        onHide={() => this.setModalShow(false)}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Modal heading
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={this.handleUpdateSubmit}>
                                <Form.Group size="lg" controlId="category_name" className="mb-3">
                                    <Form.Label> Category Name </Form.Label>
                                    <Form.Control
                                        autoFocus
                                        type="text"
                                        value={this.state.category_name}
                                        onChange={this.setCategoryName}
                                    />
                                </Form.Group>

                                <Form.Group size="lg" controlId="category_description" className="mb-3">
                                    <Form.Label> Description </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={this.state.description}
                                        onChange={this.setDescription}
                                    />
                                </Form.Group>
                                <center>
                                    <Button className="mb-3" block type="submit" disabled={!(this.state.category_name && this.state.description)}>
                                        Update Details
                                    </Button>
                                </center>
                            </Form>
                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    <Alert show={this.state.updated_added}
                                        variant={this.state.updated_variant}
                                        onClick={() => this.setUpdatedAdded(false)}
                                        dismissible
                                        size="sm"
                                    >
                                        <center>
                                            {this.state.updated_message}
                                        </center>
                                    </Alert>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setModalShow(false)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        );
    }
}

export default AddCategory;