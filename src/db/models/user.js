const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');
const JWTKEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		details: {
			type: String,
		},
		email: {
			type: String,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			validate(val) {
				if (val.length < 7) {
					throw new Error('Your password should be greater than 6');
				}

				if (val.includes('password')) {
					throw new Error('Your password shouldn\'t contain "password"');
				}
			},
		},
	},
	{
		timestamps: true,
	}
);

// for an instance of a data
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, JWTKEY);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

// hiding private data of every instances of user
userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	delete user.tokens;
	delete user.avatar;

	return user;
};

// To create a virtual property
userSchema.virtual('toTask', {
	ref: 'tasks-2',
	localField: '_id',
	foreignField: 'owner',
});

// for all data
userSchema.statics.findByCredentials = async (username, password) => {
	const user = await UserDetail.findOne({ username });
	if (!user) {
		throw new Error('Unable to login');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user;
};

// hash password before saving
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 8);
	}
	// console.log(this.password, this, 'just b4 saving...');
	next();
});

// Delete all users task when they delete their account!

userSchema.pre('remove', async function (next) {
	await Task.deleteMany({ owner: this._id });

	next();
});

const UserDetail = mongoose.model('userdetails', userSchema);

module.exports = UserDetail;
