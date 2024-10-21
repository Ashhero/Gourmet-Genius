const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     creates:(data, callBack) => {
         pool.query(
            `select * from supplier where supplier_name = ?`,
            [data.supplier_name],
            (err,results) =>{
                var date=new Date();
                var status="active";
                if(results == ""){
                    pool.query(
                        `INSERT INTO supplier(place_id,supplier_name,supplier_gstin,supplier_address,supplier_phone_number,supplier_date_create,supplier_status) VALUES (?,?,?,?,?,?,?)`,
                         [
                            data.place_id,
                            data.supplier_name,
                            data.supplier_gstin,
                            data.supplier_address,
                            data.supplier_phone_number,
                            date,
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
     getByIDs:(id,callBack) => {
        pool.query(
            `select * from supplier where id = ?`,
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
     getDatas:(callback) =>{
        pool.query(`select *, supplier_id as id from supplier`,    
            
            (err,results) => {
                if(results.length==0){
                    var empty ="Data not found";
                    return callback(null,empty);
                }else if(results){
                    return callback(null,null,results);
                }else{
                    return callback(err);
                }
            }
        );
    },
     updatebyIds:(data, id, callBack) => {
        pool.query(
            `select * from supplier where deptName = ? and id <> ?`,
            [
                data.deptName,
                id
            ],
            (err,results) =>{
                if(results == ""){
                    pool.query(
                        `UPDATE supplier SET deptName=?,deptDesc=? WHERE  id = ?`,
                         [
                            data.deptName,
                            data.deptDesc,
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
            `delete from supplier  where supplier_id = ?`,
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
