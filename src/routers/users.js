const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const UserDetail = require('../db/models/user');
const auth = require('../middleware/auth');
const { welcomeMessage, goodbyeMessage } = require('../emails/account');

const router = new express.Router();

// set upload destination
const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
			return cb(new Error('Only jpg,jpeg and png files are allowed!'));
		}
		cb(undefined, true);
	},
});

router.post('/user/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserDetail.findByCredentials(username, password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send();
	}
});

router.post('/user/signout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(tk => {
			return tk.token !== req.token;
		});
		await req.user.save();
		res.send('See you again!');
	} catch (e) {
		res.status(404).send();
	}
});

router.post('/user/shutdown', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send('Signed out of all devices!');
	} catch (e) {
		res.status(500).send(e);
	}
});

router.post('/signup', async (req, res) => {
	const user = new UserDetail(req.body);
	console.log(user);
	try {
		await user.save();
		welcomeMessage(user.username, user.email);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send({ error });
	}
});

router.get('/user/me', auth, async (req, res) => {
	res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
	const _id = req.params.id;

	try {
		const sp_user = await UserDetail.findById(_id);
		if (!sp_user) {
			return res.status(404).send('Not found');
		}
		res.send(sp_user);
	} catch (error) {
		res.status(500).send('not found big Error');
	}
});

router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send('Uploaded');
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await UserDetail.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

router.delete('/user/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		goodbyeMessage(req.user.username, req.user.email);
		res.send(req.user);
	} catch (e) {
		res.status(404).send();
	}
});

// edit user data!
router.patch('/user/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const availableData = ['username', 'details'];

	const validated = updates.every(value => availableData.includes(value));

	if (!validated) {
		res.status(400).send('Error with your datas');
	}

	try {
		updates.forEach(data => (req.user[data] = req.body[data]));
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
