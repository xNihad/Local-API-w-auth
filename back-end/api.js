const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotEnv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const joi = require("joi")
const cors = require("cors")
const app = express()

dotEnv.config()
app.use(bodyParser.json())
app.use(cors({
    exposedHeaders: ['auth-tokensss']
}))

let PORT = process.env.PORT


let ProductValidationSchemma = joi.object({
    name: joi.string().min(3).max(30).required(),
    price: joi.number().integer().positive().min(5).max(10000).required()
})


let ProductSchema = new mongoose.Schema({
    name: String,
    price: Number
})
let UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})
let ProductModel = mongoose.model("product", ProductSchema)
let UserModel = mongoose.model("user", UserSchema)


let tokenControl = function (req, res, next){
    let tokenCTRL = req.header("auth-tokensss")

    if (!tokenCTRL) {
       return res.send("Token yoxdur")
    }

    try {
        let verifiedToken = jwt.verify(tokenCTRL, "jwttokensecretkey")
        // res.send(verifiedToken)
        next()
    } catch (error) {
        res.send("token yanlisdir")   
    }  
}

app.get("/products",tokenControl, async (req,res)=>{
    let products = await ProductModel.find()
    res.send(products)
})

app.post("/products", async (req,res)=>{

     let {error} = ProductValidationSchemma.validate(req.body)
        if(error){
            return res.send(error.details[0].message)
        }

     let newProduct = new ProductModel(req.body)
     await newProduct.save()
     res.send(newProduct)
})

app.delete("/products/:id", tokenControl, async (req, res) => {
    try {
        let result = await ProductModel.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send("Product not found");
        }
        res.send(result);
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
});


app.put("/products/:id", tokenControl, async (req, res) => {
    let { error } = ProductValidationSchemma.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        let updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
        res.send(updatedProduct);
    } catch (err) {
        res.status(500).send("Error updating product");
    }
});



app.post("/users/register", async (req, res)=>{
    let userRegister = await UserModel.findOne({email:req.body.email})

    if(userRegister){
        res.send("Bu email artiq var")
    }

    let hashedPasseord = await bcrypt.hash(req.body.password,10)
    
    let newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPasseord
    })
    await newUser.save()

    let tokenRegister = jwt.sign({_id:newUser._id}, "jwttokensecretkey")
    res.header("auth-tokensss", tokenRegister).send(newUser)


})

app.post("/users/login", async (req,res)=>{
    let userLogin = await UserModel.findOne({email:req.body.email}) 

    if(!userLogin){
       return res.send("Bele bir istifadeci yoxdur!");
    }

    let passwordLogin = await bcrypt.compare(req.body.password,userLogin.password)
    
    if(!passwordLogin){
        return res.send("Password dogru deyil")
    }

    let tokenLogin = jwt.sign({_id:userLogin._id}, "jwttokensecretkey")
    res.send({token:tokenLogin})
})



mongoose.connect(process.env.DB_connection_string)
.then(()=>{
    console.log("Node JS is connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
    
});


app.listen(PORT, ()=>{
    console.log(`API service is active on ${PORT} `);
})