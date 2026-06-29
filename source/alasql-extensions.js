alasql.fn.gaussian = function(mean = 0, stdev = 1) {
	const u = 1 - Math.random();
	const v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * stdev + mean;
}

alasql.fn.findinset = function() {
	const val = arguments[0];
	const list = [];
	for (let i = 1; i < arguments.length; i++) list.push(arguments[i]);
	const v = list.indexOf(val);
	if (v == -1) return list.length;
	return v;
}


alasql.fn.ln = function(x) { return Math.log(x); }

alasql.fn.log2 = function(x) { return Math.log2(x); }

alasql.fn.log10 = function(x) { return Math.log10(x); }

alasql.fn.numberformat = function(r, d = 0, s=" ", p="") {
	
    if (d < 0) { console.log("minus " + d)
	    let divider = Math.pow(10,-d);
	    r = Math.round( r / divider ) * divider;
	    d = 0;
    }
    const x = new Intl.NumberFormat('en-US',{minimumFractionDigits: d, maximumFractionDigits: d}).format(r).replaceAll(",",s)+p;
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

alasql.into.DESERIALIZE = function (filename="", opts, data, columns, cb) { 
	    

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
        if (newtable)
            alasql("DROP TABLE IF EXISTS " + newtable);
       
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
        
        if (newtable) {
            const q = "CREATE TABLE " + newtable + "(" + rcol + ", " + Object.keys(cols).join(", ") + ")";
            console.log(q);
            alasql(q);
        }
        
        
        // complete missing values
        for(let r of Object.keys(list)) {
            for(let c of Object.keys(cols)) {
               if(typeof list[r][c] == "undefined")
                   list[r][c] = ".";
            }
        }
        
        if (newtable)
        for(let r of Object.keys(list)) {
           // echo(JSON.stringify(list[r]))
            alasql("INSERT INTO "+newtable+ " VALUES ?", [list[r]]);
        }
        
    if (!newtable) res = list;

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


loggamma = function(z) {
  // helper for logBeta()
  // plain Gamma() can easily overflow
  // Lanczos approximation g=5, n=7
  let coef = [ 1.000000000190015,
    76.18009172947146, -86.50532032941677,
    24.01409824083091, -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5 ];

  let logSqrtTwoPi = 0.91893853320467274178;

  // Gamma(z) = Pi / (Sin(Pi*z)) * Gamma(1-z))
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) -
      loggamma (1.0 - z);
  }

  let zz = z - 1.0;
  let b = zz + 5.5; // g + 0.5
  let sum = coef[0];

  for (let i = 1; i < coef.length; ++i)
    sum += coef[i] / (zz + i);

  return (logSqrtTwoPi + Math.log(sum) - b) +
    (Math.log(b) * (zz + 0.5));
}

lbeta = function(a, b) {
  return loggamma(a) + loggamma(b) - loggamma(a + b);
}

vecmake = function (n, val) {
  // source anova.js
  let result = [];
  for (let i = 0; i < n; ++i) {
    result[i] = val;
  }
  return result;
}

contfraction = function (x, a, b) {
  // source anova.js
  let maxTerms = 100;
  // 1. pre-compute 100 d values
  let d = vecmake(maxTerms, 0.0); // d[0] not used

  let end = maxTerms / 2;  // 50
  for (let m = 0; m < end; ++m)  {  // [0,49]
    let i = 2 * m;  // even di
    let j = i + 1;  // odd di
    d[i] = (m * (b - m) * x) / ((a + 2 * m - 1) *
      (a + 2 * m));
    d[j] = -1 * ((a + m) * (a + b + m) * x) / ((a + 2 * m) *
      (a + 2 * m + 1));
  }

  // 2. work backwards
  let t = vecmake(maxTerms, 0.0);  // t[0] not used
  // ex:
  // t[4] = (1 + d[4]) / 1;
  // t[3] = (1 + d[3]) / t[4];
  // t[2] = (1 + d[2]) / t[3];
  // t[1] = (1 + d[1]) / t[2];
  // cf = 1 / t[1];

  t[maxTerms - 1] = 1 + d[maxTerms - 1];
  for (let j = maxTerms - 2; j >= 1; --j)
    t[j] = 1 + d[j] / t[j + 1];

  let cf = 1 / t[1];
  return cf;
}

