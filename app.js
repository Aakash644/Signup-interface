const express=require("express");
const got = require("got"); //npm install got@9.6.0
const bodyParser=require("body-parser");
const app=express();
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "your_api_key",
  server: "your_server_id",
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post('/',async function(req,res){
    const fname=req.body.Fname;
    const lname=req.body.Lname;
    const email=req.body.Email;
    const listId="2f6105ab43";
   
    try{
        //tocheck api connection
        // const response = await mailchimp.ping.get();
        //  console.log(response);


        
        const response = await mailchimp.lists.addListMember(listId, {
            email_address:email,
            status: "subscribed",
            merge_fields: {
              FNAME: fname,
              LNAME: lname
            }
          });
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

app.listen(3000,()=> console.log("listening on port 3000"));
