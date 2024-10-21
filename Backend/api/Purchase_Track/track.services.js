const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     create :(data, product_id, callBack) => {
        const quantity = data.quantity;
        const trackno = data.trackno;
        const date = new Date();
    
        pool.query('SELECT quantity FROM stock WHERE product_id = ?', [data.product_id], (error, res) => {
            if (error) {
                console.error(error);
                return callBack(error);
            }
            //stock quantity is > or equal to requested Quantity [requestedQty-> 3 and stockqty >= 5]
            if (res.length > 0 && res[0].quantity >= quantity) {
                pool.query(
                    'INSERT INTO purchase_track (product_id, quantity, trackno, date) VALUES (?, ?, ?, ?)',
                    [data.product_id, quantity, trackno, date],
                    (error, results) => {
                        if (error) {
                            console.error(error);
                            return callBack(error);
                        }else{
                            //productid
                            //remaining stock = stockqty - requestedquantity
                            //update query if true -> success else -> something went wrong
                            
                            var remainStock=0;
                            remainStock= res[0].quantity-quantity;
                            pool.query('update stock set quantity=? where product_id=?',
                            [remainStock,product_id],
                            (err,results)=>{
                                if(err){
                                    return callBack(err);
                                }else{
                                    return callBack(null, results);
                                }
                            });
                        }
                    }
                );
            } else {                
                const err = "Insufficient Stock or Product Not Found";
                console.error(err);
                return callBack(err);
            }
        });
    },
    

     getProductById:(id,callBack) => {
        pool.query(
            `select * from purchase_track where id = ?`,
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

     //getting total price of trackno products
     getTotalPrice:(id,callBack) => {
        pool.query(
            `SELECT purchase_track.quantity as pro_quantity, product.price as pro_price FROM purchase_track INNER JOIN product ON purchase_track.product_id = product.id where trackno = ?`,
            [id],
            (err,results,fields) => {
                if(err){
                    return callBack(err);
                }
                else if(results == ""){
                    err = "Data not found";
                    return callBack(err)
                }else{
                    var total = 0;
                    
                    if(results.length>0){
                        for(var j=0;j<results.length;j++){
                            total += results[j].pro_quantity*results[j].pro_price;
                        }
                    }

                    return callBack(null, total);
                }
                
            }
        );
     },
     //getting the products data
     getProducts:(callBack) => {
         pool.query(
            `select * from purchase_track`,
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
            `select * from purchase_track where id = ?`,
            [
                
                id
            ],
            (err,results) =>{
                if(results == ""){
                    pool.query(
                        `UPDATE purschase_track SET product_id=?,quantity=?,track_no=?,date=? WHERE  id = ?`,
                         [
                            data.product_id,
                            data.quantity,
                            data.track_no,
                            date,
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
        pool.query(`delete from purchase_track where id=?`,
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
