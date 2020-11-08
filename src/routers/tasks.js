const express = require('express');
const router = new express.Router();
const Tasks = require('../db/models/tasks');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
	const taskData = req.body;
	const taskOb = new Tasks({
		...taskData,
		owner: req.user._id,
	});

	try {
		const taskRes = await taskOb.save();
		res.send(taskRes);
	} catch (error) {
		res.status(500).send('Unable to create');
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Tasks.findOne({ _id, owner: req.user._id });
		if (!task) {
			res.status(404).send();
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

// GET all task, completed[false || true]
// /tasks?limit=3&skip=0
// /tasks?sortBy=createdAt~desc
router.get('/tasks', auth, async (req, res) => {
	const match = {};
	const sort = {};
	if (req.query.completed) {
		match.completed = req.query.completed === 'true';
	}
	if (req.query.sortBy) {
		const parts = req.query.sortBy.split('~');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}

	try {
		await req.user
			.populate({
				path: 'toTask',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();

		res.send(req.user.toTask);
	} catch (err) {
		res.status(500).send();
	}
});

router.patch('/task/:id', auth, async (req, res) => {
	const getKeys = Object.keys(req.body);
	const availableData = ['username', 'description', 'password'];
	const isAvailable = getKeys.every(key => availableData.includes(key));
	if (!isAvailable) {
		return res.status(404).send({ error: "That data isn't in the DB" });
	}
	try {
		const user = await Tasks.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});
		// const update = await UserDetail.findByIdAndUpdate(req.params.id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });
		if (!user) {
			res.status(404).send('Please check your Id');
		}
		getKeys.forEach(key => (user[key] = req.body[key]));
		await user.save();
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch('/update/:id', async (req, res) => {
	const body = req.body;
	const bodyKeys = Object.keys(body);
	const availableKeys = ['username', 'details', 'password'];
	const isAvailable = bodyKeys.every(key => availableKeys.includes(key));

	if (!isAvailable) {
		return res.status(404).send('Criterias do not match');
	}

	try {
		const user = await UserDetail.findById(req.params.id);
		bodyKeys.forEach(key => (user[key] = body[key]));
		await user.save();
		if (!user) {
			return res.status(400).send('Invalid ID');
		}
		res.send(user);
	} catch (error) {
		res.status(500).send({ error });
	}
});

router.delete('/task/:id', auth, async (req, res) => {
	try {
		const delUser = await Tasks.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});
		if (!delUser) {
			res.status(404).send('Not found');
		}
		res.send(delUser);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
