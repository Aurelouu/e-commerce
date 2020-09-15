import React, { useState, useEffect } from 'react';

import {
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap';

import './css/produit_form.css';

export default function ProduitForm() {
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState([]);

    const handleInput = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    }

    const addProduct = () => {
        fetch('http://localhost:8000/product/create', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === 'ERROR') {
                    setErrors(res.errors);
                    return false;
                }
                if (res.status === 'OK') {
                    window.location.href = '/admin/produits';
                    return true;
                }
            }, (err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetch('http://localhost:8000/categories')
            .then(res => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === 'OK') {
                    setCategories(res.categories);
                }
            })

        fetch('http://localhost:8000/brands')
            .then(res => res.json())
            .then((res) => {
                if (res.status === 'OK') {
                    setBrands(res.brands);
                }
            })
        return () => { };
    }, []);

    return (
        <Container className='main-container'>
            <Row>
                <Col xs={6}>
                    <label for='name'>Titre</label>
                    <input onChange={e => { handleInput(e) }} type='text' id='name' name='name' className='form-control'></input>
                    {errors['name'] !== undefined ? (
                        <p className='error-text'>{errors['name'][0]}</p>
                    ) : (null)}
                    <label for='price'>Prix</label>
                    <input onChange={e => { handleInput(e) }} type='text' id='price' name='price' className='form-control'></input>
                    {errors['price'] !== undefined ? (
                        <p className='error-text'>{errors['price'][0]}</p>
                    ) : (null)}
                </Col>
                <Col xs={6}>
                    <label for='category'>Catégorie</label>
                    <select onChange={e => { handleInput(e) }} name='category' className='custom-select'>
                        <option value=''></option>
                        {categories.map((category, i) =>
                            <option key={i} value={category.name}>{category.name}</option>
                        )}
                    </select>
                    {errors['category'] !== undefined ? (
                        <p className='error-text'>{errors['category'][0]}</p>
                    ) : (null)}
                    <label for='brand'>Marque</label>
                    <select onChange={e => { handleInput(e) }} name='brand' className='custom-select'>
                        <option value=''></option>
                        {brands.map((brand, i) =>
                            <option key={i} value={brand.name}>{brand.name}</option>
                        )}
                    </select>
                    {errors['brand'] !== undefined ? (
                        <p className='error-text'>{errors['brand'][0]}</p>
                    ) : (null)}
                </Col>
                <Col xs={6}>
                    <label for='stock'>Stock</label>
                    <input onChange={e => { handleInput(e) }} className='form-control' type='number' id='stock' name='stock'></input>
                    {errors['stock'] !== undefined ? (
                        <p className='error-text'>{errors['stock'][0]}</p>
                    ) : (null)}
                </Col>
                <Col xs={12}>
                    <label for='description'>Description</label>
                    <br />
                    <textarea onChange={e => { handleInput(e) }} id='description' name='description'></textarea>
                    {errors['description'] !== undefined ? (
                        <p className='error-text'>{errors['description'][0]}</p>
                    ) : (null)}
                </Col>
                <Col xs={12}>
                    <label for='image'>Chemin vers l'image</label>
                    <input onChange={e => { handleInput(e) }} type='text' id='image' name='image' className='form-control'></input>
                    {errors['image'] !== undefined ? (
                        <p className='error-text'>{errors['image'][0]}</p>
                    ) : (null)}
                </Col>
                <Col id='product-submit' xs={3}>
                    <Button onClick={() => { addProduct() }} variant='success' size='lg'>Ajouter</Button>
                </Col>
            </Row>
        </Container >
    )
}