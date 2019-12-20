import React from "react";
import PropTypes from "prop-types";

import PaginatedTable from "../common/utils/PaginatedTable";

const SalesList = ({ onRowClick }) => {
    const salesHeaders = [
        { index: "id", value: "Sale id" },
        { index: "product", value: "Product" },
        { index: "quantity", value: "Quantity" },
        { index: "value", value: "Value (€)" },
        { index: "date", value: "Date" },
    ];

    return (
        <PaginatedTable
            endpoint="/api/sales/list"
            header="Sales List"
            tableHeaders={salesHeaders}
            pageSize={15}
            list="salesList"
            onRowClick={onRowClick}
        />
    );
};

SalesList.propTypes = {
    onRowClick: PropTypes.func.isRequired,
}

export default SalesList;