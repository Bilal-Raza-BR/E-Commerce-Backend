let {modal} = require('../Modal/modal');
const bcrypt = require('bcryptjs');

const signupCon = async (req, res) => {
    let { name, email, password, contact, age ,role} = req.body;
// console.log(req.body);

    const exitingUser = await modal.findOne({ email }); // null or document

    if (exitingUser) {
        return res.send({message: 'email is already use'})
    }
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    
    await modal.create({

        name: name ,
        email: email,
        password: hash,
        contact: contact,
        age: age,
        role: role

    })
res.send({message:`${name} your Signup request is Succesfully Accept`, signup : true})
}
module.exports=signupCon