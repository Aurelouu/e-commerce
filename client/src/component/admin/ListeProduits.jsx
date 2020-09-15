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

export default function ListeProduits(props) {
    const [products, setProducts] = useState([]);
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

    const shortenDesc = (text) => {
        const textLength = text.length;

        const shortenText = text.substring(0, 25);

        return shortenText + '... (' + textLength + ')'
    }

    const deleteProduct = (productId) => {
        fetch('http://localhost:8000/product/delete', {
            method: 'DELETE',
            body: JSON.stringify({
                'current': auth.getName(),
                'productId': productId
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

    useEffect(() => {
        fetch('http://localhost:8000/admin/products', {
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
                setProducts(res.products);
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
                    <a href='/admin/produits/ajouter'>
                        <Button variant='success'>Ajouter un produit</Button>
                    </a>
                </Col>
                <Col xs={8}>
                    <select defaultValue={limit} name='limit' onChange={(e) => { handleSelect(e) }}>
                        <option value='1'>1</option>
                        <option value='5'>5</option>
                        <option value='15'>15</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                    </select>
                    <Table striped bordered hover size="sm" id='admin-product-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Marque</th>
                                <th>Catégorie</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) =>
                                <tr key={i} className={product.stock === 0 ? 'table-row-out' : null}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{shortenDesc(product.description)}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>{dateToString(product.creation_date.date)}</td>
                                    <td>
                                        <a href={'/admin/produit/' + product.id}>
                                            <Button variant='warning'>Modifier</Button>
                                        </a>
                                    </td>
                                    <td><Button onClick={() => { deleteProduct(product.id) }} variant='danger'>Supprimer</Button></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {products.length > 0 ? (
                        <Paginate page={page} max={max} />
                    ) : (null)}
                </Col>
            </Row>
        </Container>
    )
}