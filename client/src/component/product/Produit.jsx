import React, { useEffect, useState } from 'react';

import items from '../../assests/ClientItems';

import {
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap';

import './css/produits.css';

export default function Produit(props) {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/products/' + props.match.params.id)
            .then(res => res.json())
            .then((res) => {
                if (res.status === 'OK') {
                    setProduct(res.product);
                }
            }, (err) => {
                console.log(err)
            })
        return () => {
        };
    }, []);

    return (
        <Container className='main-container'>
            <Row>
                <Col xs={6}>
                    <h1>{product.name}</h1>
                    <p id='product-price'>{product.price}</p>
                    <p id='product-stock'>{product.stock}</p>
                    <p id='product-brand'>{product.brand}</p>
                    <p id='product-category'>{product.category}</p>
                    <p>{product.description}</p>
                </Col>
                <Col xs={6} className='text-center'>
                    <img className='img-fluid' src={'http://localhost:8000' + product.image} />
                    <Button variant='info'
                        id='product-add'
                        onClick={() => { items.addItem(product) }}>Ajouter au panier</Button>
                </Col>
            </Row>
        </Container>
    )
}