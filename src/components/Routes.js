import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './Home';
import About from './About';
import Logout from './Logout';
import Header from './Header';
import Product from './Product';
import Cart from './Cart';
import Login from './Login';
import Dashboard from "./admin/Dashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";

const Routes = ({ setToken, token, isAdmin }) => {
  return (
    <Router>
        <Header isAdmin = {isAdmin}/>
        <Switch>
          <Route path='/admin/dashboard'><Dashboard/></Route>
          <Route path='/admin/add/category'><AddCategory token={token}/></Route>
          <Route path='/admin/add/product'><AddProduct token={token}/></Route>
          <Route path="/login"> <Login setToken={setToken}/> </Route>
          <Route path="/profile"> <About /> </Route>
          <Route path="/product/:category_id"> <Product token={token}/> </Route>
          <Route path="/cart"> <Cart token={token}/> </Route>
          <Route path="/logout"> <Logout /> </Route>
          <Route path='/'><Home token={token}/></Route>
        </Switch>
      </Router>
  );
};

export default Routes;