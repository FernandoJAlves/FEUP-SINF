import React from "react";
import { navigate } from "@reach/router";

import PaginatedTable from "../common/utils/PaginatedTable";

const ProductsList = () => {
    const onRowClick = ({ id }) => {
        navigate(`/stocks/product/${id}`);
    }

    const productHeaders = [
        { index: "name", value: "Name" },
        { index: "quantity", value: "Quantity (kg)" },
        { index: "value", value: "Value (€/kg)" },
    ];

    return (
        <PaginatedTable
            endpoint="/api/stocks/products"
            header="Products List"
            tableHeaders={productHeaders}
            pageSize={10}
            list="products"
            onRowClick={onRowClick}
        />
    );
};

export default ProductsList;