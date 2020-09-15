import React, { useState } from 'react';

import {
  Switch,
  Route,
  withRouter,
  Redirect
} from 'react-router-dom';

import auth from '../assests/ClientAuth';

// Assets
import Header from '../assests/components/Header';
import Footer from '../assests/components/Footer';
import Cart from '../assests/components/Cart';
import NotFound from '../assests/components/NotFound';
// All components
import DernieresSorties from '../assests/components/DernieresSorties';
import Produit from '../component/product/Produit';
// Not connected components
import InscriptionForm from '../component/user/InscriptionForm';
import ConnexionForm from '../component/user/ConnexionForm';
// Connected components
import Profil from '../component/user/Profil';
// Admin components
import Panel from '../component/admin/Panel';
import ListeUtilisateurs from '../component/admin/ListeUtilisateurs';
import ListeProduits from '../component/admin/ListeProduits';
import ProduitForm from '../component/admin/ProduitForm';
import ListeCategories from '../component/admin/ListeCategories';
import ListeMarques from '../component/admin/ListeMarques';

const ConnectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isLoggedIn()
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

const NotConnectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isLoggedIn()
      ? <Redirect to='/' />
      : <Component {...props} />
  )} />
)

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAdmin()
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

function Routes() {
  const [products, setProducts] = useState([]);

  return (
    <div className='app'>
      <Cart setProducts={setProducts} products={products} />
      <Header />
      <Switch>
        <AdminRoute path='/admin' exact component={Panel} />
        <AdminRoute path='/admin/utilisateurs' exact component={ListeUtilisateurs} />
        <AdminRoute path='/admin/produits' exact component={ListeProduits} />
        <AdminRoute path='/admin/produits/ajouter' exact component={ProduitForm} />
        <AdminRoute path='/admin/categories' exact component={ListeCategories} />
        <AdminRoute path='/admin/marques' exact component={ListeMarques} />
        <NotConnectedRoute exact path='/inscription' component={InscriptionForm} />
        <NotConnectedRoute exact path='/connexion' component={ConnexionForm} />
        <ConnectedRoute exact path='/profil' component={Profil} />
        <Route exact path='/' component={DernieresSorties} />
        <Route exact path='/produit/:id' render={(props) => <Produit {...props} setProducts={setProducts} />} />
        <Route path='*' component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}
export default withRouter(Routes);