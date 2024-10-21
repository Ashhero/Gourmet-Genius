const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     create:(data, callBack) => {
         
              
        pool.query(
            `select * from stock where id = ?`,
            [data.id],
            (err,results) =>{
                
                var status="active";
                if(results == ""){
                    pool.query(
                        `insert into stock(product_id, employee_id, quantity, status)values(?,?,?,?)`,
                         [
                            data.product_id,
                            data.empid,
                            data.quantity,
                            status
                            
                            
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
            `select * from stock where id = ?`,
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
            `select * from stock`,
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
     updateProduct:(data, id, callBack) => {
        pool.query(
            `select * from stock where id = ?`,
            [
                id
            ],
            (err,results) =>{
                
                if(results == ""){
                    var status="active";
                    pool.query(
                        `UPDATE stock SET product_id=?, employee_id=?, quantity=?, status=? WHERE  id = ?`,
                         [
                            data.product_id,
                            data.employee_id,
                            data.quantity,
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
        pool.query(`delete from stock where id=?`,
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
