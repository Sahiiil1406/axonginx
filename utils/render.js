const path=require('path')

const renderFile=(app,config)=>{
    //console.log(config.nginx.render)
    //console.log(config)
    config.nginx.render.forEach((element)=>{
        app.get(element.location,(req,res)=>{
            res.sendFile(path.join(__dirname, '../templates',element.filename ));
        })
    })
}

module.exports={renderFile}