const { createProduct, getProductById , getProducts, updateProduct, deleteProductById, getTotPrice} = require("./track.controller");
const router = require("express").Router();


router.post("/add", createProduct)
        .get("/:id", getProductById)
        .get("/", getProducts)
        .post("/getTotPrice",getTotPrice)
        .post("/:id/update", updateProduct)
        .delete("/:id/delete", deleteProductById);

module.exports = router;

//localhost:3006/api/products/1  getdata




