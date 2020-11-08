function nnn(a) {
	var n, s, k;
	for (n = a, s = 0; n != 0; n = n / 10) {
		k = n % 10;
		s = s + k;
	}
	console.log(s);
}

let res = parseInt(process.argv[2]);
console.log(typeof res);

nnn(res);
