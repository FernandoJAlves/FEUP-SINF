import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Stocks from "./pages/Stocks";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Financial from "./pages/Financial";
import NotFound from "./pages/404";
import Customer from "./pages/Customer";
import Supplier from "./pages/Supplier";
import Resource from "./pages/Resource";
import Product from "./pages/Product";

import { USER_PERMISSIONS } from "./actions/AuthActions"

const ROUTES = [
    { path: "/overview", label: "Overview" },
    { path: "/sales", label: "Sales" },
    { path: "/purchases", label: "Purchases" },
    { path: "/stocks", label: "Stocks" },
    { path: "/orders", label: "Orders" },
    { path: "/customers", label: "Customers" },
    { path: "/financial", label: "Financial" },
]

const AppRouter = ({ loadUser }) => {
    const userRole = useSelector(state => state.auth.user ? state.auth.user.role : "");

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const hasPermission = path => {
        if (USER_PERMISSIONS[userRole]) {
            return USER_PERMISSIONS[userRole].includes(path);
        }
        return false;
    };

    return (
        <Router>
            <Home path="/" />
            <Login path="/login" />
            {hasPermission("/overview") && <Overview path="/overview"/>}
            {hasPermission("/sales") && <Sales path="/sales"/>}
            {hasPermission("/purchases") && <Purchases path="/purchases"/>}
            {hasPermission("/purchases") && <Supplier path="/suppliers/:supplierKey"/>}
            {hasPermission("/stocks") && <Stocks path="/stocks"/>}
            {hasPermission("/stocks") && <Resource path="/stocks/resource/:resourceKey" />}
            {hasPermission("/stocks") && <Product path="/stocks/product/:productKey" />}
            {hasPermission("/orders") && <Orders path="/orders"/>}
            {hasPermission("/customers") && <Customers path="/customers"/>}
            {hasPermission("/customers") && <Customer path="/customers/:customerKey"/>}
            {hasPermission("/financial") && <Financial path="/financial"/>}
            <NotFound default />
        </Router>
    );
};

export {
    ROUTES,
    AppRouter
};