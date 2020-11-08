const jwt = require('jsonwebtoken');
const UserDetail = require('../db/models/user');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, 'yourfacegoeshere');
		const user = await UserDetail.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});
		if (!user) {
			throw new Error();
		}
		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'please authenticate' });
	}
};

module.exports = auth;