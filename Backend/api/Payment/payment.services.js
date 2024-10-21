const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     creates:(data, callBack) => {
         pool.query(
            `select * from user_payment where id = ?`,
            [data.id],
            (err,results) =>{
                var payment_no = "Payment" + Math.floor(Math.random() * 90000 + 10000);
                var payment_status="paid";
                var date=new Date();
                if(results == ""){
                    pool.query(
                        `INSERT INTO user_payment(payment_no,user_id,amount,payment_status,track_id,date) VALUES (?,?,?,?,?,?)`,
                         [
                            payment_no,
                            data.user_id,
                            data.amount,
                            payment_status,
                            data.track_id,
                            date
                            
                            
                         ],
                         (err,results) =>{
                           
                             if(err){
                                return callBack(err);   
                             }
                             else{
                                var orderRemark="order has been begin";
                                var date=new Date();
                                pool.query(
                                    `UPDATE orders SET orderStatus=?,order_remark=?,orderDate=?,payment_id=? WHERE  id = ?`
                                     [
                                        payment_no,
                                        orderRemark,
                                        date,
                                        data.payment_id
                                        
                                        
                                     ],
                                )
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
     getByIDs:(id,callBack) => {
        pool.query(
            `select * from section where id = ?`,
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
     getDatas:(callBack) => {
         pool.query(
            `select * from section`,
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
     updatebyIds:(data, id, callBack) => {
        pool.query(
            `select * from section where secName = ? and id <> ?`,
            [
                data.secName,
                id
            ],
            (err,results) =>{
                if(results == ""){
                    pool.query(
                        `UPDATE section SET secName=?,secDesc=?,did WHERE  id = ?`,
                         [
                            data.secName,
                            data.secDesc,
                            data.did,
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
     deleteByIds:(id,callBack) => {
        pool.query(
            `delete from section  where id = ?`,
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
     
     
    
     
};
