const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");



module.exports = {

    creates: (data, callBack) => {
        pool.query(
            `SELECT * FROM trackorder WHERE userid = ? AND status = ? LIMIT 1`,
            [data.userid, "initiated"],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }

                var trackno = "BBORD3TRC202" + Math.floor(Math.random() * 90000 + 10000);
                const status = "initiated";
                const remark = "order has been initiated";
                const date = new Date();

                

                if (results.length === 0) {
                    pool.query(
                        `INSERT INTO trackorder(userid, trackno, status, remark, date) VALUES (?,?,?,?,?)`,
                        [data.userid, trackno, status, remark, date],
                        (error, res) => {
                            if (error) {
                                return callBack(error);
                            } else {
                                const message = {
                                    trackno: trackno,
                                    message: "Trackno added successfully"
                                };
                                const orderDate = new Date();

                                if (typeof data.cartList != "undefined") {
                                    pool.query(
                                        `INSERT INTO orders(userid, trackid, productId, quantity, orderStatus, order_remark, orderDate) VALUES (?,?,?,?,?,?,?)`,
                                        [data.userid, res.insertId, data.cartList.id, data.cartList.quantity, status, remark, orderDate],
                                        (error) => {
                                            if (error) {
                                                return callBack(error);
                                            }
                                            // Note: This code block doesn't return anything. Consider what you want to do here.
                                        }
                                    );

                                    return callBack(null, "Data added successfully");
                                }
                            }
                        }
                    );
                } else {
                    trackno = results[0].id;
                    const orderDate = new Date();
                    if (typeof data.cartList != "undefined") {
                        pool.query(`select *  from orders where trackid = ? and productId =?`,
                            [trackno, data.cartList.id],
                            (error, results) => {
                                if (error) {
                                    return callBack(error);
                                }
                                if (results.length == 0) {
                                    pool.query(
                                        `INSERT INTO orders(userid, trackid, productId, quantity, orderStatus, order_remark, orderDate) VALUES (?,?,?,?,?,?,?)`,
                                        [data.userid, trackno, data.cartList.id, data.cartList.quantity, status, remark, orderDate],
                                        (error) => {
                                            if (error) {
                                                return callBack(error);
                                            }
                                            // Note: This code block doesn't return anything. Consider what you want to do here.
                                            return callBack(null, "Data added successfully");
                                        }
                                    );
                                } else {
                                    var qty = Number(results[0].quantity) + (data.cartList.quantity);
                                    pool.query(
                                        `UPDATE orders SET quantity = ? where productId = ? and trackid = ? `,
                                        [qty, data.cartList.id, trackno],
                                        (error) => {
                                            if (error) {
                                                return callBack(error);
                                            }
                                            // Note: This code block doesn't return anything. Consider what you want to do here.
                                            return callBack(null, "Data added successfully");
                                        }
                                    );
                                }
                            }
                        );

                    }
                }
            }
        );
    },

    getOrders:(data,callBack) => {
        pool.query(`SELECT orders.*, product.price FROM orders INNER JOIN product on orders.productId =  product.id where userid = ?`,
          [data.userid],
          (error,results) => {
                if(error){
                    return callBack(error);
                }
                if(results.length == 0){
                    return callBack("Data not found");
                }
                if(results){
                    return callBack(null,results);
                }
            }        
        );
    },

    updatePayment:(data,callBack) => {
        pool.query(`SELECT orders.*, product.price FROM orders INNER JOIN product on orders.productId = product.id where orders.userid = ? AND orders.orderStatus = "initiated"`,
            [data.userid],
            (error,results) => {
                if(error){
                    return callBack(error)
                }if(results.length == 0){
                    return callBack("Data not found");
                }
                if(results){
                    var trkno = results[0].trackid;
                    results.forEach(item => {
                        const quantity = parseInt(item.quantity);
                        const price = parseFloat(item.price);
                        item.totalPrice = quantity * price;                        
                    });
                    
                    // Calculate the overall total by summing up the total prices of all items
                    const overallTotal = results.reduce((total, item) => total + item.totalPrice, 0);

                    var paymentno = "PAYMENT_" + Math.floor(Math.random() * 90000 + 10000);
                    const date = new Date();
                    pool.query(`INSERT INTO user_payment(payment_no, user_id, amount, payment_status, track_id, date) VALUES (?,?,?,?,?,?)`,
                        [paymentno,data.userid,overallTotal,"Paid",trkno,date],
                        (error,paymentRes) => {
                            if(error){
                                return callBack(error);
                            }
                            if(paymentRes){
                                pool.query(`update orders set payment_id = ? , orderStatus = ? where trackid = ?`,
                                    [paymentRes.insertId,"Paid",trkno],
                                    (error,orderUpdateSatus)=> {
                                        if(error){
                                            return callBack(error);
                                        }
                                        if(orderUpdateSatus){
                                            pool.query(`update trackorder set status = ? where id = ?`,
                                                ["Paid",trkno],
                                                (error,trackorderUpdateSatus)=> {
                                                    if(error){
                                                        return callBack(error);
                                                    }
                                                    if(trackorderUpdateSatus){
                                                        return callBack(null,"payment Done");
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                    
                    
                }
            }
        )
    
    },

    getUserTrackNo:(data,callBack) => {
        pool.query('SELECT * FROM `trackorder` where userid = ?',
            [data.userid],
            (error,results) => {
                if(error){
                    return callBack(error);
                }if(results.length == 0){
                    return callBack("Data not found");
                }
                if(results){
                    return callBack(null,results);
                }
            }
        );
    },

    getByIDs: (id, callBack) => {
        pool.query(
            `select * from section where id = ?`,
            [id],
            (err, results, fields) => {
                if (err) {
                    return callBack(err);
                }
                else if (results == "") {
                    err = "Data not found";
                    return callBack(err)
                } else {
                    return callBack(null, results);
                }

            }
        );
    },
    //getting the products data
    getDatas: (callBack) => {
        pool.query(
            `select * from section`,
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else if (results == "") {
                    err = "Data Not Found";
                    return callBack(err);
                } else {
                    return callBack(null, results);
                }

            }
        );
    },
    updatebyIds: (data, id, callBack) => {
        pool.query(
            `select * from section where secName = ? and id <> ?`,
            [
                data.secName,
                id
            ],
            (err, results) => {
                if (results == "") {
                    pool.query(
                        `UPDATE section SET secName=?,secDesc=?,did WHERE  id = ?`,
                        [
                            data.secName,
                            data.secDesc,
                            data.did,
                            id
                        ],
                        (err, results) => {
                            if (err) {
                                return callBack(err);
                            }
                            else {
                                return callBack(null, results);
                            }
                        }
                    );
                } else if (err) {
                    return callBack(err);
                } else {
                    err = "Data Found Duplicate";
                    return callBack(err);
                }
            }
        );
    },
    deleteByIds: (id, callBack) => {
        pool.query(
            `delete from section  where id = ?`,
            [id],
            (err, results, fields) => {
                if (err) {
                    return callBack(err);
                }
                else if (results == "") {
                    err = "Data not found";
                    return callBack(err)
                } else {
                    return callBack(null, results);
                }
            }
        );
    },

};





