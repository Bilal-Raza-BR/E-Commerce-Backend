require('dotenv').config();

const mongoose = require('mongoose');
// console.log(process.env.MONGO_URI);


const dbConnect = async ()=>{

try{
await mongoose.connect(process.env.MONGO_URI)
console.log('MongoDb is Connected');

}
catch(err){
    console.log('MongoDb is not Connected >==>>',  err );
    process.exit(1); //Yeh process ko forcefully stop kar deta hai error case mein.
}

}

module.exports= dbConnect