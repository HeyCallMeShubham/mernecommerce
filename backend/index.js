
const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const ws = require('ws')

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://shubham:mylife@cluster0.natwega.mongodb.net/")




app.use(cors({

  credentials:true,
  origin:'http://localhost:3000'

}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cookieParser())


app.get('*', (req, res)=>{

     res.sendFile(path.join(__dirname, '../client/build.index.html'))

})



const userSchema = mongoose.Schema({

  name:String,
  email:String,
  password:String,
  image:String


})


const userModel = mongoose.model('shopper', userSchema)






app.post("/register", async(req, res) =>{

  const {name, email, password, image} = req.body

  try{
 
    const findEmail = await userModel.findOne({email:req.body.email})

    if(findEmail){

      res.status(201).json({message:"user already exists with this email"})

    }else{

       const hashpass = await bcrypt.hash(password, 10)
    

       
       const user = await userModel.create({
    
         name:name,
         email:email,
         password:hashpass,
         image:image
    
       })

       

       const token = await jwt.sign({user, name:user.name, id:user._id}, "secret", {expiresIn:'2d'});

        res.cookie('token', token, {sameSite:'none', secure:true})

       res.status(200).json({token:token, message:"registered successfully", userdetail:{name:user.name, email:user.email}})
       

    }



  }catch(err){

    console.log(err)

   res.send(err)

  }

})






app.post("/login", async(req, res) =>{

    const {email, password} = req.body
  
    try{


   
      const findEmail = await userModel.findOne({email:req.body.email})
  
      if(findEmail){
        
      //  console.log(findEmail)
    
        const token = await jwt.sign({findEmail, name:findEmail.name, email:findEmail.email, id:findEmail._id}, "secret", {expiresIn:'2d'})

        res.cookie('token', token)
        
        res.status(200).json({token:token, message:"registered successfully", userdetail:{name:findEmail.name, email:findEmail.email}})
 
      }else{
  
       res.json({message:"sorry no user with this email id "})          
  
      }
  

  
    }catch(err){
  
      console.log(err)
  
     res.send(err)
  
    }
  
  })
  
 

  app.get("/getuserinfo/:id", async(req, res)=>{

    try{

       const id = req.params.id 

      const userinfo = await userSchema.findById(id)

      //  console.log(userinfo)

     }catch(err){

        console.log(err);

     }


  })




  const ProductsSchema = mongoose.Schema({

    title:String,
    price:Number,
    userid:String,
    usernameproducts:String,
    image:String
  
  
  })
  
  


  const productModel = mongoose.model('productstobuy', ProductsSchema)
  
  





  app.post("/addproducts", async(req, res) =>{

    const { title, price, userid, usernameproducts, image } = req.body
  
    try{

    const products = await productModel.create({

        title:title,
        price:price,
        userid:userid,
        usernameproducts:usernameproducts,
        image:image

    });
     
      console.log(products)
  
    }catch(err){
  
      console.log(err)
  
     res.send(err)
  
    }
  
  })
  
   
  
 app.get("/getproducts", async(req, res) =>{

   try{

 const product = await productModel.find({})

    res.status(200).json({products:product});

    console.log(product)


  }catch(err){

    console.log(err)

 }


 }) 



app.get("/productdetails/:id", async(req, res) =>{

  try{

    const id = req.params.id

  const product = await productModel.findById(id);

  res.status(200).json({productdetail:product})

  console.log(product.userid, 'product')
  
  if(product){

     const gg = await productModel.find({userid:"66hh"})  

   //  console.log(gg, 'hello');

  }

    

  }catch(err){

   console.log(err);

  }


})



app.get('/getbyid/:id', async(req, res) =>{

   try{


   }catch(err){



   }

})



  

app.get('/gettoken', async(req,res) =>{

    try{

    const token = req.cookies.token

     const decode = jwt.decode(token)

     res.send({decode:decode})

     console.log(decode)

    }catch(err){

    console.log(err);

    throw err

    }

})






const server = app.listen(7000, () =>{

   console.log(`${7000}`)

})


const wss = new  ws.WebSocketServer({server})


server.on('connection', (ws) =>{

  
  ws.on('message', (message) =>{
 
    

  })



})







