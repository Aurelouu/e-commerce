import React from 'react';

import { Link } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap';

import './css/panel.css';

export default function Panel() {
    return (
        <Container className='main-container'>
            <Row>
                <Col xs={12} id='manage-buttons-container'>
                    <h1>Panel Admin</h1>
                    <Row className='justify-content-around'>
                        <Col>
                            <Link to='/admin/produits' className='admin-button-link'>
                                <Button variant="dark" size="lg" block>
                                    Gérer les produits
                                </Button>
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/admin/marques' className='admin-button-link'>
                                <Button variant="dark" size="lg" block>
                                    Gérer les marques
                                </Button>
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/admin/categories' className='admin-button-link'>
                                <Button variant="dark" size="lg" block>
                                    Gérer les catégories
                                </Button>
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/admin/utilisateurs' className='admin-button-link'>
                                <Button variant="dark" size="lg" block>
                                    Gérer les utilisateurs
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}