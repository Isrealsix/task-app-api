const add = (a, b) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(a + b);
		}, 2000);
	});
};

const doWork = async () => {
	const sum1 = await add(1, 1);
	const sum2 = await add(sum1, 1);
	const sum3 = await add(sum2, 1);
	if (sum3 < 6) {
		throw new Error('number is lesser than 6');
	}
	return sum3;
};

doWork()
	.then(res => {
		console.log(res);
	})
	.catch(er => {
		console.log('err:', er);
	});
