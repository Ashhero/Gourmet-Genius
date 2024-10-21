const { create, getById , get, update, deleteById, updateBookingStatus} = require("./booking.controller");
const router = require("express").Router();


router.post("/add", create)
        .post("/:id/added", getById)
        .get("/", get)
        .post("/bookingStatusUpdate", updateBookingStatus)
        .post("/:id/update", update)
        .delete("/:id/delete", deleteById);

module.exports = router;