regincompletebeta = function (x, a, b) {
  // source anova.js
  // regularized incomplete beta
  // Abramowitz and Stegun 26.5.8 
  // calls logBeta() and helper contFraction()
  // logBeta() calls sub-helper logGamma()
  let cf = contfraction(x, a, b);
  let logTop = (a * Math.log(x)) + (b * Math.log(1 - x));
  let logBot = Math.log(a) + lbeta(a, b);
  let logLeft = logTop - logBot;
  let left = Math.exp(logLeft);

  return left * cf;  // should be in [0.0, 1.0]
}

regincbeta = function (x, a, b) {
  // source anova.js
  // Abramowitz and Stegun 26.5.6
  // pick the form of regIncompleteBeta() that converges best
  if (x < (a + 1.0) / (a + b + 2.0))
    return regincompletebeta(x, a, b);
  else
    return 1.0 - regincompletebeta(1 - x, b, a);
}

fdist = function(fstat, df1, df2) {
  // source anova.js
  // right tail of F-dist past fstat
  let x = df2 / (df2 + df1 * fstat);
  let a = df2 / 2;
  let b = df1 / 2;
  return regincbeta(x, a, b);
}

alasql.fn.fdist = function(fstat, df1, df2) {
  // source anova.js
  // right tail of F-dist past fstat
  let x = df2 / (df2 + df1 * fstat);
  let a = df2 / 2;
  let b = df1 / 2;
  return regincbeta(x, a, b);
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

fishertest = function(arr) { console.log(arr);
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

alasql.into.FISHERTEST = function (filename="", opts, data, columns, cb) { 
    let res = 1;
    const newtable = cleanName(filename);
    if (newtable) {
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable);
    }
    if (data.length < 2) throw "fishertest needs at least exactly 2 rows";
    
    const list = [];
    
    for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data.length; j++) {
	    
	    if (i>=j) continue;
    
	    let arr = [];
	    var row;
	    
	    row = data[i];	    
	    var fields = Object.keys(row);
	        for(let ii = 0; ii < fields.length; ii++) {
	           arr.push(row[fields[ii]]);echo(".");
	        }
	    
	    row = data[j];	    
	    fields = Object.keys(row);
	        for(let ii = 0; ii < fields.length; ii++) {
	           arr.push(row[fields[ii]]);echo(".");
	        }
	    
	    let item = {};
	    item.a = i;
	    item.b = j;
	    item.f = fishertest(arr);
	    
	    list.push(item);
	    
	    if (newtable) alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
	}}    
	
	if (!newtable) res = list;
	 
	if (cb) {
		res = cb(res);
	}
	return res;
};


alasql.fn.levenshtein = (str10 = '', str20 = '') => {
   // Create a 2D array to store distances
   const str1 = str10 ?? '';
   const str2 = str20 ?? '';
   
   if (str1.length === undefined) return str2.length;
 
   if (str2.length === undefined) return str1.length;
      
   const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
   
   // Initialize first row (deletions from str1)
   for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
   }
   
   // Initialize first column (insertions to str1)
   for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
   }
   
   // Fill the matrix
   for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
         track[j][i] = Math.min(
            track[j][i - 1] + 1,     // deletion
            track[j - 1][i] + 1,     // insertion
            track[j - 1][i - 1] + indicator, // substitution
         );
      }
   }
   
   return track[str2.length][str1.length];
};


alasql.into.MOVINGAVERAGE = function (filename="", opts = 12, data, columns, cb) { 
    let res = 1;
	const newtable = cleanName(filename);
	const firstrow = data[0] ?? {};
    const columnnames = Object.keys(firstrow);
    if (columnnames.length < 2) {
	    throw new Error('MOVINGAVERAGE expects at least 2 columns');
    }
    firstfield = columnnames[0];
    let xcols = [];
    let arrs = [];
    for (let i = 1; i < columnnames.length; i++) xcols.push(columnnames[i]);
    for (let i = 1; i < columnnames.length; i++) arrs.push([]);
    const n = opts;

    if (newtable) {
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable); 
    }
    
    const list = [];
    
    for(let row of data) {
	    
        for (let i = 1; i < columnnames.length; i++) {
	        arrs[i-1].push(row[xcols[i-1]])
			if (arrs[i-1].length > n) arrs[i-1].shift();
        }
        
        let item = {};
		item[firstfield] = row[firstfield];
		for (let i = 1; i < columnnames.length; i++) 
			item[xcols[i-1]] = arrs[i-1].reduce((partialSum, a) => partialSum + a, 0) / arrs[i-1].length;
	    list.push(item);
	    if (newtable)
		    alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
    }
    if (!newtable) res = list;
	if (cb) {
		res = cb(res);
	}
	return res;
};

