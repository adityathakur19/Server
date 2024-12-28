// controllers/productController.js
const Product = require('../models/productModel');
const multer = require('multer');
const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Multer configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// Helper function for S3 upload
const uploadToS3 = async (file) => {
    if (!file) return null;

    try {
        const filename = `products/${Date.now()}-${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error('Image upload failed');
    }
};

const productController = {
    // Get all products
    async getProducts(req, res) {
        try {
            const products = await Product.find({ user: req.user._id })
                .sort({ createdAt: -1 });
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Create a new product
    async createProduct(req, res) {
        try {
            const imageUrl = await uploadToS3(req.file);
            const { itemName, sellPrice, type, primaryUnit, customUnit } = req.body;

            if (!itemName || !sellPrice || !type) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const newProduct = new Product({
                user: req.user._id,
                itemName,
                sellPrice: parseFloat(sellPrice),
                type,
                primaryUnit,
                customUnit,
                imageUrl,
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Update a product
    async updateProduct(req, res) {
        try {
            let product = await Product.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let imageUrl = product.imageUrl;
            if (req.file) {
                if (product.imageUrl) {
                    try {
                        const oldKey = product.imageUrl.split('/').slice(-2).join('/');
                        await s3.deleteObject({
                            Bucket: process.env.AWS_S3_BUCKET_NAME,
                            Key: oldKey,
                        }).promise();
                    } catch (error) {
                        console.warn('Failed to delete old image:', error);
                    }
                }
                imageUrl = await uploadToS3(req.file);
            }

            Object.keys(req.body).forEach((key) => {
                if (key !== '_id' && key !== 'user') {
                    product[key] = req.body[key];
                }
            });
            product.imageUrl = imageUrl;

            await product.save();
            res.json(product);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Delete a product
    async deleteProduct(req, res) {
        try {
            const product = await Product.findOne({
                _id: req.params.id,
                user: req.user._id
            });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.imageUrl) {
                try {
                    const oldKey = product.imageUrl.split('/').slice(-2).join('/');
                    await s3.deleteObject({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: oldKey,
                    }).promise();
                } catch (error) {
                    console.warn('Failed to delete image from S3:', error);
                }
            }

            await product.deleteOne();
            res.json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = { productController, upload };

