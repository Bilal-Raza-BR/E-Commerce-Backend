const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { productModal } = require('../Modal/modal');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'e-commerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage: storage });

// Middleware to handle file upload
const uploadMiddleware = upload.single('image');

// Add product controller
const addProduct = async (req, res) => {
  try {
    console.log('Add product request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, price, category, discount, rating, description } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      console.log('Missing required fields in request body');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, and category'
      });
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file'
      });
    }

    // Get the Cloudinary URL from the file object
    let imageUrl;

    if (req.file.path) {
      imageUrl = req.file.path;
    } else if (req.file.secure_url) {
      imageUrl = req.file.secure_url;
    } else if (req.file.url) {
      imageUrl = req.file.url;
    } else {
      // If none of the above, try to extract from the entire file object
      console.log('Detailed file object:', JSON.stringify(req.file, null, 2));

      // Try to find any property that looks like a URL
      for (const key in req.file) {
        if (typeof req.file[key] === 'string' &&
            (req.file[key].startsWith('http://') || req.file[key].startsWith('https://'))) {
          imageUrl = req.file[key];
          console.log(`Found URL in property ${key}: ${imageUrl}`);
          break;
        }
      }
    }

    if (!imageUrl) {
      console.log('No image URL found in file object');
      return res.status(400).json({
        success: false,
        message: 'Image upload failed. No URL returned from Cloudinary.'
      });
    }

    console.log('Using image URL:', imageUrl);

    // Create new product with image URL from Cloudinary
    const newProduct = await productModal.create({
      name,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      rating: rating ? Number(rating) : 5,
      category,
      description: description || '',
      image: imageUrl
    });

    console.log('Product created successfully:', newProduct);

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Error adding product:', error);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// Get all products controller
const getAllProducts = async (req, res) => {
  try {
    const products = await productModal.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Update product controller
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, category, discount, rating, description } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (discount !== undefined) updateData.discount = Number(discount);
    if (rating) updateData.rating = Number(rating);
    if (description !== undefined) updateData.description = description;

    // If image is uploaded, update image URL
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Update product
    const updatedProduct = await productModal.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product controller
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Delete product
    const deletedProduct = await productModal.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary
    if (deletedProduct.image) {
      const publicId = deletedProduct.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`e-commerce-products/${publicId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

module.exports = {
  uploadMiddleware,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};
