import React from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import SidebarStyles from "../../../../styles/common/sidebar.module.css";

const SidebarItem = ({ path, label, active }) => (
    <li className={SidebarStyles.item + (active ? " " + SidebarStyles.active : "")}>
        <Link
            to={path}
            className={SidebarStyles.link}
        >
            {label}
        </Link>
    </li>
)

SidebarItem.propTypes = {
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
}

export default SidebarItem