alasql.into.PERCENTAGE = function (filename="", opts=100, data, columns, cb) { 
    let res = 1;
	const newtable = cleanName(filename);
	if (newtable) {
        alasql(`drop table if exists ${newtable}`);
        alasql(`create table ${newtable}`);
    }
    if(!data.length) throw "percentage zero rows";
    const keys = Object.keys(data[0]); 
    if (keys.length < 2) throw "percentage expects at least 2 columns";
;
    const collection = [];
    for (let i = 1; i < keys.length; i++) {
    	var list = data.slice();
    	vsum = list.map( row => row[keys[i]]).reduce((ps, a) => ps + a, 0)
    	list = list.map ( row => ( {...row, _vsum: vsum, _full: Math.floor((opts+1)/vsum*row[keys[i]]), _rest: 0 } ) );
    	rest = opts - list.reduce ( (ps, row) => ps + row._full + row._rest, 0)
    	for(let i = 0; i < rest; i++) {
        	list = list.map( row => ({...row, _partial: row[keys[i]]/(row._full + row._rest + 1)})).sort( (a,b) => (a._partial <= b._partial) );
        	list[0]._rest++;
    	}
    	list = list.map( row =>  ({ ...row, p: row._full + row._rest }) );
    	collection.push(list.slice());
    }
    const list2 = []; 
    for (let i in collection[0]) {
    	row = collection[0][i];
        let item = {};
        for (let k of keys) item[k] = row[k];
        for (let j in collection) {
        	row = collection[j][i];
        	item[keys[parseInt(j)+1]+"_p"] = row.p;
        }
        
        
        list2.push(item);
       if (newtable) alasql(`insert into ${newtable} values ?`, [item]);
    } 
    if (!newtable) res = list2;
	if (cb) {
		res = cb(res);
	}
	return res;
};


alasql.fn.regexreplace = function(s,pattern,replacement,flags="g") {
	pattern = new RegExp(pattern,flags);
	if (flags.indexOf("g")>-1) 
		return s.replaceAll(pattern, replacement);
    else 
        return s.replace(pattern, replacement);
};



alasql.into.REGRESSION = function (filename="", opts, data, columns, cb) { 
        let res = 1;
	const newtable = cleanName(filename);
    const firstrow = data[0] ?? {};
    const columnnames = Object.keys(firstrow);
    if (columnnames.length < 2) {
	    throw new Error('REGRESSION expects at least 2 columns');
    }
    console.log(columnnames);
    if (newtable) {
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable);
    }
    const list = [];
    for(let i = 0; i < columnnames.length; i++) {
    for(let j = 0; j < columnnames.length; j++) {
	    
	    if (i==j) continue;
    
	    xcol = columnnames[i];
	    ycol = columnnames[j];
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
	    let item = {};
	    let vxx = (sumx2 - sumx * sumx / n) / n;
	    let vyy = (sumy2 - sumy * sumy / n) / n;
	    let vxy = (sumxy - sumx * sumy / n) / n;
	    item.x= columnnames[i];
	    item.y= columnnames[j];	    
	    item.a = (sumy * sumx2 - sumx * sumxy) / (n * sumx2 - sumx * sumx );
	    item.b = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
	    item.r  = vxy / Math.sqrt(vxx * vyy);
	    item.xmean = sumx/n;
	    
	    /* calculate residuals, we need to loop again */
	    /* https://en.wikipedia.org/wiki/Simple_linear_regression */ 
	    
	    var sumerr2 = 0;
	    var sumdx2 = 0;
	    for(let row of data) {
		    let x = row[xcol];
		    let y = row[ycol];
		    let ye = item.a + item.b * x;
		    let e = y - ye;
		    sumerr2 += e * e;
		    sumdx2 += (x -item.xmean)*(x-item.xmean);
        }
        item.mqr = Math.sqrt( sumerr2 / (n-2) ); //2 degrees of freedom
        item.sa = Math.sqrt( sumerr2 * sumx2 / sumdx2 / n / (n-2))	; 
        item.sb = Math.sqrt(sumerr2 / sumx2 / (n-1) )	;   
        item.sumdx2 = sumdx2; 
        
        // we need also calculate t for 0.95
        t975values = [0,12.71,4.303,3.182,2.776,2.571,2.447,2.365,2.306,2.262,2.228,2.201,2.179,2.160,2.145,2.131,2.120,2.110,2.093,2.086,2.98,2.074,2.069,2.064,2.06,2.056,2.052,2.048,2.045,2.042];
        item.t975 = (n -2 < 31) ? t975values[n-2] : 2.000;
        item.n = n;
        item.sqr = sumerr2;
        
        if (vyy == 0) {
         item.a = sumx/n;
         item.b = 0;
         item.r = 0;
         item.sqr = 0;
      } 
	    
	    list.push(item);
	    if (newtable)
	        alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
	    
	}}
	
	if (!newtable) res = list;

	if (cb) {
		res = cb(res);
	}
	return res;
};

