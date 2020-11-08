const express = require('express');
require('./db/mongoose');

// Routers
const tasksRouter = require('./routers/tasks');
const userRouter = require('./routers/users');
const app = express();
const port = process.env.PORT;

// MiddleWare
// app.use((req, res, next) => {
// 	if (req.method === 'GET' || 'POST' || 'PATCH' || 'DELETE') {
// 		return res.status(503).send('Maintainance Mode...');
// 	}
// 	next();
// });

// Middleware to parse JSON
app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, () => {
	console.log(`Pegasus is alive on port: ${port}`);
});

const multer = require('multer');

const upload = multer({
	dest: 'images',
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		// if(!file.originalname.endsWith('.pdf')) {
		if (!file.originalname.match(/\.(doc|docx)$/)) {
			return cb(new Error('Please upload a PDF file'));
		}
		cb(undefined, true);
	},
});

app.post('/upload', upload.single('uploadfile'), (req, res) => {
	res.send();
});
