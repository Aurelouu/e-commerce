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

import './css/liste_categories.css';

export default function ListeCategories(props) {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
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
        setNewCategory(e.target.value);
    }

    const deleteBrand = (categoryId) => {
        fetch('http://localhost:8000/category/delete', {
            method: 'DELETE',
            body: JSON.stringify({
                'current': auth.getName(),
                'categoryId': categoryId
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

    const addCategory = (categoryName) => {
        fetch('http://localhost:8000/category/create', {
            method: 'POST',
            body: JSON.stringify({
                'current': auth.getName(),
                'name': categoryName
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
        fetch('http://localhost:8000/admin/categories', {
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
                    setCategories(res.categories);
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
                    <label htmlFor="category_name">Ajouter une marque</label>
                    <FormControl
                        id='category_name'
                        placeholder="Nom"
                        onInput={(e) => { handleInput(e) }}
                    />
                    {errors['name'] !== undefined ? (
                        <p className='error-text'>{errors['name'][0]}</p>
                    ) : (null)}
                    <Button
                        id='add-brand-button'
                        onClick={() => { addCategory(newCategory) }}
                        variant='success'>Ajouter</Button>
                </Col>
                <Col xs={8} md='auto'>
                    <h3>Liste des catégories</h3>
                    <select defaultValue={limit} name='limit' onChange={(e) => { handleSelect(e) }}>
                        <option value='1'>1</option>
                        <option value='5'>5</option>
                        <option value='15'>15</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                    </select>
                    <Table striped bordered hover size="sm" id='admin-category-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Nombre de produit</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, i) =>
                                <tr key={i}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td className='text-center'>{category.number_products}</td>
                                    <td>
                                        <Button onClick={() => deleteBrand(category.id)} variant='danger'>Supprimer</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {categories.length > 0 ? (
                        <Paginate page={page} max={max} />
                    ) : (null)}
                </Col>
            </Row>
        </Container>
    )
}