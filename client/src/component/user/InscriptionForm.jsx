import React, { useState } from "react";

import { Link } from 'react-router-dom';

import {
    Container,
    Col,
    Row,
    Form,
    Button
} from 'react-bootstrap';

import './css/inscription_form.css';
import { Redirect } from "react-router-dom";

export default function Inscription() {
    const [user, setUser] = useState({});
    const [errors, setErrors] = useState([]);

    const handleInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    }

    const submitUser = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/user/create', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((res) => {
            console.log(res);
            if (res.status === 'ERROR') {
                setErrors(res.errors);
                return false;
            }
            if (res.status === 'OK') {
                window.location.href = '/connexion';
                return true;
            }

        }, (err) => {
            console.log('error:' + err)
        })
    }

    return (
        <div id='inscription-container'>
            <Container>
                <Row className='align-self-center align-items-center'>
                    <Col>
                        <p id="p-inscription">Inscrivez-vous!</p>
                        <Form id='form'>
                            <Form.Group>
                                <Form.Label>Nom d'utilisateur:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='name' type="text"
                                    placeholder="Nom d'utilisateur" />
                                {errors['name'] !== undefined ? (
                                    <p className='error-text'>{errors['name'][0]}</p>
                                ) : (null)}
                                <Form.Label>Adresse Email:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='email' type="email"
                                    placeholder="Email" />
                                {errors['email'] !== undefined ? (
                                    <p className='error-text'>{errors['email'][0]}</p>
                                ) : (null)}
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Mot de passe:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='password' type="password"
                                    placeholder="Mot de passe" />
                                {errors['password'] !== undefined ? (
                                    <p className='error-text'>{errors['password'][0]}</p>
                                ) : (null)}
                                <Form.Label>Confirmation:</Form.Label>
                                <Form.Control
                                    onChange={(e) => handleInput(e)}
                                    name='passwordConfirm' type="password"
                                    placeholder="Confirmation" />
                                {errors['passwordConfirm'] !== undefined ? (
                                    <p className='error-text'>{errors['passwordConfirm'][0]}</p>
                                ) : (null)}
                            </Form.Group>
                            <Button onClick={(e) => { submitUser(e) }}
                                variant="success" type="submit"
                                className='d-inline-block'>
                                Envoyer
                                    </Button>
                            <small id='login-link'>Vous avez déjà un compte ? <Link to='/connexion'>Connectez-vous</Link></small>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}