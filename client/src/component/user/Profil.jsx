import React from 'react';

import { Link } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Button,
    ButtonGroup
} from 'react-bootstrap';

import auth from '../../assests/ClientAuth';

import './css/profil.css';

export default function Profil() {
    const dateToString = (date) => {
        let newDate = new Date(date);

        let stringDate = newDate.getDay() + '/' + newDate.getMonth() + '/' + newDate.getFullYear();

        return stringDate;
    }

    const deactivate = () => {
        fetch('http://localhost:8000/user/deactivate', {
            method: "PUT",
            body: JSON.stringify({
                'current': auth.getName()
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                auth.disconnect();
            }, (err) => {
                console.log(err);
            })
    }

    return (
        <Container className='main-container'>
            <Row>
                <Col>
                    <h3>{auth.getName()}</h3>
                    <h5 className='text-muted'>{auth.getEmail()}</h5>
                    <p>Date d'inscription : {dateToString(auth.getCreationDate().date)}</p>
                    <ButtonGroup aria-label="Basic example">
                        <Link to='/profil/infos'>
                            <Button variant='warning'>Modifier mes informations</Button>
                        </Link>
                        <Link to='/profil/motdepasse'>
                            <Button variant='info'>Modifier mon mot de passe</Button>
                        </Link>
                        <Button onClick={() => { deactivate() }} variant='danger'>Désactiver mon compte</Button>
                    </ButtonGroup>
                </Col>
                <Col id='order-history'>
                    <h2>Historique des commandes : </h2>
                </Col>
            </Row>
        </Container >
    )
}