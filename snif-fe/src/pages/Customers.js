import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";

import Layout from "../components/common/layout/Layout";
import PaginatedTable from "../components/common/utils/PaginatedTable";

const Customers = ({ path }) => {

    const onRowClick = ({ data }) => {
        // console.log(data);
        navigate(`/customers/${data.customerKey}`);
    };

    const customersHeaders = [
        { index: "name", value: "Name" },
        { index: "lastDate", value: "Date of last order" },
        { index: "totalOrders", value: "Total orders" },
        { index: "value", value: "Value of orders (€)" },
    ];

    return (
        <Layout navbar sidebar path={path}>
            <Container>
                <Row className="mb-5">
                    <Col xs="12">
                        <PaginatedTable
                            endpoint="/api/customers"
                            headers={customersHeaders}
                            pageSize={15}
                            list="customers"
                            onRowClick={onRowClick}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

Customers.propTypes = {
    path: PropTypes.string.isRequired,
};

export default Customers;
