import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Axios from "axios";

import Layout from "../components/common/layout/Layout";
import Popup from "../components/common/utils/Popup";
import ContentCard from "../components/common/utils/ContentCard";
import CustomerStyles from "../styles/customer/Customer.module.css";
import { ReactComponent as Contact } from "../assets/phone-solid.svg";
import { ReactComponent as Country } from "../assets/globe-solid.svg";
import SalesList from "../components/customer/SalesList";
import OrdersList from "../components/customer/OrdersList";

const Supplier = ({ supplierKey }) => {
    const [loading, setLoading] = useState(true);
    const [supplierData, setSupplierData] = useState({});

    useEffect(() => {
        Axios.get(`http://localhost:9000/api/purchases/suppliers/${supplierKey}`, {
            headers: {
                auth_token: localStorage.getItem("auth_token"),
            },
        }).then(({ data }) => {
            setSupplierData(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [supplierKey]);

    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const toggle = () => {
        setModal(!modal);
        setModalData({});
    };
    const onRowClick = (data) => {
        setModal(!modal);
        setModalData(data);
    };
    const productHeaders = [
        { index: "id", value: "Order id" },
        { index: "product", value: "Product" },
        { index: "state", value: "State" },
        { index: "quantity", value: "Quantity" },
        { index: "value", value: "Value (€)" },
        { index: "date", value: "Date" },
    ];

    return (
        <Layout navbar sidebar path="/">
            <Container>
                <Row>
                    <Col xs="12" className={`${CustomerStyles.pageHeader} mb-5 h1`}>
                        {supplierData.name}
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col xs="12">
                        <ContentCard loading={loading} header="General Information">
                            <div className="w-100">
                                <div className="my-3">
                                    <Contact className={CustomerStyles.icon} />
                                    <span className={CustomerStyles.text}>
                                        {supplierData.telephone}
                                    </span>
                                </div>
                                <div className="my-3">
                                    <Country className={CustomerStyles.icon} />
                                    <span className={CustomerStyles.text}>
                                        {supplierData.country}
                                    </span>
                                </div>
                            </div>
                        </ContentCard>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col xs="12">
                        <OrdersList onRowClick={onRowClick} />
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col xs="12">
                        <SalesList onRowClick={onRowClick} />
                    </Col>
                </Row>
            </Container>
            <Popup isOpen={modal} toggle={toggle} headers={productHeaders} data={modalData} />
        </Layout>
    );
};

Supplier.propTypes = {
    supplierKey: PropTypes.string,
};
export default Supplier;
