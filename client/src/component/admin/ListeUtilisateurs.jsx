import React, { useEffect, useState } from 'react';

import {
    Container,
    Row,
    Col,
    Button,
    Table
} from 'react-bootstrap';

import Paginate from '../../assests/components/Paginate';

import auth from '../../assests/ClientAuth';
import { newLimit } from '../../assests/js/new_page';

import './css/liste_utilisateurs.css';

export default function ListeUtilisateurs(props) {
    const [users, setUsers] = useState([]);
    const [max, setMax] = useState(15);

    const queryString = require('query-string');

    let parsed = queryString.parse(props.location.search);

    let page = parsed.page > 0 ? parsed.page : 1;
    let limit = parsed.limit > 0 ? parsed.limit : 15;

    const handleSelect = (e) => {
        window.location.href = newLimit(e.target.value);
    }

    const dateToString = (date) => {
        let newDate = new Date(date);

        let stringDate = newDate.getDay() + '/' + newDate.getMonth() + '/' + newDate.getFullYear();

        return stringDate;
    }

    useEffect(() => {
        fetch('http://localhost:8000/admin/users', {
            method: 'POST',
            body: JSON.stringify({
                'current': auth.getName(),
                'limit': limit,
                'page': page
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                setUsers(res.users);
                setMax(res.max);
            }, (err) => {
                console.log(err);
            })
        return () => {
        };
    }, [page, max]);

    return (
        <Container className='main-container'>
            <Row className='justify-content-center'>
                <Col xs={12} className='text-center'>
                    <a href='/admin/utilisateur/ajouter'>
                        <Button variant='success'>Ajouter un utilisateur</Button>
                    </a>
                </Col>
                <Col xs={8} md='auto'>
                    <select defaultValue={limit} name='limit' onChange={(e) => { handleSelect(e) }}>
                        <option value='1'>1</option>
                        <option value='5'>5</option>
                        <option value='15'>15</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                    </select>
                    <Table striped bordered hover size="sm" id='admin-user-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Adresse mail</th>
                                <th>Nom d'utilisateur</th>
                                <th>Role</th>
                                <th>Date de création</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) =>
                                <tr key={i} className={user.role === 'admin' ? 'table-row-admin' : null}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{dateToString(user.creation_date.date)}</td>
                                    {user.role === 'admin' ? (
                                        <td className='table-center'>X</td>
                                    ) : (
                                            <a href={'/admin/utilisateur/' + user.id}>
                                                <Button variant='warning'>Modifier</Button>
                                            </a>
                                        )
                                    }
                                    {user.role === 'admin' ? (
                                        <td className='table-center'>X</td>
                                    ) : (
                                            <td><Button variant='danger'>Supprimer</Button></td>
                                        )
                                    }

                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {users.length > 0 ? (
                        <Paginate page={page} max={max} />
                    ) : (null)}
                </Col>
            </Row>
        </Container>
    )
}