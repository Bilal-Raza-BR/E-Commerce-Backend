const auth = (req,res,next)=>{
    let {name,email,password,contact,age}= req.body;
// console.log(req.body);

    if(!name || !email || !password || !contact || !age){
        return res.send("pleace insert All filed")
    }
 const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!regex.test(email)){
       return res.send({message:`${name}! your email is Invalid`})
    }
    if(password.length < 6 || password.length> 8){
      return  res.send({message:`${name}! ap ka Password 6 Words se kam ya 8 word se Ziada hy`})
    }
    // console.log(typeof(contact));
    
    // const regexNum = /^03[0-9]{9}$/;
    // return regex.test(contact);
//     if(!regex.test(contact)){
// return res.send({message:`${name}! your Contact format is invalid`})
//     }
    if(age < 18){
        return res.send({message:`${name}! you are not +18`})
    }

next()
}
module.exports = auth