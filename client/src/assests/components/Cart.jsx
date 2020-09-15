import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import cartItems from '../ClientItems';

import {
    Button
} from 'react-bootstrap';

import { Cart2 } from 'react-bootstrap-icons';
import { X } from 'react-bootstrap-icons';

import './css/cart.css';

function Cart(props) {

    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [reloadState, setReloadState] = useState(false);

    useEffect(() => {
        const getItems = cartItems.getItems();

        setItems(getItems);
        return () => {
        };
    }, [reloadState]);

    const getItems = () => {
        const getItems = cartItems.getItems();
        setItems(getItems);
        setReloadState(!reloadState);
    }

    const handleCart = () => {
        getItems();
        setOpen(!open);
        setReloadState(!reloadState);
    }

    const display = () => {
        const excludedPaths = ['/connexion', '/inscription', '/admin'];
        for (let i = 0; i <= excludedPaths.length; i++) {
            if (props.location.pathname.includes(excludedPaths[i])) {
                return false;
            } else if (i === excludedPaths.length) {
                return true;
            }
        }
    }

    return (
        <>
            {display() ? (
                <div id='cart-container'>
                    {open ? (
                        <div id='cart-items'>
                            <X color='#ff2244' size={25}
                                id='cart-close'
                                onClick={() => { handleCart() }} />
                            {items.length > 0 ? (
                                <div>
                                    {items.map((item, i) =>
                                        <div key={i} className='cart-item'>
                                            <div className='cart-item-title'>
                                                <p>{item.name}</p>
                                            </div>
                                            <div className='cart-item-infos'>
                                                <p>{item.price} €</p>
                                                <p className='cart-delete-button'
                                                    onClick={() => { cartItems.deleteItem(i); setReloadState(!reloadState) }}>Supprimer</p>
                                            </div>
                                        </div>
                                    )}
                                    <p>Total: {cartItems.getTotalPrice()} €</p>
                                    <a href='/commander'>Passer commande</a>
                                </div>
                            ) : (
                                    <p>Votre panier est vide.</p>
                                )
                            }
                        </div>
                    ) : (
                            <div id='cart-icon-container'>
                                <Cart2 onClick={() => { handleCart() }} id='cart-icon' size={75} />
                                <div id='cart-items-number'>{cartItems.getNumberOfItems()}</div>
                            </div>
                        )}
                </div>
            ) : (null)}
        </>
    )
}

export default withRouter(Cart);