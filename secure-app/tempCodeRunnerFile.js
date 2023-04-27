client.query(`select * from accounts`,[1], (err, result) =>{
    if(!err){
        console.log(result.rows);
    }
    client.end();
})