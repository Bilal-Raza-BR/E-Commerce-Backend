let {modal} = require('../Modal/modal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config()

const loginCon = async (req, res) => {
    let { email, password} = req.body;
console.log(req.body);
const exitingUser = await modal.findOne({ email }); // null or document

if(!exitingUser){
    return res.send({message: 'your Email is wrong!', login : false})
}

if(exitingUser.role !== 'user'){
    return res.send({message: 'You are not a User', login : false})
}

if(!email|| !password){
return res.send({message: 'Please Fill all filed', login : false})
}
const isMatch = await bcrypt.compare(password,exitingUser.password)

if ( !isMatch) {
    return res.send({message: 'your  Password is Wrong❌', login : false})
}
const token =  jwt.sign({email: email,password: password }, process.env.TOKEN_KEY);


if (exitingUser.email ==email && exitingUser.password){
 res.send({message: 'Login SuccesFull✅', login : true,token: token})
}
  
}
module.exports=loginCon