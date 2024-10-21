const pool = require("../../config/dbconfig");
const res = require("express/lib/response");
const { genSaltSync, hashSync} = require("bcrypt");

module.exports = {
    create:(data,callBack) => {
        pool.query(`select * from ngo where email = ?`,
            [data.email],
            (error,results) => {
                if(results == ""){
                    pool.query(
                        `INSERT INTO ngo(first_name, last_name, username,email,contact) VALUES (?,?,?,?,?)`,
                        [
                            data.first_name,
                            data.last_name,
                            data.username,
                            data.email,
                            data.contact,
                            data.password
                        ],
                        (error) => {
                            if(error){
                                return callBack(error);
                            }else{
                                var date=new Date();
                                var status="Active";
                                var user="ngo";
                                pool.query(
                                    `INSERT INTO users(first_name, last_name, username,email,contact,password,userRole,date,status) VALUES (?,?,?,?,?,?,?,?,?)`,
                                    [
                                        data.first_name,
                                        data.last_name,
                                        data.username,
                                        data.email,
                                        data.contact,
                                        data.password,
                                        user,
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
                            }
                        }
                    );
                }else if(error){
                    return callBack(error);
                }else{
                    return callBack("Duplicate Entry found");
                }
            }
        );        
    },
    getRegByIDs:(id, callBack) =>{
        pool.query(`select * from userregister where id = ?`,
            [id],
            (err,results) => {
                if(err){
                    return callBack(err);
                }else if(results == ""){                    
                    return callBack("Data not found");
                }else{  
                    return callBack(null, results);
                }
            }
        );
    },
    updatebyIds:(id,callBack) =>{
        pool.query(
            `update userregister set username=?, email=?, phone=?, password=?, didx=? where id = ?`,
            [   data.username,
                data.email,
                data.phone,
                data.password,
                data.didx ,            
                id
            ],
            (error, results, fields) => {
                if(error){
                    console.log(error);
                }
                return callBack(null, results[0]);
            }
        );
   },
    getRegs:(callBack) =>{
        pool.query(`select * from ngo`,        
            (err,results) => {
                if(err){
                    return callBack(err);
                }else if(results == ""){                    
                    return callBack("Data not found");
                }else{  
                    return callBack(null, results);
                }
            }
        );
    },
    deleteByIds:(id,callBack) =>{
        pool.query(`delete from ngo where id=?`,
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
}
};