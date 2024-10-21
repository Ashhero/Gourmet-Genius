const { create, getById,updatebyId, getData,deleteById,getOrders,getUserTrackNo,updatePayment } = require('./checkout.controller');
const router = require("express").Router();

router.post("/add", create)
        .get("/:id", getById)
        .post("/getOrders",getOrders)
        .post("/updatePayment",updatePayment)
        .post("/getUserTrackNo", getUserTrackNo)
        .post("/:id/update", updatebyId)
        .get("/", getData)
        .delete("/:id/delete",deleteById);


module.exports = router;


