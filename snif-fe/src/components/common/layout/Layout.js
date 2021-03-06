import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Loading from "./Loading";
import Navbar from "./Navbar";
import Sidebar from "./sidebar/SidebarContainer";

import LayoutStyles from "../../../styles/common/layout.module.css";

const Layout = ({ path, navbar, sidebar, children }) => {
    const checkingToken = useSelector(state => state.auth.checkingToken);

    const [collapsed, setCollapsed] = useState(true);

    const openSidebar = () => setCollapsed(false);
    const closeSidebar = () => setCollapsed(true);

    return (
        <React.Fragment>
            {navbar && <Navbar openSidebar={openSidebar} sidebar={sidebar} />}
            {sidebar && <Sidebar path={path} collapsed={collapsed} closeSidebar={closeSidebar} />}
            <div className={(navbar ? LayoutStyles.layoutContainer + " px-5 pb-5" : LayoutStyles.layoutContainerNoNav) }>
                {checkingToken ? <Loading navbar={navbar} /> : children}
            </div>
        </React.Fragment>
    );
};

Layout.propTypes = {
    navbar: PropTypes.bool,
    sidebar: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export default Layout;
