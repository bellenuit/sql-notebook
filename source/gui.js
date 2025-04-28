

function exportCSV(columns, values) {
	const lines = [];
	lines.push(columns.join(';'));
	for(let row of values) {
		const line = [];
		for(let field of row) {
			if (parseFloat(field) != 0 || field === "0") {
				line.push(field);
			} else {
				line.push('"' + field.replace('"','""') + '"');
			}
		}
		lines.push(line.join(';'));
	}
	return lines.join("\n");
}

// Create an HTML table
var tableCreate = function () {
	return function (columns, values) {
		const div = document.createElement('div');
		div.className = 'tablefilter';
		const id = Math.floor(Math.random() * 1000000);
		const input = document.createElement('input');
		input.id = 'tablefilter'+id;
		input.className = 'sortable';
		//input.onkeyup = function() {tablefilter(id)};
		input.setAttribute('onkeyup','tablefilter('+id+');');
		input.setAttribute('placeholder','Filter...');
	    const table = document.createElement('table');
	    table.id = "table"+id;
	    table.setAttribute('maxgrid',30);
	    const thead = document.createElement('thead');
	    for(let c of columns) {
		    let th = document.createElement('th');
		    th.innerHTML = c;
		    thead.appendChild(th);
	    }
	    table.appendChild(thead);
	    const tbody = document.createElement('tbody');
	    var i = 0;
	    for (let row of values) {
		    const tr = document.createElement('tr');
		    for (let f of row) {
			    const td = document.createElement('td');
			    td.innerHTML = f;
			    tr.appendChild(td);
		    }
		    i++;
		    if (i>30) tr.style.display = "none";
		    tbody.appendChild(tr);
	    }
 	    table.appendChild(tbody);
 	    if (values.length > 50 ) { 
	 	    input.width = table.width;
	 	    div.appendChild(input);
 	    }
 	    div.appendChild(table);
 	    

 	    const button = document.createElement('button');
 	    button.setAttribute('type','button');
 	    button.id = 'plus'+id;
 	    // button.onclick = function() {tableplus(id,50)};
 	    button.setAttribute('onclick','tableplus('+id+',30);');
 	    button.className = 'sortable';
 	    button.href = '#';
 	    button.innerHTML = '+';
 	    if (values.length > 50 ) {
	 	    button.style.display = '';
 	    } else {
 	    	button.style.display = 'none';
 	    }
	 	div.appendChild(button);	    
	 	    
 	    return div;
	}
}();

function tableplus(id,rowplus)
{
	console.log('tableplus '+id);
	const theid = id.toString();
	const input = document.getElementById('tablefilter' + theid);
	const table = document.getElementById('table' + theid);
	var maxgrid = table.getAttribute('maxgrid');
	maxgrid = maxgrid * 1.0 + rowplus * 1.0;;
	table.setAttribute('maxgrid',maxgrid);
	tablefilter(id); // call to update rendering
}


function tablefilter(id) {
  const theid = id.toString();
  const input = document.getElementById('tablefilter'+theid);
  const filter = input.value;
  const table = document.getElementById('table'+theid);
  const maxgrid = table.getAttribute('maxgrid');
  
  const tr = table.getElementsByTagName("tr");
  console.log('filter '+ filter);
  try {
 	 const regexfiler = new RegExp(filter, "i");
 	 
 	 var visiblerows = 0;
     var allvisible = true;
     
     for (let i = 0; i < tr.length; i++) {
	 	let th = tr[i].getElementsByTagName("th");
	 	if (th.length > 0) continue;
	
        // Hide the row initially.
        tr[i].style.display = "none";
  
        const td = tr[i].getElementsByTagName("td");
        for (let j = 0; j < td.length; j++) {
            let cell = tr[i].getElementsByTagName("td")[j];
            if (cell) {
	            if (cell.innerHTML.match(regexfiler)) {
		            if (maxgrid == '' || visiblerows < maxgrid) {
	                	tr[i].style.display = "";
						visiblerows++;	          
						break;
					}
	            }  else  {
		        	allvisible = false;
	        	}
        	} 
      	}
     }
     const plus = document.getElementById('plus'+theid);
     if (plus) {
  	     if (allvisible) {
  	         plus.style.display = "none"; 
  	     } else {
	  	     plus.style.display = "";
	  	 }
      } 
  } catch {
	return;
  }
  
}

