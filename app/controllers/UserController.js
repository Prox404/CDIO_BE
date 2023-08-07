const User = require('../models/User/User');
const bcrypt = require('bcrypt');

class UserController {
    async getAllUser(req, res) {
        try {
            const users = await User.find({ role: 'user' }).select('-password');
            res.json({
                message: 'Fetch users successfully',
                data: users,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const user = await User.findByIdAndDelete(userId);
            res.json({
                message: 'Delete user successfully',
                data: user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    async addEmployee(req, res) {
        let { email, password, username, fullname, phone, address } = req.body;
        if (!(email && password && username)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }

        fullname = fullname ? fullname : null;
        phone = phone ? phone : null;
        address = address ? address : null;

        const user = new User({ email, password, username, fullname, phone, address, role: 'employee' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        try {
            await user.save();
            const { password, __v, ...data } = user._doc;
            res.status(200).send({ data });
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    async getAllUserByRole(req, res) {
        const id = req.params.id;
        console.log(id);
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            } else {
                if (user.role == 'admin') {
                    const users = await User.find({
                        $or: [
                            { role: 'user' },
                            { role: 'employee' }
                        ]
                    }).select('-password');
                    res.json({
                        message: 'Fetch users successfully',
                        data: users,
                    });
                } else if (user.role == 'employee') {
                    const users = await User.find({ role: 'user' }).select('-password');
                    res.json({
                        message: 'Fetch users successfully',
                        data: users,
                    });
                } else {
                    return res.status(400).json({ error: 'Permission denied' });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    async getUserById(req, res) {
        const id = req.params.id;
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            } else {
                res.json({
                    message: 'Fetch user successfully',
                    data: user,
                });
            }
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }

    async updateUser(req, res) {
        const id = req.params.id;
        let { email, password, username, fullname, phone, address } = req.body;

        try{
            const user = await User.findOne({ _id: id });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }else{
                if (email) {
                    user.email = email;
                }
                if (password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);
                }
                if (username) {
                    user.username = username;
                }
                if (fullname) {
                    user.fullname = fullname;
                }
                if (phone) {
                    user.phone = phone;
                }
                if (address) {
                    user.address = address;
                }
                await user.save();
                res.json({
                    message: 'Update user successfully',
                    data: user,
                });
            }
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }
}

module.exports = new UserController();