const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
