const { createProduct, getProductById , getProducts, updateProduct, deleteProductById,getsearchedProducts} = require("./product.controller");
const router = require("express").Router();


router.post("/add", createProduct)
        .get("/:id", getProductById)
        .get("/", getProducts)
        .post("/search",getsearchedProducts)
        .post("/:id/update", updateProduct)
        .delete("/:id/delete", deleteProductById);

module.exports = router;

//localhost:3006/api/products/1  getdata




