const res = require("express/lib/response");
const { callbackPromise } = require("nodemailer/lib/shared");
const pool = require("../../config/dbconfig");

module.exports  = {
     creates:(data, callBack) => {
        var userid=data.empid;
         pool.query(
            `select * from service where id = ?`,
            [data.id],
            (err,results) =>{
                var date=new Date();
                var status="pending";
                var service_no = "SERV" + Math.floor(Math.random() * 90000 + 10000);
                if(results == ""){
                    pool.query(
                        `INSERT INTO service(userid,product_id,employee_id,service_no,problem,date, status,amount) VALUES (?,?,?,?,?,?,?,?)`,
                         [
                            userid,
                            data.product_id,
                            data.employee_id,
                            service_no,
                            data.problem,
                            date,
                            status,
                            data.amount
                            
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
            `select * from service where id = ?`,
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
            `select product.pname, service.id, users.first_name, users.last_name,  users.contact, service.problem, service.date, service.status from service join users on service.userid=users.id join product on product.id = service.product_id where service.status="pending"`,
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
     getSolved:(callBack) => {
        pool.query(
           `select product.pname, service.id, users.first_name, users.last_name,  users.contact, service.problem,
            service.date, service.status from service join users on service.userid=users.id join product on 
            product.id = service.product_id where service.status="solved"`,
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
    service:(callBack) => {
        pool.query(
            `select  product.pname, service.id, users.first_name, users.last_name,  users.contact, service.service_no,service.problem, service.date, service.status,service.amount from service join users on service.userid=users.id join product on product.id = service.product_id`,
            (err,results) => {
               if(err){
                   return callBack(err);
               }else if(results == ""){
                   err = "Data Not Foundss";
                   return callBack(err);
               }else{
                   return callBack(null, results);
               }

           }
        );
    },
    servicemonth:(callBack) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Add 1 because months are 0-indexed
        const currentYear = currentDate.getFullYear();
        pool.query(
            `select  product.pname, users.first_name, users.last_name,  users.contact, service.service_no,service.problem, service.date, service.status,service.amount 
            from service join users on service.userid=users.id join product on product.id = service.product_id WHERE MONTH(service.date) = ? AND YEAR(service.date) = ?`,
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
     updatebyIds: (data, id, callBack) => {
        var status = "solved";
        pool.query(
            `UPDATE service SET amount = ?, status = ? WHERE id = ?`,
            [data.amount, status, id],
            (err, results) => {
                if (err) {
                    return callBack(err);
                } else {
                    return callBack(null, results);
                }
            }
        );
    },
    
     deleteByIds:(id,callBack) => {
        pool.query(
            `delete from service  where id = ?`,
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
