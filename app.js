const express =require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.urlencoded({extended:true}));


// ------ Middleware ------
const extractNToken = (req,res,next) =>{
    // Get Auth header value
    // Authorization: Bearer <access_token>
    const bearerHeader = req.headers["authorization"];
    // Check if undefined
    if(typeof bearerHeader !== "undefined"){
        const bearerToken =  bearerHeader.split(" ")[1]
        //set token
        req.token = bearerToken
        next();
    }else{
        //Forbidden
        res.status(403).send({})
    }
}
const verifyToken = (req,res,next) =>{
    const bearerHeader = req.headers["authorization"];
    // Check if undefined
    if(typeof bearerHeader !== "undefined"){
        const bearerToken =  bearerHeader.split(" ")[1]
        //decode token
        let decoded = jwt.verify(bearerToken,'mysecret',(err,payload)=>{
            if(err){
                res.status(403).send({})
            }else{
                req.user = payload.user
                next();
            }
        });   
    }else{
        //Forbidden
        res.status(403).send({})
    }
}
const createPerm = (req,res,next) =>{
    let permissions = req.user.role
 
    if(permissions.includes("c")){
        next();
    }else{
        res.status(403).send({})
    }
}
const updatePerm = (req,res,next) =>{
    let permissions = req.user.role
 
    if(permissions.includes("u")){
        next();
    }else{
        res.status(403).send({})
    }
}
const deletePerm = (req,res,next) =>{
    let permissions = req.user.role
 
    if(permissions.includes("d")){
        next();
    }else{
        res.status(403).send({})
    }
}

app.listen(3000,()=>{
    console.log('listening to 3000')
})

// Login Route
app.post('/api/login',(req,res)=>{
    // admin
    const user = {
        username: "edwin",
        email : "edwinwalela@gmail.com",
        role :"crud"
    }
        /*
            User A (can only create)
            const user = {
                username: "edwin",
                email : "edwinwalela@gmail.com",
                role :"c"
            }
            User B (can only create and update)
            const user = {
                username: "edwin",
                email : "edwinwalela@gmail.com",
                role :"cu"
            }
        */
    jwt.sign({
        user:user
        },'mysecret',{expiresIn:'1h'},
        (err,token)=>{
        if(err){res.send(500)}
        res.send({token})
    });
})

// ----- Protected Routes -----
app.post("/api/create",verifyToken,createPerm,(req,res)=>{
    res.send({
        msg:"Post created",
        user:req.user
    })
})
app.put("/api/update",verifyToken,updatePerm,(req,res)=>{
    res.send({
        msg:"Post created",
        user:req.user
    })
})
app.delete("/api/delete",verifyToken,deletePerm,(req,res)=>{
    res.send({
        msg:"Post created",
        user:req.user
    })
})

