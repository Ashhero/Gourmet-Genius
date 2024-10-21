const { createProduct, getProductById , getProducts, updateProduct, deleteProductById, getOnlines, getCashs,getmonths} = require("./purchase.controller");
const router = require("express").Router();


router.post("/add", createProduct)
        .get("/:id/get", getProductById)
        .get("/", getProducts)
        .get("/getmonth",getmonths)
        .post("/:id/update", updateProduct)
        .delete("/:id/delete", deleteProductById);

module.exports = router;

//localhost:3006/api/products/1  getdata




