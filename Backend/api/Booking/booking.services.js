const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");
const { genSaltSync, hashSync } = require("bcrypt");

module.exports = {
    creates: (data, callBack) => {
        const serve = data.serve;
        const token = Math.floor(Math.random() * (999999999999 - 111111111111) + 111111111111);
        const student_id = data.student_id;


        pool.query(
            'SELECT * FROM users WHERE id = ?',
            [student_id],
            (error, results) => {

                if(error){
                    return callBack(error);
                }else if(results){
                    if(data.cart_item.length>0){
                         const insertData = data.cart_item.map((item) => {
                        return [token, item.id, item.quantity];
                    });
                        pool.query(
                        `INSERT INTO temp(token_number,item_id,quantity) VALUES ?`,
                        [insertData],
                        (err, results) => {
                            if (err) {
                                return callBack(err);
                            }
                            else {
                                var date = new Date();


                                pool.query(
                                    'INSERT INTO booking (student_id, barcode_number, serving_time, booking_status, booking_date, program_date,place_id,program) VALUES (?, ?, ?, ?,?,?,?,?)',
                                    [student_id, token, serve, 'Order Placed', date, data.programDate,data.placeID,data.program],

                                    (error, results) => {
                                        if (error) {
                                            return callBack(error);
                                        } else {

                                            return callBack(null, results);
                                        }
                                    }
                                );
                            };
                        }
                    );
                    }else{
                        return callBack("cart cannot be empty");
                    }
                }else {
                    error = "data not found";
                    return callBack(error);
                }
                
            }
        );

    },
    getsById: (id, newbalance, callBack) => {
        pool.query(
            `SELECT balance FROM student WHERE id = ?`,
            [id],
            (err, results, fields) => {
                if (err) {
                    return callBack(err);
                } else if (results.length === 0) {
                    err = "Data not found";
                    return callBack(err);
                } else {
                    const currentBalance = parseInt(results[0].balance);
                    const updatedBalance = parseInt(currentBalance) + parseInt(newbalance);

                    pool.query(
                        `UPDATE student SET balance = ? WHERE id = ?`,
                        [updatedBalance, id],
                        (updateErr, updateResults) => {
                            if (updateErr) {
                                return callBack(updateErr);
                            }
                            return callBack(null, updatedBalance);
                        }
                    );
                }
            }
        );
    },
    //getting the products data
    gets: (callBack) => {
        pool.query(
            `SELECT booking.id,users.first_name,users.email,users.contact,place_master.place_name,booking.booking_status,booking.program_date,booking.program,booking.barcode_number,booking.booking_date FROM booking join users on users.id=booking.student_id join place_master on place_master.place_id=booking.place_id`,
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
    updates: (data, id, callBack) => {
        pool.query(
            `select * from student where  id = ?`,
            [
                id
            ],
            (err, results) => {
                if (results == "") {
                    pool.query(
                        `UPDATE student SET student_name=?,student_email=?,student_contact=?,student_image=?,balance=?,student_status=? WHERE  id = ?`,
                        [
                            data.student_name,
                            data.student_email,
                            data.student_contact,
                            data.student_image,
                            data.balance,
                            data.student_status,
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
    updateBookingStatus: (data, callBack) => {
        pool.query(
            `select * from booking where  barcode_number = ? and booking_status = 'Order Placed'`,
            [
                data.barcode_number
            ],
            (err, results) => {
                if(err){
                    return callBack(err);
                }else if (results == "") {
                    return callBack("Token Number doesnot exist");
                } else{
                    pool.query(
                        `UPDATE booking SET booking_status=? WHERE  barcode_number = ?`,
                        [
                            "Paid",
                            data.barcode_number
                        ],
                        (err, results) => {
                            if (err) {
                                return callBack(err);
                            }
                            else {
                                return callBack(null, "Status Updated");
                            }
                        }
                    );
                }
            }
        );
    },
    deletesById: (id, callBack) => {
        pool.query(`delete from student where id=?`,
            [
                id
            ],
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else if (results == "") {
                    return callBack("Data not found");
                } else {
                    message = "Data deleted successfully";
                    return callBack(null, message);
                }
            }
        );
    },




};
