const router = require("express").Router();
const userRouter=require("../Users/user.router");
const authRouter=require("../Auth/auth.router");
const userregisterRouter = require("../UserRegister/Reg.router");
const departmentRouter=require("../Department/dept.router");
const categoryRouter=require("../Category/cat.router");
const productRouter=require("../Products/product.router");
const trackRouter=require("../Purchase_Track/track.router");
const purchaseRouter=require("../Purchase/purchase.router");
const checkoutRouter=require("../Checkout/checkout.router");
const paymentRouter=require("../Payment/payment.router");
const bookingRouter = require("../Booking/booking.router");
const orderRouter=require("../Order/order.router");
const placeRouter = require("../Place/cat.router");
const ngoRouter = require("../Ngo/ngo.router");
const empRouter = require("../Employee/emp.router");
const foodRouter = require("../Food/food.router");

const {verifyToken} = require("../Auth/auth.controller");


router.use("/api/users",userRouter);
router.use("/api/auth",authRouter);
router.use("/api/userRegister",userregisterRouter);
router.use("/api/department",departmentRouter);
router.use("/api/category",categoryRouter);
router.use("/api/products",productRouter);
router.use("/api/track",trackRouter);
router.use("/api/purchase",purchaseRouter);
router.use("/api/checkout",checkoutRouter);
router.use("/api/payment",paymentRouter);
router.use("/api/order",orderRouter);
router.use("/api/place",placeRouter);
router.use("/api/ngo",ngoRouter);
router.use("/api/employee",empRouter);
router.use("/api/food",foodRouter);


//cafe
router.use("/api/booking",bookingRouter);

module.exports = router; 