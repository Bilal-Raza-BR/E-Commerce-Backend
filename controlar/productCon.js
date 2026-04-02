const {productModal} = require('../Modal/modal')
const productCon = async (req,res)=>{
    const {image,product,price}=req.body;
        
        await productModal.create({
    
            image: image ,
            product: product,
            price: price,
        })
        res.send({message: 'Product Added Succsesfully',addProdut : true})

}
module.exports= productCon