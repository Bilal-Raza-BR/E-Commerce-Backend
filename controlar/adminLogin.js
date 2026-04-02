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
            :

        const exitingUser = await modal.findOne({ email }); // null or document

        if(!exitingUser){
            return res.st

        if(exitingUser.role !== 'admin' && exitingUser.role !== 'employee'){
            return res.status(403).send({message: 'You are not an Admin or Employee', login: false})
        }
        const isMatch = await bcrypt.compare(password, exitingUser.password)
        if (!isMatch) {
            return res.status(401).send({message: 'Your Password is Wrong❌', login: false})
        }

        // Include role in the token payload
        const token = j
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
        
    } catch (error) {
        console.error('Error in adminLoginCon:', error);
        res.status(500).send({ message: 'Server error', login: false, error: error.message });
    }
}
module.exports=adminLoginCon