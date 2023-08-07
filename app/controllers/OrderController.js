const Order = require('../models/Order/Order');
const Product = require('../models/Product/Product');
const User = require('../models/User/User');
const Cart = require('../models/Cart/Cart');

class OrderController {
    async AddOrder(req, res) {
        try {
            const { userId, products, address, phone, note, transportFee } = req.body;
            console.log(req.body);

            // Kiểm tra sự tồn tại của người dùng
            const userExists = await User.findById(userId);

            if (!userExists) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Tạo danh sách sản phẩm trong đơn hàng
            const productsInOrder = [];
            let total = 0;

            for (const productInfo of products) {
                const { productId, quantity } = productInfo;

                // Kiểm tra sự tồn tại của sản phẩm
                const productExists = await Product.findById(productId);

                if (!productExists) {
                    console.log(productExists);
                    return res.status(404).json({ error: `Product with ID ${productId} not found` });
                }

                // Lấy thông tin chi tiết của sản phẩm
                const productDetails = {
                    _id: productExists._id,
                    name: productExists.name,
                    price: productExists.price,
                    // Thêm các thuộc tính khác của sản phẩm tùy vào yêu cầu của bạn
                };

                // Tính tổng giá của đơn hàng
                const currentPrice = productExists.price;
                total += currentPrice * quantity;

                // Tạo đối tượng sản phẩm trong đơn hàng
                const productInOrder = {
                    product: productDetails,
                    quantity: quantity,
                    currentPrice: currentPrice,
                };

                productsInOrder.push(productInOrder);
            }

            // Tạo đối tượng Order mới
            const newOrder = new Order({
                user: userId,
                products: productsInOrder,
                status: 0,
                address: address,
                phone: phone,
                total: total,
                note: note,
                transportFee: transportFee || 0,
                orderDate: new Date(),
            });

            // Lưu đơn hàng vào cơ sở dữ liệu
            await newOrder.save();

            const cart = await Cart.findOneAndUpdate(
                { user: userId },
                { $pull: { products: { product: { $in: products.map((p) => p.productId) } } } },
                { new: true }
            ).populate('products.product');

            let data = {
                order: newOrder,
                cart: cart,
            };
            data.order.fullname = userExists.fullname;

            res.status(200).json({
                message: 'Order created successfully',
                data: data,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }

    async ShowAll(req, res) {
        try {
            const userId = req.params.id;
            console.log(userId);
            const orders = await Order.find({ user: userId }).populate('products.product');
            console.log(orders);
            res.status(200).json({ message: 'All orders', data: orders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllPendingOrders(req, res) {
        try {
            const orders = await Order.find().populate('user');
            res.status(200).json({ message: 'All pending orders', data: orders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async setStatus1(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findByIdAndUpdate(orderId, { status: 1 }, { new: true });
            res.status(200).json({ message: 'Order status updated', data: order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async setStatus2(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findByIdAndUpdate(orderId, { status: 2 }, { new: true });
            res.status(200).json({ message: 'Order status updated', data: order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async setStatus3(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findByIdAndUpdate(orderId, { status: 3 }, { new: true });

            // Lấy danh sách sản phẩm từ đơn hàng
            const productIds = order.products.map((product) => product.product);

            // Tăng số lượng sold của từng sản phẩm lên 1
            for (const productId of productIds) {
                await Product.findByIdAndUpdate(productId, { $inc: { sold: 1 } });
            }

            res.status(200).json({ message: 'Order status updated', data: order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getOrder(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId)
                .populate('user')
                .populate('products.product')
                .select('-user.password');
            res.status(200).json({ message: 'Order', data: order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new OrderController();