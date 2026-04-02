const { productModal } = require('../Modal/modal');

const getProduct = async (req, res) => {
  try {
    const allProduct = await productModal.find();
    res.send(allProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
module.exports=getProduct