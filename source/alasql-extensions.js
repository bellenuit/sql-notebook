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

lgamma = function(x) {
   if (x <= 1) return 0;
   const k = (x <100) ? Math.pow(1.035,1/(x-1)) : 1;
   return k*Math.log(Math.sqrt(2 * Math.PI *x)) + Math.log(x/Math.E) * x;
}

gammageometric = function(arr) { 
    const n = arr.reduce((partialSum, a) => partialSum + a, 0);
    const cut = arr.length/2;
    const row0 = arr.slice(0,cut).reduce((partialSum, a) => partialSum + a, 0)
    const row1 = arr.slice(cut).reduce((partialSum, a) => partialSum + a, 0)
    const cols = [];
    for (let i = 0; i < cut; i++) cols.push(arr[i]+arr[i+cut]);
    return Math.exp(lgamma(row0) + lgamma(row1) + cols.reduce((partialSum, a) => partialSum + lgamma(a),0) - arr.reduce((partialSum,a) => partialSum + lgamma(a),0) - lgamma(n));
}

generateFisherVariants = function(arr) {
if (arr.length == 0) return [];
if (arr.length == 2) return [arr]; 
const result = [];
const row0 = arr.slice(0,arr.length/2);
const row1 = arr.slice(arr.length/2);
const constraint = row0.reduce((partialSum,a) => partialSum + a, 0);
for (let i = 0; i <= constraint; i++ ) {
   let left0 = i;
   let left1 = row0[0] + row1[0] - i;
   if (left1 >= 0) {  
       let left01 = row0[0] + row0[1] - i;
       let left11 = row0[1] + row1[1] - left01;
       if (left01 >= 0 && left11 >= 0) { 
         let restarr = [left01].concat(arr.slice(2,arr.length/2)).concat([left11]).concat(arr.slice(arr.length/2+2));
         for (restvar of generateFisherVariants(restarr)) {
             result.push([left0].concat(restvar.slice(0,restvar.length/2)).concat([left1]).concat(restvar.slice(restvar.length/2)));
         }
       }
   }
}
return result;
}

fishertest = function(arr) { 
if (arr.length % 2) throw "fishertest uneven array";
const ppoint = gammageometric(arr);
const variants = generateFisherVariants(arr);
var p = 0;
var pelse = 0;
for (let v of variants) { 
   let t = gammageometric(v);
   if (t <= ppoint) p += t; 
}
return p;
}

alasql.into.FISHERTEST = function (filename, opts, data, columns, cb) { 
    let res = 1;
    const newtable = cleanName(filename);
    alasql("DROP TABLE IF EXISTS " + filename);
    alasql("CREATE TABLE " + filename);
    if (data.length != 2) throw "fishertest needs exactly 2 rows";
    const arr = [];
    for(let row of data) { 
        let fields = Object.keys(row);
        for(let i = 0; i < fields.length; i++) {
           arr.push(row[fields[i]]);echo(".");
        }
    }
    const f = fishertest(arr);
    alasql("INSERT INTO " + newtable + " (fishertest) VALUES (" + f + ")");
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
           item.k = fields[i]
           item.v = row[fields[i]];
           alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
        }
    }
	if (cb) {
		res = cb(res);
	}
	return res;
};

