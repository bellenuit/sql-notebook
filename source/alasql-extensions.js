alasql.fn.gaussian = function(mean = 0, stdev = 1) {
	const u = 1 - Math.random();
	const v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * stdev + mean;
}

alasql.fn.ln = function(x) { return Math.log(x); }

alasql.fn.log2 = function(x) { return Math.log2(x); }

alasql.fn.log10 = function(x) { return Math.log10(x); }

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

alasql.into.DESERIALIZE = function (filename, opts, data, columns, cb) { 
	    

        let res = 1;
	    const newtable = cleanName(filename);
	    const firstrow = data[0] ?? {};
	    const columnnames = Object.keys(firstrow);
	    if (columnnames.length < 3) {
		    throw new Error('DESERIALZE expects 3 columns');
	    }
        const rcol = columnnames[0];
        const ccol = columnnames[1];
        const vcol = columnnames[2];
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable);
        // collect a list of columns
        const cols = {};
        // collect all values
        const list = {};
        for(let row of data) {
            let r = row[rcol];
            let c = cleanName(row[ccol]);
            let v = row[vcol];
            if (!list[r]) list[r] = {};
            list[r][rcol] = r;
            list[r][c] = v;
            cols[c] = 1;
        }
        // complete missing values
        for(let r of Object.keys(list)) {
            for(let c of Object.keys(cols)) {
               if(typeof list[r][c] == "undefined")
                   list[r][c] = "";
            }
        }

        for(let r of Object.keys(list)) {
           // echo(JSON.stringify(list[r]))
            alasql("INSERT INTO "+newtable+ " VALUES ?", [list[r]]);
        }

	if (cb) {
		res = cb(res);
	}
	return res;
};

alasql.into.MOVINGAVERAGE = function (filename, opts = 12, data, columns, cb) { 
    let res = 1;
	const newtable = cleanName(filename);
	const firstrow = data[0] ?? {};
    const columnnames = Object.keys(firstrow);
    if (columnnames.length < 2) {
	    throw new Error('MOVINGAVERAGE expects  2 columns');
    }
    firstfield = columnnames[0];
    xcol = columnnames[1];
    const arr = [];
    const n = opts;

    alasql("DROP TABLE IF EXISTS " + newtable);
    alasql("CREATE TABLE " + newtable);
    
    for(let row of data) {
	    
        arr.push(row[xcol])
        if (arr.length > n) arr.shift();
        
        let item = {};
		item[firstfield] = row[firstfield];
		item[xcol] = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length;
		
		alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
    }
	if (cb) {
		res = cb(res);
	}
	return res;
};



alasql.into.REGRESSION = function (filename, opts, data, columns, cb) { 
        let res = 1;
	const newtable = cleanName(filename);
    const firstrow = data[0] ?? {};
    const columnnames = Object.keys(firstrow);
    if (columnnames.length < 2) {
	    throw new Error('REGRESSION expects 2 columns');
    }
    console.log(columnnames);
    xcol = columnnames[0];
    ycol = columnnames[1];
    alasql("DROP TABLE IF EXISTS " + newtable);
    alasql("CREATE TABLE " + newtable);
    var n = 0;
    var sumx = 0;
    var sumy = 0;
    var sumx2 = 0;
    var sumy2 = 0;
    var sumxy = 0;
    for(let row of data) {
        n++;
        sumx += row[xcol];
        sumy += row[ycol];
        sumx2 += row[xcol] * row[xcol];
        sumy2 += row[ycol] * row[ycol];
        sumxy += row[xcol] * row[ycol];
    }
    const item = {};
    const vxx = (sumx2 - sumx * sumx / n) / n;
    const vyy = (sumy2 - sumy * sumy / n) / n;
    const vxy = (sumxy - sumx * sumy / n) / n;
    item.a = (sumy * sumx2 - sumx * sumxy) / (n * sumx2 - sumx * sumx );
    item.b = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
    item.r  = vxy / Math.sqrt(vxx * vyy);
    alasql("INSERT INTO " + newtable + " VALUES ?", [item]);

	if (cb) {
		res = cb(res);
	}
	return res;
};

alasql.into.SERIALIZE = function (filename, opts, data, columns, cb) { 
    let res = 1;
	const newtable = cleanName(filename);
    alasql("DROP TABLE IF EXISTS " + filename);
    alasql("CREATE TABLE " + filename);
    for(let row of data) {
        let fields = Object.keys(row);
        let firstfield = fields[0];
        for(let i = 1; i < fields.length; i++) {
           let item = {};
           item[firstfield] = row[fields[0]];
           item.c = fields[i]
           item.v = row[fields[i]];
           alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
        }
    }
	if (cb) {
		res = cb(res);
	}
	return res;
};

