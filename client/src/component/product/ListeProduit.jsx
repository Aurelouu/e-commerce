import React from 'react';

import {
    Col,
    Card
} from 'react-bootstrap';

import './css/liste_produits.css';

export default function ListeProduit(props) {

    return (
        <>
            {
                props.products.map((product, i) =>
                    <Col key={i} className="col-md-3">
                        <Card className="mb-4 shadow-sm">
                            <img className="card-img-top" alt='product' src={'http://localhost:8000' + product.image} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text className='card-brand'>{product.brand}</Card.Text>
                                <Card.Text className='card-price'>{product.price}</Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="btn-group">
                                        <a href={'/produit/' + product.id}>
                                            <button type="button" className="btn btn-sm btn-outline-success card-button">
                                                Consulter
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            }
        </>
    )
}