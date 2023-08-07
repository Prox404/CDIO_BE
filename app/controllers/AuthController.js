const bcrypt = require('bcrypt');

const User = require('../models/User/User');
const UserToken = require('../models/UserToken/UserToken');
const jwt = require('jsonwebtoken');
const { listenerCount } = require('../models/Cart/Cart');

class AuthController {

    async login(req, res) {
        const body = req.body;
        if (!(body.email && body.password)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }
        try {
            const user = await User.findOne({ email: body.email });
            if (!user) {
                return res.status(401).send({ error: "User not found" });
            }
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (!validPassword) {
                return res.status(401).send({ error: "Password is not correct" });
            }
            const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 });
            await new UserToken({ userId: user._id, token: refreshToken }).save();
            const { password, ...data } = user._doc;
            res.status(200).send({ data, accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }

    async signup(req, res) {
        let {email, password, username, fullname, phone, address} = req.body;
        if (!(email && password && username)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }

        fullname = fullname ? fullname : null;
        phone = phone ? phone : null;
        address = address ? address : null;

        const user = new User({ email, password, username, fullname, phone, address });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        try {
            await user.save();
            const { password, role, __v, ...data } = user._doc;
            res.status(200).send({ data });
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    async refreshToken(req, res) {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({ error: "You are not authenticated" });
        }
        try {
            const user = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
            const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            res.status(200).send({ accessToken });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }

    async logout(req, res) {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({ error: "You are not authenticated" });
        }
        try {
            const user = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
            await UserToken.deleteOne({ userId: user._id, token: refreshToken });
            res.status(200).send({ message: "User logged out" });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }
}

module.exports = new AuthController();