
const cheakPro =(req,res,next)=>{
    const {image,product,price}=req.body;
    if(!image || !product || !price){

        return res.send({message : "Please Fill the All Input Filed",addProdut : false})
    }
    next()

}
module.exports= cheakPro