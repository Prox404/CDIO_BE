const Cart = require('../models/Cart/Cart');
const Product = require('../models/Product/Product');
const User = require('../models/User/User');

class CartController {
    async AddCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;

            // Kiểm tra sự tồn tại của người dùng và sản phẩm
            const userExists = await User.findById(userId);
            const productExists = await Product.findById(productId);

            if (!userExists) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!productExists) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Tạo một đối tượng cartItem từ thông tin sản phẩm và số lượng
            const cartItem = {
                product: productId,
                quantity: quantity
            };

            // Tìm giỏ hàng của người dùng
            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                // Nếu giỏ hàng không tồn tại, tạo mới giỏ hàng cho người dùng
                cart = new Cart({
                    user: userId,
                    products: [cartItem]
                });
            } else {
                // Nếu giỏ hàng đã tồn tại, kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
                const existingProduct = cart.products.find(item => item.product.toString() === productId);

                if (existingProduct) {
                    // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng thêm số lượng
                    existingProduct.quantity += parseInt(quantity);
                } else {
                    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
                    cart.products.push({ product: productId, quantity: quantity });
                }
            }

            // Lưu giỏ hàng được cập nhật vào cơ sở dữ liệu
            const newCart = await cart.save();
            await newCart.populate('products.product');

            res.status(200).json({ message: 'Product added to cart successfully', data: newCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async ShowAll(req, res) {
        try {
            const userId = req.params.id;
            console.log(userId);
            let cart = await Cart.findOne({ user: userId }).populate('products.product');
            const products = cart.products.map((item) => {
                return {
                    product: item.product,
                    quantity: item.quantity,
                };
            });
            const populatedProducts = await Product.populate(products, { path: 'product' });
            cart.products = populatedProducts;
            cart.message = 'Get cart successfully';
            res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async DeleteAll(req, res) {
        try {
            const userId = req.params.id;
            const cart = await Cart.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            cart.products = [];
            const newCart = await cart.save();

            res.status(200).json({ message: 'Cart deleted successfully', data: newCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async Delete(req, res) {
        try {
            const { userId, productId } = req.body;

            const cart = await Cart.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            const newCart = await cart.save();

            res.status(200).json({ message: 'Product deleted successfully', data: newCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new CartController();