import React, { useEffect, useState } from 'react';

import ListeProduit from '../../component/product/ListeProduit';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import './css/derniers_sorties.css';

export default function DernieresSorties() {
    const url = "http://localhost:8000";
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(url + "/products/last")
            .then(res => res.json())
            .then((res) => {
                if (res.status === 'OK') {
                    setProducts(res.products);
                }
            }, (err) => {
                console.log(err);
            })
        return () => {
        };
    }, []);

    return (
        <Container className='main-container'>
            <Row>
                <Col>
                    <h1>Dernières sorties</h1>
                </Col>
                <ListeProduit products={products} />
            </Row>
        </Container>
    )
}