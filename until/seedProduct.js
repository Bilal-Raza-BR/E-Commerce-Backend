const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const router = express.Router();
const { productModal } = require('../Modal/modal');
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Static product data for Men
const menProducts = [
  {
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    discount: 15,
    rating: 4.5,
    category: 'men',
    description: 'Ultra-soft premium cotton t-shirt with a comfortable fit. Perfect for everyday wear and casual outings.',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Slim Fit Jeans',
    price: 59.99,
    discount: 0,
    rating: 4.2,
    category: 'men',
    description: 'Modern slim fit jeans with stretch denim for maximum comfort. Features a classic five-pocket design.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Classic Oxford Shirt',
    price: 49.99,
    discount: 10,
    rating: 4.7,
    category: 'men',
    description: 'Timeless Oxford shirt made from high-quality cotton. Perfect for both casual and formal occasions.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Leather Jacket',
    price: 199.99,
    discount: 20,
    rating: 4.8,
    category: 'men',
    description: 'Premium genuine leather jacket with a stylish design. Features a soft inner lining for added comfort.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Casual Sneakers',
    price: 79.99,
    discount: 0,
    rating: 4.4,
    category: 'men',
    description: 'Lightweight and comfortable casual sneakers with cushioned insoles. Perfect for everyday wear.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Wool Sweater',
    price: 89.99,
    discount: 5,
    rating: 4.3,
    category: 'men',
    description: 'Warm and cozy wool sweater with a classic design. Perfect for colder weather and layering.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// Static product data for Women
const womenProducts = [
  {
    name: 'Floral Summer Dress',
    price: 49.99,
    discount: 10,
    rating: 4.6,
    category: 'women',
    description: 'Beautiful floral summer dress made from lightweight fabric. Perfect for warm weather and special occasions.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'High-Waisted Jeans',
    price: 69.99,
    discount: 0,
    rating: 4.8,
    category: 'women',
    description: 'Stylish high-waisted jeans with a comfortable stretch fit. Features a flattering silhouette and classic design.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cashmere Sweater',
    price: 129.99,
    discount: 15,
    rating: 4.9,
    category: 'women',
    description: 'Luxurious cashmere sweater with a soft and cozy feel. Perfect for staying warm while looking elegant.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Leather Handbag',
    price: 159.99,
    discount: 0,
    rating: 4.7,
    category: 'women',
    description: 'Premium leather handbag with a spacious interior and multiple compartments. Features a stylish and timeless design.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ankle Boots',
    price: 99.99,
    discount: 20,
    rating: 4.5,
    category: 'women',
    description: 'Stylish ankle boots with a comfortable heel height. Perfect for both casual and formal outfits.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Silk Blouse',
    price: 79.99,
    discount: 5,
    rating: 4.4,
    category: 'women',
    description: 'Elegant silk blouse with a smooth and luxurious feel. Features a flattering cut and versatile design.',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// Function to seed the database with static product data
const seedDatabase = async () => {
  try {
    // Check if products already exist
    const existingProducts = await productModal.countDocuments();

    if (existingProducts > 0) {
      console.log('Found ' + existingProducts + ' existing products in database.');
      // Delete existing products and reseed
      await productModal.deleteMany({});
      console.log('Deleted existing products. Reseeding database...');
    }

    // Insert men's products
    await productModal.insertMany(menProducts);
    console.log('Men products seeded successfully!');

    // Insert women's products
    await productModal.insertMany(womenProducts);
    console.log('Women products seeded successfully!');

    console.log('Database seeded with static product data!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Call the seed function when this module is imported
// Production mein isse comment rakhna behtar hai taake data bar-bar reset na ho
// seedDatabase();

// Product upload route - simplified version without file upload
router.post('/products', async (req, res) => {
  try {
    console.log('Request received for product upload');
    console.log('Request body:', req.body);

    const { name, price, category, discount, rating, description, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price || !category || !imageUrl) {
      console.log('Missing required fields in request body');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, category, and imageUrl'
      });
    }

    // Use a default image URL if none provided
    const finalImageUrl = imageUrl || 'https://via.placeholder.com/500';

    console.log('Using image URL:', finalImageUrl);

    const newProduct = await productModal.create({
      name,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      rating: rating ? Number(rating) : 5,
      category,
      description: description || '',
      image: finalImageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Error uploading product:', error);
    console.error('Error stack:', error.stack);

    // Send a more detailed error response
    res.status(500).json({
      success: false,
      message: 'Failed to upload product',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Get products by category from MongoDB
router.get('/products/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch from database based on category
    const products = await productModal.find({ category });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${category} products found`
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get all products from MongoDB
router.get('/products', async (req, res) => {
  try {
    const products = await productModal.find();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Test route for Cloudinary configuration
router.get('/test-cloudinary', (req, res) => {
  try {
    // Check if Cloudinary is configured
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined // Don't show the actual secret
    };

    res.status(200).json({
      success: true,
      message: 'Cloudinary configuration test',
      config: cloudinaryConfig,
      multerStorage: storage ? 'Configured' : 'Not configured'
    });
  } catch (error) {
    console.error('Error testing Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test Cloudinary',
      error: error.message
    });
  }
});

module.exports = router;
