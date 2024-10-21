const { create, getById , get, update, deleteById,getStud,getStudDet,getBookings,getBooking} = require("./order.controller");
const router = require("express").Router();


router.post("/add", create)
        .post("/:id/added", getById)
        .get("/", get)
        // .get("/:barcode_number",getStud)//to display student detail and token number
        .post("/getBarcodeItems",getStudDet)//to display item,qty,price,total
        .post("/:id/update", update)
        .post("/:id/getBookings",getBookings)
        .post("/getBookings",getBooking)

        .delete("/:id/delete", deleteById);

module.exports = router;