function cellEditor(code, type = "wiki") {
	const id = Math.floor(Math.random() * 1000000);  // create unique id for console.log
    const node = document.createElement("DIV");   // build the HTML nodes
	node.id = "cell" + id;
	node.setAttribute("type", type);
    node.className = "cell " + type;
	const header = document.createElement("DIV"); 
	header.className = "cellheader";
	const runbutton = document.createElement("BUTTON");
	runbutton.id = "run" + id;
	runbutton.innerHTML = "Run";
	runbutton.onclick = function() {cellRun(id, false)};
	runbutton.className = "run";
	header.appendChild(runbutton);
    const rundownbutton = document.createElement("BUTTON");
	rundownbutton.id = "rundown" + id;
	rundownbutton.innerHTML = "Run Down";
	rundownbutton.onclick = function() {cellRun(id, true)};
	rundownbutton.className = "rundown";
	header.appendChild(rundownbutton);
	const wikibutton = document.createElement("BUTTON");
	wikibutton.id = "wiki" + id;
	wikibutton.innerHTML = "Wiki";
	wikibutton.onclick = function() {setWiki(id)};
	wikibutton.className = "wiki";
	header.appendChild(wikibutton);
	const sqlbutton = document.createElement("BUTTON");
	sqlbutton.id = "sql" + id;
	sqlbutton.innerHTML = "SQL";
	sqlbutton.onclick = function() {setSQL(id)};
	sqlbutton.className = "sql";
	header.appendChild(sqlbutton);
	const databutton = document.createElement("BUTTON");
	databutton.id = "data" + id;
	databutton.innerHTML = "Data";
	databutton.onclick = function() {setData(id)};
	databutton.className = "data";
	header.appendChild(databutton);
	const psbutton = document.createElement("BUTTON");
	psbutton.id = "ps" + id;
	psbutton.innerHTML = "PS";
	psbutton.onclick = function() {setPS(id)};
	psbutton.className = "ps";
	header.appendChild(psbutton);
	const jsbutton = document.createElement("BUTTON");
	jsbutton.id = "js" + id;
	jsbutton.innerHTML = "JS";
	jsbutton.onclick = function() {setJS(id)};
	jsbutton.className = "js";
	header.appendChild(jsbutton);
	const newbutton = document.createElement("BUTTON");
	newbutton.id = "new" + id;
	newbutton.innerHTML = "Insert";
	newbutton.onclick = function() {cellNew(id)};
	newbutton.className = "new";
	header.appendChild(newbutton);
	const editbutton = document.createElement("BUTTON");
	editbutton.id = "edit" + id;
	editbutton.innerHTML = "Edit";
	editbutton.onclick = function() {cellEdit(id)};
	editbutton.className = "edit";
	header.appendChild(editbutton);
	const upbutton = document.createElement("BUTTON");
	upbutton.id = "up" + id;
	upbutton.innerHTML = "Up";
	upbutton.onclick = function() {cellUp(id)};
	upbutton.className = "up";
	header.appendChild(upbutton);
	const downbutton = document.createElement("BUTTON");
	downbutton.id = "down" + id;
	downbutton.innerHTML = "Down";
	downbutton.onclick = function() {cellDown(id)};
	downbutton.className = "down";
	header.appendChild(downbutton); 
	const importbutton = document.createElement("BUTTON");
	importbutton.id = "import" + id;
	importbutton.innerHTML = "Import";
	importbutton.onclick = function() {cellImport(id)};
	importbutton.className = "import";
	header.appendChild(importbutton);
	const duplicatebutton = document.createElement("BUTTON");
	duplicatebutton.id = "duplicate" + id;
	duplicatebutton.innerHTML = "Dup";
	duplicatebutton.onclick = function() {cellDup(id)};
	duplicatebutton.className = "dup";
	header.appendChild(duplicatebutton);
	const deletebutton = document.createElement("BUTTON");
	deletebutton.id = "delete" + id;
	deletebutton.innerHTML = "Delete";
	deletebutton.onclick = function() {cellDelete(id)};
	deletebutton.className = "delete";
	header.appendChild(deletebutton);
	node.appendChild(header);
	const cancelbutton = document.createElement("BUTTON");
	cancelbutton.id = "cancel" + id;
	cancelbutton.innerHTML = "Cancel";
	cancelbutton.onclick = function() {cellCancel(id)};
	cancelbutton.className = "cancel";
	header.appendChild(cancelbutton);
	const savebutton = document.createElement("BUTTON");
	savebutton.id = "save" + id;
	savebutton.innerHTML = "OK";
	savebutton.className = "save";
	savebutton.onclick = function() {cellSave(id)};
	header.appendChild(savebutton);


	const source = document.createElement("TEXTAREA");   // build the HTML nodes
	source.id = "source" + id;
    source.className = "cellsource";
	source.setAttribute("readonly", true);
	source.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.max(this.scrollHeight, 16) + "px";
    });
	source.addEventListener("click", function() {
        this.style.height = "auto";
        this.style.height = Math.max(this.scrollHeight, 16) + "px";
    });
	// force at beginning, js dom does not know layout on load
    setTimeout(() => { source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
	source.innerHTML = code;
	node.appendChild(source);
	const bak = document.createElement("TEXTAREA");   // build the HTML nodes
	bak.id = "bak" + id;
    bak.className = "cellbak";
	bak.setAttribute("readonly", true);
	node.appendChild(bak);
	const output = document.createElement("DIV");   // build the HTML nodes
	output.id = "output" + id;
    output.className = "celloutput";
	node.appendChild(output);
	const console = document.createElement("DIV");   // build the HTML nodes
	console.id = "console" + id;
    console.className = "cellconsole";
	node.appendChild(console);
	return node;
}

function cellNew(id) {
	const cell = document.getElementById('cell'+id);
	let newcell = cellEditor("");
    const newid = newcell.id.replace('cell',''); 
	newcell.className = "cell " + newcell.getAttribute("type") + " edit"; 
	cell.after(newcell);
    newsource = document.getElementById('source' + newid);
    newsource.removeAttribute("readonly");
    newsource.focus();	
}

function cellDup(id) {
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
	let newcell = cellEditor(source.value);
	newcell.setAttribute("type", cell.getAttribute("type"))
    const newid = newcell.id.replace('cell',''); 
	newcell.className = "cell " + newcell.getAttribute("type") + " edit"; 
	cell.after(newcell);
    newsource = document.getElementById('source' + newid);
    newsource.removeAttribute("readonly");
	newsource.focus();	
}

function cellImport(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
    const input = document.createElement('input');
    input.type = 'file';
	input.onchange = _ => {
        const files = Array.from(input.files);
		const tablename = files[0].name.replace(".csv","");
        const reader = new FileReader();
        reader.onload = function(){ 
            source.innerHTML = tablename + "\n" + (reader.result);
        };
        reader.readAsText(input.files[0]);
    }
    input.click();
	setTimeout(() => { source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
}

function cellEdit(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id); 
	const bak = document.getElementById('bak'+id);
	bak.innerHTML = source.value;
	cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    source.removeAttribute("readonly");
	setTimeout(() => { source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
	source.focus();
}

function cellCancel(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
	const bak = document.getElementById('bak'+id);
	source.innerHTML = bak.innerHTML+"";
    source.setAttribute("readonly", true);
	source.outerHTML = source.outerHTML;  // force update textarea
	cell.className = "cell " + cell.getAttribute("type"); 
}

function cellSave(id) { 
	const cell = document.getElementById('cell'+id);
    const source = document.getElementById('source'+id);
    source.setAttribute("readonly", true);
	cell.className = "cell " + cell.getAttribute("type"); 
	if (cell.getAttribute("type") == "wiki") cellRun(id);
}

function cellUp(id) {
	const cell = document.getElementById('cell'+id);
	const previousCell = cell.previousSibling;
	cell.parentNode.insertBefore(cell, previousCell);
}

function cellDown(id) {
	const cell = document.getElementById('cell'+id);
	const nextcell = cell.nextSibling;
	nextcell.parentNode.insertBefore(nextcell, cell);
}

function cellDelete(id) { 
	const cell = document.getElementById('cell'+id);
	cell.parentElement.removeChild(cell);
}

runner = {};

function parseLists(str)
{
    return str.replace(/(?:(?:(?:^|\n)[\*#].*)+)/g, function (match) {
        var listType = match.match(/(^|\n)#/) ? 'ol' : 'ul';
        match = match.replace(/(^|\n)[\*#][ ]{0,1}/g, "$1");
        match = parseLists(match);
        return '<'
                + listType + '><li>'
                + match.replace(/^\n/, '')
                .split(/\n/).join('</li><li>')
                + '</li></' + listType
                + '>';
    });
}

runner.wiki = function(id, down = false) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    html = source.value;
	// 	// http://www.cs.sjsu.edu/faculty/pollett/masters/Semesters/Spring14/eswara/cs298/deliverable3/index1.php
	html = parseLists(html);
	html = "\n" + html.replace(/\r\n/g, "\n") + "\n";
	html = html.replace(/\n/gi, "<br/>");
	html = html.replace(/<br\/>====(.*?)====<br\/>/g, function (match, contents) {
        return '<h4>' + contents + '</h4>';
    });
    html = html.replace(/<br\/>===(.*?)===<br\/>/g, function (match, contents) {
        return '<h3>' + contents + '</h3>';
    });
	html = html.replace(/<br\/>==(.*?)==<br\/>/g, function (match, contents) {
        return '<h2>' + contents + '</h2>';
    });
	html = html.replace(/'''''(.*?)'''''/g, function (match, contents) {
        return '<b><i>' + contents + '</i></b>';
    });
    html = html.replace(/'''(.*?)'''/g, function (match, contents) {
        return '<b>' + contents + '</b>';
    });
    html = html.replace(/''(.*?)''/g, function (match, contents) {
        return '<i>' + contents + '</i>';
    });
	html = html.replace(/https:\/\/(\S+)/g, function (match, contents) {
        return '<a href="https://' + contents +'" target="_blank">https://' + contents + '</a>'; 
    });
	html = html.replace(/notebook:\/\/(\S+)/g, function (match, contents) {
        return '<a href="index.html?' + contents +'" target="_blank">' + contents + '</a>'; 
    });
	
    output.innerHTML = html;
	output.style.backgroundColor = 'white';
    output.outerHTML = output.outerHTML; 
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			}
			
		}
}


runner.sql = function(id, down = false) {
	const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
	// we do not know if there were single or multiple statements
	// if there were single statements, then we have to make an array of it.
	// workaround: we add a dummy statement to the commands to force multiple statements
	alasql.promise(source.value+"; SET dummy = 1;")
	.then(function(results){
		var s = "";
		for(elem of results) {
		   if (Array.isArray(elem)) {
			   let first = elem[0];
			   if (typeof first === 'object') {
			   let cols = Object.keys(first);
			   let values = [];
			   for(row of elem) {
				   let fields = [];
				   for(key in row) fields.push(row[key]);
				   values.push(fields);
			   }
			   //alert(JSON.stringify(values));
			   let table = tableCreate(cols, values);
			   s += table.outerHTML;
			   
			   let csv = exportCSV(cols, values);
			   let url = "data:text/csv;base64,"+btoaUnicode(csv);
		       let a = '<p class="link"><a href="' + url + '">CSV</a>';
		       s += a;
			   }
		   }
		}
		
		
		output.innerHTML = s;
		output.style.backgroundColor = 'white';
		output.outerHTML = output.outerHTML; // force
		
		if (down) { console.log("down "+id);
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				if (nextid != id)
					cellRun(nextid, true);
			}
			
		}
		
	}).catch(function(reason){
		console.log(reason);
		output.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
	});
}

// https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
// a proper state machine would be better
function parseCSV(str2) {
    const arr = [];
    let quote = false;  // 'true' means we're inside a quoted field
	var hadquote = false;  // when quoted, do not trim
    var row, col;

	// autodetect separator
	var comma = ",";
	const str = str2.trim();
	if (str.substr(0,80).indexOf(";") > -1) comma = ";";
	if (str.substr(0,80).indexOf("\t") > -1) comma = "\t";
	
	
	
    // Iterate over each character, keep track of current row and column (of the returned array)
    for (row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
		// trim when we start quote
        if (cc == '"') { if (!quote) arr[row][col]=""; quote = !quote; if (quote) hadquote = true; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column 
		// trim the unquoted value
        if (cc == comma && !quote) {  if (!hadquote) arr[row][col] = arr[row][col].trim(); ++col; hadquote = false; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
		// trim the unquoted value
        if (cc == '\r' && nc == '\n' && !quote) {  if (!hadquote) arr[row][col] = arr[row][col].trim();; ++row; col = 0; ++c; hadquote = false; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { if (!hadquote) arr[row][col] = arr[row][col].trim();;++row; col = 0; hadquote = false; continue; }
        if (cc == '\r' && !quote) { if (!hadquote) arr[row][col] = arr[row][col].trim();;++row; col = 0; hadquote = false; continue; }

        // Otherwise, append the current character to the current column
		// ignore if quote and we are after the quote
        if (! (hadquote && !quote)) arr[row][col] += cc;
		
    }
	 if (!hadquote && arr[row][col] !== undefined ) arr[row][col] = arr[row][col].trim();
	 
	 // make object array
	 const header = arr.shift();
	 const result = [];
	 for(var i in arr) {
		 const s = {};
		 for (var j in header) {
			 s[header[j]] = arr[i][j];
		 }
		 result.push(s);
	 }
	 
	 
    return result;
}




runner.data = function(id, down = false) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
	// we do not know if there were single or multiple statements
	// if there were single statements, then we have to make an array of it.
	// workaround: we add a dummy statement to the commands to force multiple statements

	const lines = source.value.split(/\r?\n/);
	const tablename = lines.shift();
	const data = lines.join("\n");
	console.log(data);
	const list = parseCSV(data);
	
    console.log(parseCSV(data));
	const header = lines.shift();
	var separator = ",";
	if (header.indexOf(";") > -1) separator = ";";
	if (header.indexOf("\t") > -1) separator = "\t";
	try {
	    console.log('DROP TABLE IF EXISTS '+tablename+'; CREATE TABLE '+tablename+"("+header.split(separator).join(",")+")");
		alasql('DROP TABLE IF EXISTS '+tablename+'; CREATE TABLE '+tablename+"("+header.split(separator).join(",")+")"); 
		for(let elem of list){
			// clean data type- after space
			const elem2 = {};
			for(let key in elem) {
				const key2 = key.replace(/\s.*/,"");
				const datatype = key.replace(/.*\s/,"");
				if (datatype == "number")
					elem2[key2] = parseFloat(elem[key]);
				else
					elem2[key2] = elem[key];
			}			
			console.log(elem2);
			alasql("INSERT INTO "+tablename+" VALUES ?", [elem2]);
		}
	}
	catch(reason){
		console.log(reason);
		output.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
		return;
	};

	const statement = "SELECT * FROM "+tablename;
	alasql.promise(statement+"; SET dummy = 1;")
	.then(function(results){
		var s = "";
		for(elem of results) {
		   if (Array.isArray(elem)) {
			   let first = elem[0];
			   if (typeof first === 'object') {
			   let cols = Object.keys(first);
			   let values = [];
			   for(row of elem) {
				   let fields = [];
				   for(key in row) fields.push(row[key]);
				   values.push(fields);
			   }
			   //alert(JSON.stringify(values));
			   let table = tableCreate(cols, values);
			   s += '<p>table '+tablename;
			   s += '<br>columns '+header;
			   s += '<br>rows '+values.length;
			   }
		   }
		}
		output.innerHTML = s;
		output.style.backgroundColor = 'white';
		output.outerHTML = output.outerHTML; // force
		
		if (down) { console.log("down");
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			}
			
		}
		
	}).catch(function(reason){
		console.log(reason);
		output.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
	});
}
echo = function () {};

runner.js = function(id, down = false) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    const code = source.value;
	
	output.innerHTML = "";
	echo = function(s) {
		output.innerHTML += s;
	}
	output.style.backgroundColor = 'white';
	const scriptnode = document.createElement("SCRIPT"); 
    scriptnode.innerHTML = "try { " + code + " } catch(reason) { console.log(reason); const c = document.getElementById('output'+"+id+"); c.innerHTML = '<pre class=error>'+reason+'</pre>'; c.style.backgroundColor = 'white'; }";
	document.body.appendChild(scriptnode);
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			}
			
		}
}

rpnOperators.table = function(context) {
    const [haslabel, tablename] = context.pop("number", "string");
    if (!tablename) return context;
	try {
		results = alasql("SELECT * FROM "+ tablename.value) ;
	} catch (reason) {
		context.error("databaserror");
		 return context;
	}
	list = [];
	list.push('[');
	console.log(results);
	elem = results;
	  
	   if (Array.isArray(elem)) {
		   let first = elem[0];
		   if (typeof first === 'object') {
			   let cols = Object.keys(first);
			   let values = [];
			   
			   list.push('[');
			   for(key in first) {
				   list.push('(' + key + ')');
			   }
			   list.push(']');
			   
			   for(row of elem) {
				   list.push('[');
				   var firstcolumn = true;
				   let fields = [];
				   for(key in row) {
					   if (firstcolumn && haslabel)
						   list.push('(' + row[key] + ')');
					   else
						   list.push(row[key]);
					   firstcolumn = false;
				   }
				   list.push(']');
				   
			   }
		   }
	   }
	   
	
	list.push(']');
	context = rpn(list.join(" "), context);
    return context;
};

rpnOperators.findfont = function(context) {
    const [n] = context.pop("name");
    if (!n) return context;
    if (!rpnFonts[n.value]) { 
		if (!fontfiles[n.value]) {
			context.error("invalidfont " );
            return context;
        }
        rpnFonts[n.value] = new rpnTTF(fontfiles[n.value]);
    }
    if (!rpnFonts[n.value]) {
        context.error("invalidfont " );
        return context;
    }
    if (rpnFonts[n.value].error) {
        context.error("invalidfont " + fonts[n.value].error );
        return context;
    }
    const dict = new rpnDictionary(1);
    dict.value.FontName = n;
    context.stack.push(dict);
    return context;
};


rpnProlog = "";

runner.ps = function(id, down = false) {
	console.log("ps");
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    const code = source.value;
	const scriptnode = document.createElement("TINY-PS");
	scriptnode.setAttribute("width","640");
	scriptnode.setAttribute("height","360");
	scriptnode.setAttribute("format","svgurl");
	scriptnode.innerHTML = code;
	scriptnode2 = document.createElement("TINY-PS");
	scriptnode2.id = "ps" + id;
	scriptnode2.setAttribute("width","640");
	scriptnode2.setAttribute("height","360");
	scriptnode2.setAttribute("format","svg");
	scriptnode2.setAttribute("error","1");
	
    scriptnode2.innerHTML = rpnProlog + " " + code;
	output.innerHTML = "";	
	
	output.style.backgroundColor = 'white';
	output.appendChild(scriptnode2);
	output.appendChild(scriptnode);
	
	
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			}
			
		}
}


function cellRun(id, down = false) {

	 const cell = document.getElementById('cell'+id);
	 const output = document.getElementById('output'+id);
	 output.style.backgroundColor = 'yellow';
     runner[cell.getAttribute("type")](id, down); 	 
     
}

function setWiki(id)
{
	const cell = document.getElementById('cell'+id);
    cell.setAttribute("type", "wiki"); 
	if (cell.className.indexOf("edit") > -1)
		cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    else
		cell.className = "cell " + cell.getAttribute("type");
	cellRun(id);
}

function setSQL(id)
{
	const cell = document.getElementById('cell'+id);
    cell.setAttribute("type", "sql");
	//const source = document.getElementById('source'+id);
	//source.ondrop = undefined;
	if (cell.className.indexOf("edit") > -1)
		cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    else
		cell.className = "cell " + cell.getAttribute("type");

}

function dropfile(file, id) {
  var reader = new FileReader();
  reader.onload = function(e) {
	const source = document.getElementById('source'+id);
    source.value = "drop\n" + e.target.result;
	source.outerHTML = source.outerHTML;
  };
  reader.readAsText(file, "UTF-8");
}

function setData(id)
{
	const cell = document.getElementById('cell'+id);
    cell.setAttribute("type", "data");
	if (cell.className.indexOf("edit") > -1)
		cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    else
		cell.className = "cell " + cell.getAttribute("type");
	
	/*
	const source = document.getElementById('source'+id);
	source.ondrop = function(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        dropfile(file, id);
    }
*/	
	
}

function setJS(id)
{
	const cell = document.getElementById('cell'+id);
    cell.setAttribute("type", "js");
	/* const source = document.getElementById('source'+id);
	source.ondrop = undefined;*/
	if (cell.className.indexOf("edit") > -1)
		cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    else
		cell.className = "cell " + cell.getAttribute("type"); 
}

function setPS(id)
{
	const cell = document.getElementById('cell'+id);
    cell.setAttribute("type", "ps");
	/* const source = document.getElementById('source'+id);
	source.ondrop = undefined;*/
	if (cell.className.indexOf("edit") > -1)
		cell.className = "cell " + cell.getAttribute("type") + " edit"; 
    else
		cell.className = "cell " + cell.getAttribute("type"); 
}

function openProject() {
    const input = document.createElement('input');
    input.type = 'file';
	input.onchange = _ => {
        const files = Array.from(input.files);
        const reader = new FileReader();
        reader.onload = function(){ 
            readProject(reader.result);
        };
        reader.readAsText(input.files[0]);
    }
    input.click();
// sinput.remove();    
  };
  
  
function readProject(json) {
	const zone = document.getElementById('cellzone');
	zone.innerHTML = "";
	console.log(json);
	const list = JSON.parse(json);
		for(const elem of list) {
			const cell = cellEditor(elem.source, elem.type);
			zone.appendChild(cell);
			const id = cell.getAttribute("id").replace("cell","");
			if (elem.type == 'wiki') cellRun(id);
		}
}

function btoaUnicode(s) {
    return btoa(encodeURIComponent(s).replace( /%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}
	));
};
        		

