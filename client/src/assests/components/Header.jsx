import React, { useState } from 'react';

import auth from '../../assests/ClientAuth';

import {
    Container,
    Row,
    Col,
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button
} from 'react-bootstrap';

import logo from '../img/logo.png';

import './css/header.css';

export default function Header() {
    const [product, setProduct] = useState('');

    const handleProduct = (e) => {
        setProduct(e.target.value);
    }

    const searchProduct = (e) => {
        e.preventDefault();
        if (product !== '') {
            window.location.href = '/produits?search=' + product + '';
        }
    }

    return (
        <Container id='header'>
            <Row>
                <Col>
                    <Navbar bg="light" variant="light" expand="lg">
                        <Navbar.Brand href="/">
                            <img
                                alt=""
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Dernières sorties</Nav.Link>
                                <NavDropdown title="Nos références" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/produits?brand=Rossignol">
                                        Rossignol
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/produits?brand=Dynastar">
                                        Dynastar
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/produits?brand=Salomon">
                                        Salomon
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/produits?brand=Fischer">
                                        Fischer
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Form onSubmit={(e) => searchProduct(e)} inline>
                                    <FormControl onChange={(e) => handleProduct(e)} type="text" placeholder="Search" className="mr-sm-2" />
                                    <Button variant="outline-success">Rechercher</Button>
                                </Form>
                            </Nav>
                            {auth.isAdmin() ? (
                                <a href="/admin">
                                    <Button variant="outline-danger" className='header-button'>Panel Admin</Button>
                                </a>
                            ) : (null)}
                            {auth.isLoggedIn() ? (
                                <>
                                    <a href='/profil'>
                                        <Button variant='outline-info' className='header-button'>Profil</Button>
                                    </a>
                                    <Button onClick={() => { auth.disconnect() }} variant="outline-danger">Déconnexion</Button>
                                </>
                            ) : (
                                    <a href='/connexion'>
                                        <Button variant='outline-info'>Connexion</Button>
                                    </a>
                                )
                            }
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    )
}