alasql.into.SERIALIZE = function (filename="", opts, data, columns, cb) { 
    let res = 1;
	const newtable = cleanName(filename);
	if (newtable) {
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable);
    }
    const list = [];
    for(let row of data) {
        let fields = Object.keys(row);
        let firstfield = fields[0];
        for(let i = 1; i < fields.length; i++) {
           let item = {};
           item[firstfield] = row[fields[0]];
           item.k = fields[i]
           item.v = row[fields[i]];
           list.push(item);
           if (newtable)
               alasql("INSERT INTO " + newtable + " VALUES ?", [item]);
        }
    }
    if (!newtable) res = list;
	if (cb) {
		res = cb(res);
	}
	return res;
};

alasql.into.SERIALIZECOLUMN = function (filename="", opts='', data, columns, cb) { 
    // separates the last column based on regex defined in opts
    let res = 1;
	const newtable = cleanName(filename);
	if (newtable) {
        alasql("DROP TABLE IF EXISTS " + newtable);
        alasql("CREATE TABLE " + newtable);
    }
    const list = [];
    const separator = new RegExp(opts);
    for(let row of data) {
        let fields = Object.keys(row);
        let column = fields[fields.length-1];
        let columnvalues = row[column].split(separator);
        //console.log(columnvalues);
        for(let i = 0; i < columnvalues.length; i++) {
           const row2 = structuredClone(row)
           row2[column] = columnvalues[i];
           //console.log(i)
           //console.log(columnvalues[i]);
           //console.log(row);
           list.push(row2);
           if (newtable)
           alasql("INSERT INTO " + newtable + " VALUES ?", [row2]);
        }
    }
    if (!newtable) res = list;
	if (cb) {
		res = cb(res);
	}
	return res;
};


