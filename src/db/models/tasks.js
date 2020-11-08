const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},

		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'userdetails',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
const Task = mongoose.model('tasks-2', TaskSchema);

module.exports = Task;
