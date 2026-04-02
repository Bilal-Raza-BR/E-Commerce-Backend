let {modal} = require('../Modal/modal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config()

const adminLoginCon = async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log('Admin login attempt:', email);

        if(!email || !password){
            return res.status(400).send({message: 'Please Fill all fields', login: false})
        }

        const exitingUser = await modal.findOne({ email }); // null or document

        if(!exitingUser){
            return res.status(400).send({message: 'Your Email is wrong!', login: false})
        }

        if(exitingUser.role !== 'admin' && exitingUser.role !== 'employee'){
            return res.status(403).send({message: 'You are not an Admin or Employee', login: false})
        }
        const isMatch = await bcrypt.compare(password, exitingUser.password)
        if (!isMatch) {
            return res.status(401).send({message: 'Your Password is Wrong❌', login: false})
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

        res.status(200).send({
            message: 'Login Successful✅',
            login: true,
            token: token,
            role: exitingUser.role,
            name: exitingUser.name
        });
        
    } catch (error) {
        console.error('Error in adminLoginCon:', error);
        res.status(500).send({ message: 'Server error', login: false, error: error.message });
    }
}
module.exports=adminLoginCon