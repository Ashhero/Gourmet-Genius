const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     create:(data, callBack) => {
         
              
        pool.query(
            `select * from purchase where id = ?`,
            [data.id],
            (err,results) =>{
                var date=new Date();
                var status="active";
                // var track = "PROD" + Math.floor(Math.random() * 90000 + 10000);
                var pay = "PAY" + Math.floor(Math.random() * 90000 + 10000);
                if(results == ""){
                    pool.query(
                        `insert into purchase(employee_id,product_track,user_fullname,user_address,user_state,user_city,user_pin,amount,payment_method,payment_no,payment_status,date)values(?,?,?,?,?,?,?,?,?,?,?,?)`,
                         [
                            data.empid,
                            data.trackno,
                            data.user_fullname,
                            data.user_address,
                            data.user_state,
                            data.user_city,
                            data.user_pin,
                            data.amount,
                            data.payment_method,
                            pay,
                            status,
                            date
                            
                            
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
     getProductById:(id,callBack) => {
        pool.query(
            `select * from product where id = ?`,
            [id],
            (err,results,fields) => {
                if(err){
                    return callBack(err);
                }
                else if(results == ""){
                    err = "Data not found";
                    return callBack(err)
                }else{
                    return callBack(null, results);
                }
                
            }
        );
     },
     //getting the products data
     getProducts:(callBack) => {
         pool.query(
            
            `select id,product_track,user_fullname,user_address,user_city,user_pin,payment_no,payment_method,amount,date from purchase`,
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
     getCash: (callBack) => {
        pool.query(
            `SELECT id, product_track, user_fullname, user_address, user_city, user_pin, payment_no, payment_method, amount, date
             FROM purchase`, 
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else if (results.length === 0) {
                    err = "Data Not Found";
                    return callBack(err);
                } else {
                    return callBack(null, results);
                }
            }
        );
    },
     getOnline:(callBack) => {
        pool.query(
           
           `SELECT id,product_track,user_fullname,user_address,user_city,user_pin,payment_no,payment_method,date FROM purchase`,
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
    
    getmonth:(callBack) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Add 1 because months are 0-indexed
    const currentYear = currentDate.getFullYear();

    pool.query(
        `SELECT id, product_track, user_fullname, user_address, user_city, user_pin, payment_no, payment_method, amount, date
        FROM purchase
        WHERE MONTH(date) = ? AND YEAR(date) = ?`,
        [currentMonth, currentYear],
        (err, results) => {
            if (err) {
                return callBack(err);
            } else if (results.length === 0) {
                err = "Data Not Found";
                return callBack(err);
            } else {
                return callBack(null, results);
            }
        }
    );
},





     //SELECT id,product_track,user_fullname,user_address,user_city,user_pin,payment_no,payment_method,date FROM `purchase`;
     updateProduct:(data, id, callBack) => {
        pool.query(
            `select * from product where id = ?`,
            [
                id
            ],
            (err,results) =>{
                var date=new Date();
                if(results == ""){
                    var status="active";
                    pool.query(
                        `UPDATE product SET category_id=?, pname=?, price=?, description=?, image=?, warranty=?, date=?,status=? WHERE  id = ?`,
                         [
                            data.category_id,
                            data.pname,
                            data.price,
                            data.description,
                            data.image,
                            data.warranty,
                            date,
                            status,
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
     deleteProductById:(id,callBack) => {
        pool.query(`delete from product where id=?`,
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


//var rand = "prod" + Math.floor(Math.random() * 90000 + 10000);
