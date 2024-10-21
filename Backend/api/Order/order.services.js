const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");
const {genSaltSync,hashSync}=require("bcrypt");

module.exports  = {
     creates:(data, callBack) => {
        pool.query(
            `select * from student where student_email = ?`,
            [data.student_email],
            (err,results) =>{
                var date=new Date();
                if(results == ""){
                    pool.query(
                        `INSERT INTO student(student_name,student_email,student_address,student_contact,balance,student_status,student_date) VALUES (?,?,?,?,?,?,?)`,
                         [
                            data.student_name,
                            data.student_email,
                            data.student_address,
                            data.student_contact,
                            data.balance,
                            data.student_status,
                            date
                         ],
                         (err,results) =>{
                             if(err){
                                return callBack(err);   
                             }
                             else{
                                   var date=new Date();
                                   var user_type = "student";
                                   var password = "STD" + Math.floor(Math.random() * 90000 + 10000);
                                pool.query(
                                    `INSERT INTO login_master(user_name,user_email,user_type,user_password,login_date ) VALUES (?,?,?,?,?)`,
                                    [
                                        data.student_name,
                                        data.student_email,
                                        user_type,
                                        password,
                                        date
                                    ],
                                    (error)=> {
                                        if(error){
                                            return callBack(error);
                                        }else{
                                            message = {
                                                student_email:data.student_email,
                                                password:password
                                            };
                                            return callBack(null,message);
                                        }
                                    }                                    
                                );
                                
                            }

                         }
                     );
                }else if(err){
                    return callBack(err);
                }else{
                    err = "Data Found Duplicate";
                    return callBack(err);
                }
            }
         ); 
                  
     },
     getsById : (id, newbalance, callBack) => {
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
     
     gets:(callBack) => {
         pool.query(
            `SELECT booking.id,booking.barcode_number,booking.serving_time,booking.booking_status,booking.booking_date, student.student_email FROM booking INNER JOIN student ON booking.student_id = student.id`,
            (err,results) => {
                if(err){
                    return callBack(err);
                }else if(results == ""){
                    err = "Data Not Found";
                    return callBack(err);
                }else{
                    return callBack(null, results);
                }

            }
         );
     },
    getStudent:(barcode_number,callBack) => {
        pool.query(
           `SELECT booking.barcode_number, student.student_name,student.student_address,student.student_contact FROM booking INNER JOIN student ON booking.student_id = student.id where barcode_number=?`,
           [barcode_number],
           (err,results) => {
               if(err){
                   return callBack(err);
               }else if(results == ""){
                   err = "Data Not Found";
                   return callBack(err);
               }else{
                   return callBack(null, results);
               }

           }
        );
    },
    getBookings:(id,callBack)=>{
        pool.query('SELECT booking.id,users.first_name,users.email,users.contact,place_master.place_name,booking.booking_status,booking.program_date,booking.program,booking.barcode_number,booking.booking_date FROM booking join users on users.id=booking.student_id join place_master on place_master.place_id=booking.place_id where booking.student_id=?',
        [id],
            (err,res)=>{
                if(err){
                    return callBack(err);
                }else if(res == ""){
                    err = "Data Not Found";
                    return callBack(err);
                }else{
                    return callBack(null, res);
                }
            }
        );
    },
    getBookingData:(callBack)=>{
        pool.query('SELECT booking.id,users.first_name,users.email,users.contact,place_master.place_name,booking.booking_status,booking.program_date,booking.program,booking.barcode_number,booking.booking_date FROM booking join users on users.id=booking.student_id join place_master on place_master.place_id=booking.place_id',
        
            (err,res)=>{
                if(err){
                    return callBack(err);
                }else if(res == ""){
                    err = "Data Not Found";
                    return callBack(err);
                }else{
                    return callBack(null, res);
                }
            }
        );
    },
    getStudentDetail:(barcode_number,callBack) => {
        var stuData = "";
        var barCodeItems = "";
        pool.query(
            `SELECT booking.barcode_number, booking.booking_status, users.username, users.address,users.contact 
            FROM booking 
            INNER JOIN users ON booking.student_id = users.id 
            WHERE booking.barcode_number = ?`,
            [barcode_number],
           (err,results) => {
               if(err){
                   return callBack(err);
               }else if(results == ""){
                   err = "Data Not Found";
                   return callBack(err);
               }else{
                   stuData = results;
                   pool.query(                   
                        `SELECT temp.id as id,temp.token_number, temp.quantity, product.price, product.pname 
                        FROM temp 
                        INNER JOIN product ON temp.item_id = product.id 
                        WHERE temp.token_number = ?`,
                        [barcode_number],
                        (err,res)=>{
                            if(err){
                                return callBack(err);
                            }else if(res == ""){
                                err = "Data Not Found";
                                return callBack(err);
                            }else{
                                barCodeItems = res;
                                var data  = {
                                    stuData,barCodeItems
                                }
                                return callBack(null, data);
                            }

                            
                        }
                   );


                  
               }

           }
        );
    },
    //`select  product.pname, service.id, users.first_name, users.last_name,  users.contact, service.service_no,service.problem, service.date, service.status,service.amount from service join users on service.userid=users.id join product on product.id = service.product_id`,

     
     updates:(data, id, callBack) => {
        pool.query(
            `select * from student where  id = ?`,
            [
                
                id
            ],
            (err,results) =>{
                if(results == ""){
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
                         (err,results) =>{
                             if(err){
                                return callBack(err);   
                             }
                             else{
                                 return callBack(null, results);
                             }
                         }
                     );
                }else if(err){
                    return callBack(err);
                }else{
                    err = "Data Found Duplicate";
                    return callBack(err);
                }
            }
         );         
     },
     deletesById:(id,callBack) => {
        pool.query(`delete from student where id=?`,
            [ 
                id
            ],        
            (err,results) => {
                if(err){
                    return callBack(err);
                }else if(results == ""){                    
                    return callBack("Data not found");
                }else{  
                    message = "Data deleted successfully";
                    return callBack(null, message);
                }
            }
    );
     },
     
     
    
     
};
