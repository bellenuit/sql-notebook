alasql.fn.gaussian = function(mean = 0, stdev = 1) {
	const u = 1 - Math.random();
	const v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * stdev + mean;
}

alasql.fn.numberformat = function(r) {
    const x = new Intl.NumberFormat('en-US',{maximumFractionDigits: 2}).format(r).replaceAll(","," ");
    return x;
};

alasql.aggr.stdev = function(value, accumulator, stage) {
	if (stage == 1) {
		const acc = [];
		acc[0] = value;
		acc[1] = value * value;
		acc[2] = 1;
		return acc;
	} else if (stage == 2) {
		accumulator[0] += value;
		accumulator[1] += value * value;
		accumulator[2] += 1;
		return accumulator;
	} else if (stage == 3) {
		const [sumx, sumx2, n] = accumulator;
		const meanx = (n > 0) ? sumx / n : 0;
		const meanx2 = (n > 0) ? sumx2 / n : 0;
		const variance = meanx2 - meanx * meanx;
		return Math.sqrt(variance);
	}
}
