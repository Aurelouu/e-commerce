import React, { useState } from "react";
import { Redirect, Link } from 'react-router-dom';

import {
    Container,
    Col,
    Row,
    Form,
    Button
} from 'react-bootstrap';

import './css/connexion_form.css';

export default function ConnexionForm(props) {
    const [user, setUser] = useState({
        'email': '',
        'password': ''
    });
    const [errors, setErrors] = useState([]);

    const handleInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const login = (data) => {
        fetch('http://localhost:8000/user/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(res => res.json()).then(res => {
            console.log(res);
            if (res.status === 'ERROR') {
                setErrors(res.errors);
                return false;
            }
            localStorage.setItem('user', JSON.stringify(res.user));
            window.location.href = '/';
            return true;
        }, (err) => {
            setErrors([
                ...errors,
                {
                    'global': 'Impossible de se connecter au serveur.'
                }
            ])
        })
    }

    const tryLogin = (e) => {
        e.preventDefault();
        setErrors({});

        login(user);
        return;
    }

    return (
        <div id='connexion-container'>
            <Container>
                <Row className='align-self-center align-items-center'>
                    <Col>
                        <p id="p-connexion">Connectez-vous!</p>
                        <Form id='form'>
                            <Form.Group>
                                <Form.Label>Adresse Email:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='email' type="email"
                                    placeholder="Email" />
                            </Form.Group>
                            {errors['email'] !== undefined ? (
                                <p className='error-text'>{errors['email']}</p>
                            ) : (null)}

                            <Form.Group>
                                <Form.Label>Mot de passe:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='password' type="password"
                                    placeholder="Mot de passe" />
                            </Form.Group>
                            {errors['password'] !== undefined ? (
                                <p className='error-text'>{errors['password']}</p>
                            ) : (null)}
                            <Button onClick={(e) => { tryLogin(e) }}
                                variant="success" type="submit"
                                className='d-inline-block'>
                                Envoyer
                                    </Button>
                            <small id='register-link'>Vous n'avez pas de compte ? <Link to='/inscription'>Inscrivez-vous</Link></small>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )

}