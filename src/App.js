import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Transaction from "./pages/Transaction.jsx";
import Account from "./pages/Account.jsx";
import Channel from "./pages/Channel.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact component={Home} path="/"/>
        <Route exact component={Transaction} path="/tx/:hash"/>
        <Route exact component={Account} path="/account/:address"/>
        <Route exact component={Channel} path="/channel/:from/:to"/>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
