const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     create:(data, callBack) => {
         
              
        pool.query(
            `select * from product where id = ?`,
            [data.id],
            (err,results) =>{
                var date=new Date();
                var pstatus="active";
                if(results == ""){
                    pool.query(
                        `insert into product(category_id, pname, price, description, image, type, date, status)values(?,?,?,?,?,?,?,?)`,
                         [
                            data.category_id,
                            data.pname,
                            data.price,
                            data.description,
                            data.image,
                            data.type,
                            date,
                            pstatus
                            
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
            `SELECT product.id,category.name as catname, product.pname as name, product.price, product.description as p_desc, product.image as img, product.type, product.date, product.status
            FROM product
            INNER JOIN category ON product.category_id = category.id`,
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
     getsearchedProducts:(data,callBack) => {
        var searchedData = data.searchedData;
        pool.query(
           `SELECT product.id,category.name as catname, product.pname as name, product.price, product.description as p_desc, product.image as img, product.type, product.date, product.status
           FROM product
           INNER JOIN category ON product.category_id = category.id WHERE product.pname LIKE ?`,
           ["%"+searchedData+"%"],
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
            `select * from product where id = ?`,
            [
                id
            ],
            (err,results) =>{
                var date=new Date();
                if(results == ""){
                    var status="active";
                    pool.query(
                        `UPDATE product SET category_id=?, pname=?, price=?, description=?, image=?, type=?, date=?,status=? WHERE  id = ?`,
                         [
                            data.category_id,
                            data.pname,
                            data.price,
                            data.description,
                            data.image,
                            data.type,
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