function saveProject()
{
	const result = [];
	var suggestedTitle = 'notebook';
	var first = true;;
	if (zone.hasChildNodes()) {
		const children = zone.childNodes;
		for (const cell of children) {
			const cellid = cell.id.replace("cell","");
			const source = document.getElementById('source' + cellid);
			result.push({"type": cell.getAttribute("type"), "source": source.value });
			if (first) {
				suggestedTitle = source.value.split('\n').shift().replaceAll('==','').replaceAll(' ','-').toLowerCase();
			}
			
			first = false;
		}
	}
	const link = document.createElement("a");
	link.href = "data:application/json;base64,"+btoaUnicode(JSON.stringify(result, null, 4));
    const d = new Date();
	link.download = suggestedTitle + '_'+d.toISOString().replaceAll("-","").replaceAll(":","").replaceAll("T","_").substr(0,13)+".json";
	document.body.appendChild(link); // firefox needs this
	link.click();
	link.remove();

}


const zone = document.getElementById('cellzone');
/*
cell = cellEditor(`DROP TABLE IF EXISTS employees;
CREATE TABLE employees( id          integer,  name    text,
                          designation text,     manager integer,
                          hired_on    date,     salary  integer,
                          commission  float,    dept    integer);

  INSERT INTO employees VALUES (1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4);
  INSERT INTO employees VALUES (2,'HARDING','MANAGER',9,'1998-02-02',52000,300,3);
  INSERT INTO employees VALUES (3,'TAFT','SALES I',2,'1996-01-02',25000,500,3);
  INSERT INTO employees VALUES (4,'HOOVER','SALES I',2,'1990-04-02',27000,NULL,3);
  INSERT INTO employees VALUES (5,'LINCOLN','TECH',6,'1994-06-23',22500,1400,4);
  INSERT INTO employees VALUES (6,'GARFIELD','MANAGER',9,'1993-05-01',54000,NULL,4);
  INSERT INTO employees VALUES (7,'POLK','TECH',6,'1997-09-22',25000,NULL,4);
  INSERT INTO employees VALUES (8,'GRANT','ENGINEER',10,'1997-03-30',32000,NULL,2);
  INSERT INTO employees VALUES (9,'JACKSON','CEO',NULL,'1990-01-01',75000,NULL,4);
  INSERT INTO employees VALUES (10,'FILLMORE','MANAGER',9,'1994-08-09',56000,NULL,2);
  INSERT INTO employees VALUES (11,'ADAMS','ENGINEER',10,'1996-03-15',34000,NULL,2);
  INSERT INTO employees VALUES (12,'WASHINGTON','ADMIN',6,'1998-04-16',18000,NULL,4);
  INSERT INTO employees VALUES (13,'MONROE','ENGINEER',10,'2000-12-03',30000,NULL,2);
  INSERT INTO employees VALUES (14,'ROOSEVELT','CPA',9,'1995-10-12',35000,NULL,1);
`, "sql"); 
zone.appendChild(cell);
cell = cellEditor(`SELECT designation,COUNT(*) AS nbr, (AVG(salary)) AS avg_salary FROM employees GROUP BY designation ORDER BY avg_salary DESC;`, "sql"); 
zone.appendChild(cell);
cell = cellEditor(`SELECT name,hired_on FROM employees ORDER BY hired_on;`, "sql"); 
zone.appendChild(cell);
*/
cell = cellEditor(`houses
id, val
1, 500000
2, "560000"
"ab" , " c "
a b , c
ab, "c""d"`, "data"); 
zone.appendChild(cell);
cell = cellEditor(`SELECT * FROM houses;`, "sql"); 
zone.appendChild(cell);
cell = cellEditor(`console.log("Hello World");`, "js"); 
zone.appendChild(cell);
cell = cellEditor(`/triangle { moveto 100 0 rlineto -50 100 rlineto closepath } def
0.2 setgray 200 100 triangle fill
0.4 setgray 240 140 triangle fill
1.0 setgray 280 180 triangle fill
0.0 setgray 280 180 triangle stroke
showpage`, "ps"); 
zone.appendChild(cell);

const url = window.location;
const urlParams = new URLSearchParams(url.search);

if (urlParams.get('new') == 1) {
	zone.innerHTML = '';
	cell = cellEditor('','wiki');
	zone.appendChild(cell);
	cellEdit(cell.id.replace("cell",""));
} else if (urlParams.get('example')) {
	readProject(examples[urlParams.get('example')]);
} else if (urlParams.get('url')) {
	fetch(urlParams.get('url')).then(response => response.text()).then(body => readProject(body));
} else {
    readProject(examples["home"]);
}