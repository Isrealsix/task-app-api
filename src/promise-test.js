require('./db/mongoose');

const Task = require('./db/models/tasks');
const { findByIdAndUpdate } = require('./db/models/tasks');
const Tasks = require('./db/models/tasks');

// User.findByIdAndUpdate('5f83dccf6d14b00e707c91cb', { username: 'MikeRoss2' })
// 	.then(res => {
// 		console.log(res);
// 		return User.countDocuments({ details: 'I am happy' });
// 	})
// 	.then(res2 => {
// 		console.log(res2);
// 	})
// 	.catch(err => {
// 		console.log('an error has occured');
// 	});

// 5f81db71d2fc7a3244090d74

// asyn await on DB

// const findAndUpdate = async (id, completed) => {
// 	const update = await Tasks.findByIdAndUpdate(id, { completed });
// 	const count = await Tasks.countDocuments({ completed });
// 	return count;
// };

// findAndUpdate('5f81e3f67f484325744bb7c4', false)
// 	.then(res => {
// 		console.log(res);
// 	})
// 	.catch(er => {
// 		console.log('Error occured');
// 	});
