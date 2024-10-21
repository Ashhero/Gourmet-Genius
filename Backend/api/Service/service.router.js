const { create, getById,updatebyId,getdatasolve,serviceData, getData,deleteById, serviceMonths } = require('./service.controller');
const router = require("express").Router();

router.post("/add", create)
        .get("/:id/get", getById)        
        .get("/pending", getData)//to display pending
        .post("/:id/update", updatebyId)
        .get("/getdatasolve", getdatasolve)//to display only solved
        .get("/serviceData", serviceData)//to display both pending and solved.
        .get("/servicemonth",serviceMonths)//to get service present month
        .delete("/:id/delete",deleteById);



      
module.exports = router;


