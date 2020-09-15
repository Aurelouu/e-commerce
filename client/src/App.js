import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes/Routes';

import './assests/css/bootstrap.min.css';
import './assests/css/fonts.css';
import './assests/css/main.css';

export default function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}