alasql.into.CHOW = function (filename="", opts=0.05, data0, columns, cb) { 
    let res = 1;
    const newtable = cleanName(filename);
    if (newtable) {
    alasql("DROP TABLE IF EXISTS " + newtable);
    alasql("CREATE TABLE " + newtable + "(level,p, T, x1, x2, n,a,b,r)");
     }
//    echo(JSON.stringify(columns));
    const firstcolumn = columns[0].columnid;
    const secondcolumn = columns[1].columnid;
    const data = data0.map( row => ({"x": row[firstcolumn], "y": row[secondcolumn] }) ); 

    function regression (data,xc,yc) {
        const sumx = data.map( row => row[xc] ).reduce((ps, a) => ps + a, 0);
        const sumx2 = data.map( row => row[xc]*row[xc]).reduce((ps, a) => ps + a, 0);
      const sumy = data.map( row => row[yc] ).reduce((ps, a) => ps + a, 0);
      const sumy2 = data.map( row => row[yc]*row[yc]).reduce((ps, a) => ps + a, 0);
      const sumxy = data.map( row => row[xc]*row[yc]).reduce((ps, a) => ps + a, 0);
      const n = data.length;

      const item = {};
      const vxx = (sumx2 - sumx * sumx / n) / n;
      const vyy = (sumy2 - sumy * sumy / n) / n;
      const vxy = (sumxy - sumx * sumy / n) / n;
      item.a = (sumy * sumx2 - sumx * sumxy) / (n * sumx2 - sumx * sumx );
      item.b = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
      item.r  = vxy / Math.sqrt(vxx * vyy);

      item.n  = n;
      item.xmean = sumx/n; 
      item.sqr = data.map( row => item.a + row.x * item.b - row.y).map( e => e*e).reduce((ps,a) => ps + a, 0);

      if (vyy == 0) {
         item.a = sumy/n;
         item.b = 0;
         item.r = 0;
         item.sqr = 0;
      } 
      return item;    
    }

    function chow(data,low,high) {
// echo ("<br>low high "+low+" "+high);

const limits = data.map( row => row.x);
    if (limits.length < 10) return []; 

    const minx = low+4;
    const maxx = high-4;
    if (minx === undefined || maxx === undefined || minx > maxx) return [];

   const R0 = regression(data.slice(low,high),"x","y");

//   echo(JSON.stringify(R0));

    const items = []; 
for (let i = minx; i < maxx; i++) {
    let R1 = regression(data.slice(low,i),"x","y");
    let R2 = regression(data.slice(i,high),"x","y");

  //  echo(JSON.stringify(R2));
    let k = 3;
    let T = ((R0.sqr - R1.sqr - R2.sqr) / k ) / ( ( R1.sqr + R2.sqr ) / ( R1.n + R2.n - 2 * k) );


    let p = alasql.fn.fdist(T,k,R1.n + R2.n - 2 * k) ?? 1;
//        echo("<br>"+[R0.sqr, R1.sqr, R2.sqr,f,p]);
    const item = {};
    item.xt = i;
    item.p = p;
    item.T = T;
    item.n1 = R1.n;
    item.n2 = R2.n;
    item.a1 = R1.a;
    item.a2 = R2.a;
    item.b1 = R1.b;
    item.b2 = R2.b;
    item.r1 = R1.r;
    item.r2 = R2.r;
    items.push(item);
 }
//echo(" - "+items.length);

 
    items.sort( (a,b) => a.p >= b.p); 
    const result = items[0];
    
    const lines = []; 
    if (result.p <= opts) {

    const line1 = {};
    line1.level = 1;
    line1.p = result.p;
    line1.T = result.T;
    line1.x1 = limits[low];
    line1.x2 = limits[result.xt-1];
    line1.n = result.n1;
    line1.a = result.a1;
    line1.b = result.b1;
    line1.r = result.r1;

    const line2 = {};
    line2.level = 1;
    line2.p = result.p;
    line2.T = result.T;
    line2.x1 = limits[result.xt];
    line2.x2 = limits[high-1];
    line2.n = result.n2;
    line2.a = result.a2;
    line2.b = result.b2;
    line2.r = result.r2;
    
    if (line1.n >= 10) {
        let newlines = chow(data,low,result.xt);
        if (newlines.length) line1.level = 0;
        for(let line of newlines)
            lines.push(line);
    } 
    lines.push(line1);
    if (line2.n >= 10) {
        let newlines = chow(data,result.xt,high);
        if (newlines.length) line2.level = 0;
        for(let line of newlines)
            lines.push(line);
    }
    lines.push(line2);     
    }
    

    return lines;
    }

    const lines = [];

    const line0 = {};
    line0.level = 1;
    line0.p = 1;
    line0.T = 0;
    line0.x1 = data[0]["x"];
    line0.x2 = data[data.length-1]["x"];
    line0.n =  data.length; 
    const R0 = regression(data,"x","y");
    line0.a = R0.a;
    line0.b = R0.b;
    line0.r = R0.r; 

 
    let newlines = chow(data,0,data.length);
     
    if (newlines.length) line0.level = 0;
    for (let line of chow(data,0,data.length))
    lines.push(line);

    lines.push(line0);
 
if (newtable)
for(let line of lines)
    alasql(`insert into ${newtable} values ?`, [line]);

//echo("zzu " + Math.random());
if (!newtable)
   res = lines;

 if (cb) {
		res = cb(res);
	}
 return res;
}

