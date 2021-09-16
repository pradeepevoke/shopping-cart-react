import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Header(props) {
    let isAdmin = props.isAdmin
    if(!isAdmin){
        isAdmin = localStorage.getItem("isAdmin")
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/"> Shopping Cart </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    {
                    isAdmin ?
                        <Nav>
                            <Nav.Link as={NavLink} to="/admin/dashboard" exact> Admin </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/add/category"> Add Category </Nav.Link>
                            <Nav.Link as={NavLink} to="/admin/add/product"> Add Product </Nav.Link>
                            <Nav.Link as={NavLink} to="/logout"> Logout </Nav.Link>
                        </Nav> :
                        <Nav>
                            <Nav.Link as={NavLink} to="/" exact> Home </Nav.Link>
                            <Nav.Link as={NavLink} to="/profile"> Profile </Nav.Link>
                            <Nav.Link as={NavLink} to="/cart"> Cart </Nav.Link>
                            <Nav.Link as={NavLink} to="/logout"> Logout </Nav.Link>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

