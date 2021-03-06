const express = require('express');
const router = express.Router();
const { requestPrimavera } = require("../utils/api/jasmin");
const { extractTimestamp } = require("../utils/regex");
const { getSupplierOrders } = require("../utils/purchases");

router.get("/monthly", (_req, res) => {
    requestPrimavera("/invoiceReceipt/invoices").then(
        (purchasesData) => {
            const purchasesByTimestamp = {};

            const response = {
                purchasesByTimestamp: {}
            };

            purchasesData.forEach((purchase) => {
                const timestamp = extractTimestamp(purchase.documentDate.split("T")[0]);

                if (purchasesByTimestamp[timestamp] == undefined) {
                    purchasesByTimestamp[timestamp] = 0;
                }

                purchasesByTimestamp[timestamp] += purchase.payableAmount.amount;
            });

            Object.keys(purchasesByTimestamp).sort().forEach((key) => {
                response.purchasesByTimestamp[key] = purchasesByTimestamp[key];
            });
            res.json(response);
        }
    ).catch(
        () => {
            var err = new Error("Failed to fetch purchases");
            err.status = 401;
            res.json({
                message: err.message,
                error: err
            });
        }
    );
});

router.get("/list", (req, res) => {
    requestPrimavera("/purchases/orders").then(
        (purchasesData) => {

            const page = req.query.page || 1;
            const pageSize = req.query.pageSize || 15;

            const purchasesList = [];

            purchasesData.forEach((document) => {
                purchasesList.push({
                    supplierName: document.sellerSupplierPartyName,
                    supplierTaxID: document.sellerSupplierPartyTaxId,
                    totalValue: new Intl.NumberFormat('en-UK').format(document.payableAmount.amount),
                    date: document.exchangeRateDate.split("T")[0],
                    purchaseId: document.documentLines[0].orderId,
                });
            });

            res.json({
                purchasesList: purchasesList.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1;
                    }

                    else if (a.date > b.date) {
                        return -1;
                    }

                    return 0;
                }).slice((page - 1) * pageSize, page * pageSize)
            });
        }
    );
});

router.get("/suppliers", (req, res) => {
    requestPrimavera("/purchases/orders").then(
        (suppliersData) => {

            const page = req.query.page || 1;
            const pageSize = req.query.pageSize || 15;

            const suppliers = [];
            suppliersData.forEach((supplier) => {
                const accumulator = supplier.documentLines.reduce((accumulator, order) => {
                    accumulator.quantity += order.quantity;
                    accumulator.totalPrice += order.unitPrice.amount;
                    accumulator.num++;
                    return accumulator;
                }, { quantity: 0, totalPrice: 0, num: 0 });
                suppliers.push({
                    supplierName: supplier.sellerSupplierPartyName,
                    supplierKey: supplier.sellerSupplierParty,
                    quantity: accumulator.quantity,
                    priceRatio: (accumulator.totalPrice / accumulator.num).toFixed(2)
                });

            });
            res.json({
                suppliers: suppliers.sort((a, b) => {
                    if (a.priceRatio > b.priceRatio) {
                        return 1;
                    }

                    else if (a.priceRatio < b.priceRatio) {
                        return -1;
                    }

                    return 0;
                }).slice((page - 1) * pageSize, page * pageSize)
            });
        }
    ).catch(
        (e) => {
            var err = new Error("Failed to fetch supplier");
            err.status = 500;
            res.json({
                message: err.message,
                error: err
            });
            throw e;
        }
    );
});

router.get("/debt", (_req, res) => {
    requestPrimavera("/purchases/orders").then(
        async (orderData) => {

            const totalOrders = orderData.reduce((acumulator, order) => {
                if (order.documentStatus == "2") {
                    acumulator += order.payableAmount.amount
                }
                return acumulator;
            }, 0);

            const invoiceData = await requestPrimavera("/accountsPayable/payments");

            const totalPaid = invoiceData.reduce((acumulator, invoice) => {
                acumulator += invoice.payableAmount.amount
                return acumulator;
            }, 0);

            const debt = totalOrders - totalPaid;

            res.json({ debt: new Intl.NumberFormat('en-UK').format(debt) });
        }
    ).catch(
        () => {
            var err = new Error("Failed to fetch debt");
            err.status = 401;
            res.json({
                message: err.message,
                error: err
            });
        }
    );
});

router.get("/:purchaseKey", (req, res) => {
    const key = req.params.purchaseKey;

    requestPrimavera(`/purchases/orders/${key}`).then(async (order) => {

        const purchasesList = [];

        order.documentLines.forEach((purchase) => {
            purchasesList.push({
                productName: purchase.description,
                productQuantity: purchase.quantity,
                productValue: purchase.lineExtensionAmount.amount,
            });
        });

        res.json({
            supplierName: order.sellerSupplierPartyName,
            supplierTaxID: order.sellerSupplierPartyTaxId,
            totalValue: order.payableAmount.amount,
            date: order.documentDate.split("T")[0],
            purchaseId: order.documentLines.orderId,
            purchasesList: purchasesList
        });
    }).catch(
        () => {
            var err = new Error("Failed to fetch order");
            err.status = 401;
            res.json({
                message: err.message,
                error: err
            });
        }
    );
});

router.get("/suppliers/:supplierKey", (req, res) => {
    const key = req.params.supplierKey;

    requestPrimavera(`/purchasesCore/supplierParties/${key}`).then(
        async (supplier) => {

            const orders = await requestPrimavera("/purchases/orders");

            res.json({
                supplierId: supplier.companyTaxID,
                supplierKey: supplier.partyKey,
                name: supplier.name,
                telephone: supplier.telephone,
                country: supplier.countryDescription,
            });
        }
    ).catch(() => {
        const err = new Error("Failed to fetch supplier information");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
});

router.get("/suppliers/orders/:supplierKey", (req, res) => {
    const key = req.params.supplierKey;

    requestPrimavera(`/purchasesCore/supplierParties/${key}`).then(
        async (supplier) => {

            const page = req.query.page || 1;
            const pageSize = req.query.pageSize || 15;

            const orders = await requestPrimavera("/purchases/orders");

            const info = getSupplierOrders(supplier.companyTaxID, orders).sort((a, b) => {
                if (a.value > b.value) {
                    return 1;
                }
    
                if (a.value < b.value) {
                    return -1;
                }
    
                return 0;
            }).slice((page - 1) * pageSize, page * pageSize);;

            res.json({
                orders: info
            });
        }
    ).catch(() => {
        const err = new Error("Failed to fetch supplier orders");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
});

module.exports = router;