const Order = require('../models/Order/Order');
const Product = require('../models/Product/Product');
const User = require('../models/User/User');

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
                    return res.status(404).json({ error: `Product with ID ${productId} not found` });
                }

                // Lấy giá hiện tại của sản phẩm
                const currentPrice = productExists.price;

                // Tính tổng giá của đơn hàng
                total += currentPrice * quantity;

                // Tạo đối tượng sản phẩm trong đơn hàng
                const productInOrder = {
                    product: productId,
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

            res.status(200).json({
                message: 'Order created successfully',
                data: newOrder
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }

    async ShowAll(req, res) {
        try{
            const userId  = req.params.id;
            console.log(userId);
            const orders = await Order.find({ user: userId }).populate('products.product');
            console.log(orders);
            res.status(200).json({ message: 'All orders', data: orders });
        }catch(error){
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new OrderController();