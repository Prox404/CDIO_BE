const Product = require('../models/Product/Product');

class ProductController {
    async AddProduct(req, res) {
        try {
            const { name, price, quantity, description, image, category, discount } = req.body;

            const newProduct = new Product({
                name,
                price,
                quantity,
                description,
                image,
                category,
            });

            const savedProduct = await newProduct.save();

            res.status(200).json({
                message: 'Add product successfully',
                data: savedProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    async ShowAll(req, res) {
        try {
            const products = await Product.find().select('-description');
            res.json({
                message: 'Fetch products successfully',
                data: products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }

    }

    async ShowDetail(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            res.json({
                message: 'Fetch product successfully',
                data: product,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    async Update(req, res) {
        try {
            const { name, price, quantity, description, image, category, discount } = req.body;

            const product = await Product.findById(req.params.id);

            product.name = name || product.name;
            product.price = price || product.price;
            product.quantity = quantity || product.quantity;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.discount = discount || product.discount;

            const updatedProduct = await product.save();

            res.json({
                message: 'Update product successfully',
                data: updatedProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    }

    async Delete(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            await product.remove();
            res.json({
                message: 'Delete product successfully',
                data: product,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }

    async Search(req, res) {
        const { name, category, priceFrom, priceTo, discount } = req.query;

        // Tạo một đối tượng chứa các tiêu chí tìm kiếm dựa trên thông tin từ request
        const searchCriteria = {};

        // Kiểm tra và thêm tiêu chí tìm kiếm vào đối tượng searchCriteria
        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' }; // Tìm kiếm theo tên (không phân biệt hoa thường)
        }

        if (category) {
            searchCriteria.category = category; // Tìm kiếm theo danh mục
        }

        if (priceFrom && priceTo) {
            console.log('priceFrom:', priceFrom);
            console.log('priceTo:', priceTo);
            searchCriteria.price = { $gte: priceFrom, $lte: priceTo }; // Tìm kiếm theo khoảng giá
        } else if (priceFrom) {
            searchCriteria.price = { $gte: priceFrom }; // Tìm kiếm theo giá lớn hơn hoặc bằng priceFrom
        } else if (priceTo) {
            searchCriteria.price = { $lte: priceTo }; // Tìm kiếm theo giá nhỏ hơn hoặc bằng priceTo
        }

        if (discount) {
            searchCriteria.discount = {$gt: 0}; // Tìm kiếm theo giảm giá
        }

        try {
            // Tìm kiếm sản phẩm dựa trên tiêu chí searchCriteria
            const products = await Product.find(searchCriteria);

            res.json({
                message: 'Search products successfully',
                data: products,
            });
        } catch (error) {
            console.log('Search error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = new ProductController();