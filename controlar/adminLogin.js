let {modal} = require('../Modal/modal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config()

const adminLoginCon = async (req, res) => {
    let { email, password } = req.body;
    console.log('Admin login attempt:', email);

    if(!email || !password){
        console.log('Missing email or password');
        return res.send({message: 'Please Fill all fields', login: false})
    }

    const exitingUser = await modal.findOne({ email }); // null or document

    if(!exitingUser){
        console.log('User not found:', email);
        return res.send({message: 'Your Email is wrong!', login: false})
    }

    console.log('User found with role:', exitingUser.role);

    if(exitingUser.role !== 'admin' && exitingUser.role !== 'employee'){
        console.log('User is not admin or employee:', exitingUser.role);
        return res.send({message: 'You are not an Admin or Employee', login: false})
    }

    const isMatch = await bcrypt.compare(password, exitingUser.password)

    if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.send({message: 'Your Password is Wrong❌', login: false})
    }

    // Include role in the token payload
    const token = jwt.sign(
        {
            email: email,
            role: exitingUser.role,
            userId: exitingUser._id
        },
        process.env.TOKEN_KEY,
        { expiresIn: '24h' }
    );

    console.log('Login successful for:', email, 'with role:', exitingUser.role);

    res.send({
        message: 'Login Successful✅',
        login: true,
        token: token,
        role: exitingUser.role,
        name: exitingUser.name
    })
}
module.exports=adminLoginCon