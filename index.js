const express=require("express")
const server=express()
const mongoose=require("mongoose")
const cors=require("cors")
const { createProduct } = require("./controller/Product")
const productRouters=require("./routes/Product")
const categoriesRouter=require("./routes/Category")
const brandsRouter=require("./routes/Brand")
server.use(express.json())
server.use(express.urlencoded({extended:true}))
main().catch(err=>console.log(err))

async function main(){
    await mongoose.connect("mongodb+srv://vikesh667kumar:ecommerce123@ecomerce.8duduxm.mongodb.net/ecomerce")
    console.log("database connected")
}
server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use('/products',productRouters.router)
server.use('/categories',categoriesRouter.router)
server.use('/brands',brandsRouter.router)
server.listen(8080,()=>{
    console.log("server started")
})