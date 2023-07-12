const express=require("express");
const got = require("got"); //npm install got@9.6.0
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/student',{UseNewUrlParser:true});



const studentschema=new mongoose.Schema({fname:String,lname:String,email:String,password:String});
const customer=mongoose.model("customerdata",studentschema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post('/',async function(req,res){
    const fname=req.body.Fname;
    const lname=req.body.Lname;
    const email=req.body.Email;
    const password=req.body.Password;
  const data={fname:fname,lname:lname,email:email,password:password};
   
    try{
        //tocheck api connection
        // const response = await mailchimp.ping.get();
        //  console.log(response);


        
        const response = await customer(data).save();
            
          
          console.log(response);
          res.sendFile(__dirname+"/success.html");

    }
    catch(err){
        console.log(err);
        res.sendFile(__dirname+"/failure.html");
    }
}
);

app.post('/failure',function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.get('/login',function(req,res){
  res.sendFile(__dirname+"/login.html");
});

app.post('/login',async function(req,res){
  
  try {
    // check if the user exists
    const user = await customer.findOne({ email:req.body.Email });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        res.sendFile(__dirname+'/success.html')
      } else {
        res.sendFile(__dirname+'/login.html')
      }
    } else {
      res.sendFile(__dirname+'/login.html')
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000,()=> console.log("listening on port 3000"));
