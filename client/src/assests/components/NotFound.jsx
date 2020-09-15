import React from 'react';
import { Link } from 'react-router-dom';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import './css/not_found.css';

export default function NotFound() {
    return (
        <Container id='not-found-container'>
            <Row>
                <Col>
                    <p>404: Page introuvable</p>
                    <Link to='/'>Retour à l'accueil</Link>
                </Col>
            </Row>
        </Container>
    )
}