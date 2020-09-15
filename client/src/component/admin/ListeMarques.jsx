import React, { useEffect, useState } from 'react';

import {
    Container,
    Row,
    Col,
    Button,
    Table,
    FormControl
} from 'react-bootstrap';

import Paginate from '../../assests/components/Paginate';

import auth from '../../assests/ClientAuth';
import { newLimit } from '../../assests/js/new_page';

import './css/liste_marques.css';

export default function ListeMarques(props) {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState('');
    const [errors, setErrors] = useState([]);
    const [max, setMax] = useState(15);

    const queryString = require('query-string');

    let parsed = queryString.parse(props.location.search);

    let page = parsed.page > 0 ? parsed.page : 1;
    let limit = parsed.limit > 0 ? parsed.limit : 15;

    const handleSelect = (e) => {
        window.location.href = newLimit(e.target.value);
    }

    const handleInput = (e) => {
        setNewBrand(e.target.value);
    }

    const deleteBrand = (brandId) => {
        fetch('http://localhost:8000/brand/delete', {
            method: 'DELETE',
            body: JSON.stringify({
                'current': auth.getName(),
                'brandId': brandId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === 'OK') {
                    window.location.reload(false);
                    return true;
                }
            }, (err) => {
                console.log(err);
            })
    }

    const addBrand = (brandName) => {
        fetch('http://localhost:8000/brand/create', {
            method: 'POST',
            body: JSON.stringify({
                'current': auth.getName(),
                'name': brandName
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === 'OK') {
                    window.location.reload(false);
                    return true;
                }
                setErrors(res.errors);
                return false;
            }, (err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetch('http://localhost:8000/admin/brands', {
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
                if (res.status === 'OK') {
                    setBrands(res.brands);
                    setMax(res.max);
                }
            }, (err) => {
                console.log(err);
            })
        return () => {
        };
    }, [page, max]);

    return (
        <Container className='main-container'>
            <Row className='justify-content-center'>
                <Col xs={12}>
                    <label htmlFor="brand_name">Ajouter une marque</label>
                    <FormControl
                        id='brand_name'
                        placeholder="Nom"
                        onInput={(e) => { handleInput(e) }}
                    />
                    {errors['name'] !== undefined ? (
                        <p className='error-text'>{errors['name'][0]}</p>
                    ) : (null)}
                    <Button
                        id='add-brand-button'
                        onClick={() => { addBrand(newBrand) }}
                        variant='success'>Ajouter</Button>
                </Col>
                <Col xs={8} md='auto'>
                    <h3>Liste des marques</h3>
                    <select defaultValue={limit} name='limit' onChange={(e) => { handleSelect(e) }}>
                        <option value='1'>1</option>
                        <option value='5'>5</option>
                        <option value='15'>15</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                    </select>
                    <Table striped bordered hover size="sm" id='admin-brand-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Nombre de produit</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand, i) =>
                                <tr key={i}>
                                    <td>{brand.id}</td>
                                    <td>{brand.name}</td>
                                    <td className='text-center'>{brand.number_product}</td>
                                    <td>
                                        <Button onClick={() => deleteBrand(brand.id)} variant='danger'>Supprimer</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {brands.length > 0 ? (
                        <Paginate page={page} max={max} />
                    ) : (null)}
                </Col>
            </Row>
        </Container>
    )
}