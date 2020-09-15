import React, { useEffect, useState } from "react";

import { Link, withRouter } from 'react-router-dom';

import logo from '../img/logo.png';

import './css/footer.css';

function Footer(props) {
    const [stick, setStick] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const mainContainer = document.getElementsByClassName('main-container');


            if (mainContainer.length > 0) {
                setStick(false);
            }

            if (mainContainer[0] !== undefined) {
                console.log(mainContainer[0].scrollHeight)
                if (mainContainer[0].scrollHeight < 700) {
                    setStick(true);
                }
            }
        }, 1500);
        return () => {
        };
    }, []);

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
                <footer id='footer' className={stick ? 'stick-bottom' : ''}>
                    <div className="row" id='footer-container'>
                        <div className="col-2">
                            <img className="mb-2" src={logo} alt="logo" width="75" height="75" />
                            <small className="d-block text-muted">© Team Snain 2020</small>
                            <small className="d-block text-muted">Roth Aurélie</small>
                            <small className="d-block text-muted">Voisin-triboulet Arnaud-Léandre</small>
                            <small className="d-block text-muted">Yaffa Dahaba</small>
                            <small className="d-block text-muted">Baly Mona</small>
                            <small className="d-block text-muted">Clain Alexandre</small>
                        </div>
                        <div className="col-2">
                            <h5>Nos références</h5>
                            <ul className="list-unstyled text-small">
                                <li><Link className="text-muted" to="/produits?brand='Rossignol'">Rossignol</Link></li>
                                <li><Link className="text-muted" to="/produits?brand='Dynastar'">Dynastar</Link></li>
                                <li><Link className="text-muted" to="/produits?brand='Salomon'">Salomon</Link></li>
                                <li><Link className="text-muted" to="/produits?brand='Fischer'">Fischer</Link></li>
                            </ul>
                        </div>
                        <div className="col-2">
                            <h5>Resources</h5>
                            <ul className="list-unstyled text-small">
                                <li><Link className="text-muted" to="#">Resource</Link></li>
                                <li><Link className="text-muted" to="#">Resource name</Link></li>
                                <li><Link className="text-muted" to="#">Another resource</Link></li>
                                <li><Link className="text-muted" to="#">Final resource</Link></li>
                            </ul>
                        </div>
                        <div className="col-2">
                            <h5>About</h5>
                            <ul className="list-unstyled text-small">
                                <li><Link className="text-muted" to="#">Team</Link></li>
                                <li><Link className="text-muted" to="#">Locations</Link></li>
                                <li><Link className="text-muted" to="#">Privacy</Link></li>
                                <li><Link className="text-muted" to="#">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            ) : (null)}
        </>
    );
}

export default withRouter(Footer);