

function exportCSV(columns, values) {
	const lines = [];
	lines.push(columns.join(';'));
	for(let row of values) {
		const line = [];
		for(let field of row) {
			if (parseFloat(field) != 0 || field === "0") {
				line.push(field);
			} else {
			    if (field) {
					line.push('"' + field.replace('"','""') + '"');
				} else {
					line.push('');
				}
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
	    const columnaligns = [];
	    var caption = '';
	    var captionid = 0;
	    var footer = '';
	    var footerid = 0;
	    var i = 0;
	    for(let c of columns) {
		    var special = false;
		    let th = document.createElement('th');
		    var ca;
		    if (c.match(/__$/) && c.match(/^__/)) {
			    ca = "center";
			    c = c.replace(/__$/,"").replace(/^__/,"");
			} else if (c.match(/__$/)) {
				 ca = "right";
				 c = c.replace(/__$/,"");
		    } else if (c.match(/^'\^/)) {
  			     caption = c.substr(2,c.length-3);
  			     captionid = i;
  			     special = true;
		    } else if (c.match(/^'\$/)) {
  			     footer = c.substr(2,c.length-3);
  			     footerid = i;
  			     special = true;
		    } else {
			    ca = "left";
		    }
		    th.innerHTML = c.replace(/^'(.*)'$/,"$1");
		    th.style.textAlign = ca;
		    columnaligns.push(ca);
		    if (!special)
		    thead.appendChild(th);
		    i++;
	    }
	    if (caption)
	    {
		    let cp = document.createElement('caption');
		    cp.innerHTML = caption;
		    table.appendChild(cp);
	    }
	    
	    table.appendChild(thead);
	    const tbody = document.createElement('tbody');
	    var i = 0;
	    for (let row of values) {
		    const tr = document.createElement('tr');
		    var j = 0;
		    for (let f of row) {
			    if ((caption && j == captionid) || (footer && j == footerid)) {
                  // ignore	   
			    } else {
			    	const td = document.createElement('td');
					if (typeof f !== 'undefined') {
						td.innerHTML = f;
					}
					td.style.textAlign = columnaligns[j];
				    tr.appendChild(td);
				    
			    }
			    j++;
		    }
		    i++;
		    if (i>30) tr.style.display = "none";
		    tbody.appendChild(tr);
	    }
	    table.appendChild(tbody);
	    if (footer) {
		    let tf = document.createElement('tfoot');
		    let td = document.createElement('td');
		    td.setAttribute("colspan","100%");
		    td.innerHTML = footer;
		    tf.appendChild(td);
		    table.appendChild(tf);
	    }
	    
	    
 	    
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
					} else {
						allvisible = false;
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


function cellEditor(code, type = "wiki", zeroid = false) {
	const id = zeroid? 0 : Math.floor(Math.random() * 1000000);  // create unique id for console.log
    const node = document.createElement("DIV");   // build the HTML nodes
	node.id = "cell" + id;
	node.setAttribute("type", type);
	node.className = "cell " + type ;

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
	const importbutton = document.createElement("BUTTON");
	importbutton.id = "import" + id;
	importbutton.innerHTML = "Import";
	importbutton.onclick = function() {cellImport(id)};
	importbutton.className = "import";
	header.appendChild(importbutton);
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
	const newbutton = document.createElement("BUTTON");
	newbutton.id = "new" + id;
	newbutton.innerHTML = "Insert";
	newbutton.onclick = function() {cellNew(id)};
	newbutton.className = "new";
	header.appendChild(newbutton);
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
	const closeButton = document.createElement("BUTTON");
	closeButton.id = "fullscreenclose" + id;
	closeButton.innerHTML = "Close";
	closeButton.className = "fullscreenclose";
	closeButton.onclick = function() {cellFullScreenClose(id)};
	header.appendChild(closeButton);
	const previousButton = document.createElement("BUTTON");
	previousButton.id = "fullscreenprevious" + id;
	previousButton.innerHTML = "Previous";
	previousButton.className = "fullscreenprevious";
	previousButton.onclick = function() {cellFullScreenPrevious(id)};
	header.appendChild(previousButton)
	const nextButton = document.createElement("BUTTON");
	nextButton.id = "fullscreennext" + id;
	nextButton.innerHTML = "Next";
	nextButton.className = "fullscreennext";
	nextButton.onclick = function() {cellFullScreenNext(id)};
	const editbutton = document.createElement("BUTTON");
	editbutton.id = "edit" + id;
	editbutton.innerHTML = "Edit";
	editbutton.onclick = function() {cellEdit(id)};
	editbutton.className = "edit";
	header.appendChild(editbutton);
	const menuButton = document.createElement("BUTTON");
	header.appendChild(nextButton);
	menuButton.id = "edit" + id;
	menuButton.innerHTML = "...";
	menuButton.onclick = function() {cellMenu(id)};
	menuButton.className = "menu";
	header.appendChild(menuButton);



	const source = document.createElement("TEXTAREA");   // build the HTML nodes
	source.id = "source" + id;
    source.className = "cellsource";
	source.setAttribute("readonly", true);
	source.setAttribute("autocomplete", "off");
    source.setAttribute("spellcheck", false);	
	source.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = Math.max(this.scrollHeight, 16) + "px";
    });
    /*
	source.addEventListener("click", function() {
        this.style.height = "auto";
        this.style.height = Math.max(this.scrollHeight, 16) + "px";
    });
    */
	// force at beginning, js dom does not know layout on load
    setTimeout(() => { source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
	source.value = code;
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
		const fulloutput = document.createElement("DIV");   // build the HTML nodes
	fulloutput.id = "fulloutput" + id;
    fulloutput.className = "fulloutput";
	node.appendChild(fulloutput);
	
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
	newcell.className = "cell " + newcell.getAttribute("type") + " menu edit"; 
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
	newcell.className = "cell " + newcell.getAttribute("type") + " menu edit"; 
	cell.after(newcell);
    newsource = document.getElementById('source' + newid);
    newsource.removeAttribute("readonly");
	newsource.focus();
	const length = newsource.value.length;
	newsource.setSelectionRange(length, length);
	newsource.focus();	
}



async function opfsSaveFile(filename, data) {
	
	// safari does not support writable, so we use indexedDB
	/*
	console.log("opfsSaveFile");
	const opfsRoot = await navigator.storage.getDirectory();
	console.log("opfsRoot");
	const fileHandle = await opfsRoot.getFileHandle(filename, {create: true});
	console.log("fileHandle " + filename);
	console.log(fileHandle);
	const writable = await fileHandle.createWritable();
	console.log("writable");
	writable.write(reader.result);
	console.log("write");
	writable.close();
	console.log("close");
	*/
	const kv = await openKV("kv");
	kv.set(filename, data);
}

async function opfsReadFile(filename) {
	
	const kv = await openKV("kv");
	const data = await kv.get(filename);
	return data;
}


function cellImport(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
	const output = document.getElementById('output'+id);
    const input = document.createElement('input');
    input.type = 'file';
    input.value = null;
	input.onchange = _ => {
        const files = Array.from(input.files);
        const file = files[0];
        const filename = file.name;
        console.log("import " +filename);   
        if (filename.substr(-4) == ".csv") {
			const tablename = filename.replace(".csv","");
			const reader = new FileReader();
			output.innerHTML = "Reading CSV " + filename;
			reader.onprogress = (event) => { output.innerHTML += "."; }
			reader.onload = function(){ 
            	source.value = tablename + "\n" + (reader.result);
            	console.log(source.value.substr(0,300));
                setData(id);
            	cellSave(id);
            	output.innerHTML = "Inserting data";
            	setTimeout( () => {cellRun(id);}, 50);
        	};
        	reader.onerror = (reason) => {
	        	output.innerHTML = '<span class="error">' + reader.error + '</span>';
        	}
			reader.readAsText(file);
        } else {
	        // try as image
	        const reader = new FileReader();
			reader.onload = function(){ 
            	var dataURL = reader.result;
				source.value = dataURL;
				console.log(source.value.substr(0,300));
				setData(id);
				cellSave(id);
				cellRun(id);
        	};
        	output.innerHTML = "Reading image " + filename;
        	reader.onprogress = (event) => { output.innerHTML += "."; }
        	reader.onerror = (reason) => {
	        	output.innerHTML = '<span class="error">' + reader.error + '</span>';
        	}
			reader.readAsDataURL(file);
        }
        
    }
    console.log("import click"); 
    input.click();
}

function cellMenu(id) {
	const cell = document.getElementById('cell'+id);
	//console.log("menu " + cell.className.indexOf(" menu"));
	if (cell.className.indexOf(" menu") == -1)
	{
	    cell.className = cell.className + " menu";	
	} else
	{
		cell.className = cell.className.replace(" menu","");
		//console.log("edit " + cell.className.indexOf(" edit"));
		if (cell.className.indexOf(" edit") > -1) cellSave(id);
	}
}

function cellEdit(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id); 
	const bak = document.getElementById('bak'+id);
	bak.value = source.value;
	cell.className = cell.className + " edit "; 
    source.removeAttribute("readonly");
	setTimeout(() => { 
		source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
	const length = source.value.length;
	source.focus();
	source.setSelectionRange(length, length);
}

function cellCancel(id) { 
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
	const bak = document.getElementById('bak'+id);
	source.value = bak.value;
    source.setAttribute("readonly", true);
	source.outerHTML = source.outerHTML;  // force update textarea
	cell.className = "cell " + cell.getAttribute("type"); 
}

function cellSave(id) { 
	console.log("cellsave " + id);
	const cell = document.getElementById('cell'+id);
    const source = document.getElementById('source'+id);
    const bak = document.getElementById('bak'+id);
    // if (bak.innerHTML !== source.innerHTML)
    projectTouched = true;
    source.setAttribute("readonly", true);
	//cell.className = "cell " + cell.getAttribute("type"); 
	cell.setAttribute("class", cell.getAttribute("class").replace("edit", " "));
	if (cell.getAttribute("type") == "wiki") cellRun(id);
}

function cellUp(id) {
	const cell = document.getElementById('cell'+id);
	const previousCell = cell.previousSibling;
	cell.parentNode.insertBefore(cell, previousCell);
	newsource = document.getElementById('source' + id);
    newsource.removeAttribute("readonly");
	newsource.focus();	

}

function cellDown(id) {
	const cell = document.getElementById('cell'+id);
	const nextcell = cell.nextSibling;
	nextcell.parentNode.insertBefore(nextcell, cell);
	document.getElementById('cell'+id).focus();
	newsource = document.getElementById('source' + id);
    newsource.removeAttribute("readonly");
	newsource.focus();	
}

function cellShow(id) {
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
	setTimeout(() => { 
		source.style.height =  Math.max(source.scrollHeight, 16) + "px";}, "25");
}

function cellDelete(id) { 
	const cell = document.getElementById('cell'+id);
	cell.parentElement.removeChild(cell);
}

function cellFullScreen(id) {
	const cell = document.getElementById('cell'+id);
	const output = document.getElementById('output'+id);
	const fulloutput = document.getElementById('fulloutput'+id);
    cell.setAttribute("class", cell.getAttribute("class").replace("edit", " "));
	cell.className = cell.className + " fullscreen ";
	cell.setAttribute('fsid', id);
    const source = document.getElementById('source'+id);
    


}

function cellFullScreenClose(id) {
// 	document.exitFullscreen?.(); // syntax from fullscreen API page MS
    const cell = document.getElementById('cell'+id);
    cell.className = cell.className.replace(' fullscreen ','')
}

function cellFullScreenPrevious(id) {
	const cell = document.getElementById('cell'+id);
   	const newcell = cell.previousSibling;
   	if (newcell) {
    cell.className = cell.className.replace(' fullscreen ','');
    newcell.className = newcell.className + ' fullscreen ';
    } 	
	
	const source = document.getElementById('source'+id); 	
//    	source.style.height = 1.5 * source.style.height; 
}

function cellFullScreenNext(id) {
   	const cell = document.getElementById('cell'+id);
   	const newcell = cell.nextSibling;
   	if (newcell) {
    	cell.className = cell.className.replace(' fullscreen ','');
    	newcell.setAttribute("class", newcell.getAttribute("class").replace("edit", " "));
    	newcell.className = newcell.className + ' fullscreen ';
    	console.log(newcell.id);
       	const source = document.getElementById('source'+newcell.id.replace("cell","")); 	
   	 	console.log(source.value);
   	 	console.log("next" + source.style.height);
    	 	setTimeout( function() {
   	 	source.style.height = Math.max(source.scrollHeight, 16) + "px";
   	 	console.log("timeout" + source.style.height);
   	 	}, 25); 
    }
   	   

    
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
	html = "\n" + html.replace(/\r\n/g, "\n") + "\n";
	html = html.replace(/\n====(.*)====\n/gm, function (match, contents) {
        return '<h4>' + contents + '</h4>';
    });
    html = html.replace(/\n===(.*)===\n/gm, function (match, contents) {
        return '<h3>' + contents + '</h3>';
    });
	html = html.replace(/\n==(.*)==\n/gm, function (match, contents) {
        return '<h2>' + contents + '</h2>';
    });
    html = html.replace(/^\*\*\*(.*?)$/gm, function (match, contents) {
        return '<ul><ul><ul><li>' + contents + '</li></ul></ul></ul>';
    });
    html = html.replace(/^\*\*(.*?)$/gm, function (match, contents) {
        return '<ul><ul><li>' + contents + '</li></ul></ul>';
    });
    html = html.replace(/^\*(.*?)$/gm, function (match, contents) {
        return '<ul><li>' + contents + '</li></ul>';
    });
    // clean-up
    html = html.replaceAll('</ul>\n','</ul>');
    html = html.replaceAll('</ul><ul>','');
     html = html.replace(/^###(.*?)$/gm, function (match, contents) {
        return '<ol><ol><ol><li>' + contents + '</li></ol></ol></ol>';
    });
    html = html.replace(/^##(.*?)$/gm, function (match, contents) {
        return '<ol><ol><li>' + contents + '</li></ol></ol>';
    });
    html = html.replace(/^#(.*?)$/gm, function (match, contents) {
        return '<ol><li>' + contents + '</li></ol>';
    });
    // clean-up
    html = html.replaceAll('</ol>\n','</ol>');
    html = html.replaceAll('</ol><ol>','');
    
    html = html.replace(/\$\$\$(.*?)\$\$\$/g, function (match, contents) {
	    let node = asciimath.parseMath(contents, false);
	    node.style.display = "block";
        return node.outerHTML ;
    });
    
    html = html.replace(/\$\$(.*?)\$\$/g, function (match, contents) {
	    mathcolor = "black";
        return asciimath.parseMath(contents, false).outerHTML ;
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
	html = html.replace(/(\s)(https:\/\/\S+)(\s)/gm, function (match, prespace, contents, postspace) {
        return prespace + '<a href="' + contents +'" target="_blank">' + contents + '</a>' + postspace; 
    });
    html = html.replace(/\[(https:\/\/\S+) (.*?)\]/gm, function (match, contents, text) {
        return '<a href="' + contents +'" target="_blank">' + text + '</a>'; 
    });
    html = html.replace(/\[\[help:(.*?)\]\]/gm, function (match, contents) {
        return '<a href="index.html?url=../site/files/' + contents.replaceAll(' ','-').toLowerCase() +'.json&autorun=1">' + contents + '</a>'; 
    });
	html = html.replace(/notebook:\/\/(\S+)/gm, function (match, contents) {
        return '<a href="index.html?' + content +'" target="_blank">' + content + '</a>'; 
    });
    html = html.replace(/^\n/gi, "");
    html = html.replace(/\n$/gi, "");
    html = html.replace(/(<\/h\d>)\n/gi, "$1");
	html = html.replace(/\n/gi, "<br/>");
	
    output.innerHTML = html;
	const cell = document.getElementById('cell'+id);
	cell.style.backgroundColor = 'white';
    output.outerHTML = output.outerHTML; 
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			} else {
			console.log("run end");
			}
			
		} else {
			console.log("run end");
		}
}


runner.sql = function(id, down = false) {
	const cell = document.getElementById('cell'+id);
	const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
	// we do not know if there were single or multiple statements
	// if there were single statements, then we have to make an array of it.
	// workaround: we add a dummy statement to the commands to force multiple statements
	const intolist = [];
	for(let t of source.value.matchAll(/CREATE TABLE ([A-Za-z_]\w*)/gi)) {
		console.log(t[1]);
		intolist.push("DROP TABLE IF EXISTS " + t[1] + "; ");
	} 
	for(let t of source.value.matchAll(/ INTO ([A-Za-z_]\w*) FROM /gi)) {
		console.log(t[1]);
		intolist.push("DROP TABLE IF EXISTS " + t[1] + "; CREATE TABLE " + t[1] + "; ");
	} 
	console.log(intolist);
	const hidestats = (source.value.substr(0,1) == "!");
	const sourcevalue = hidestats ? source.value.substr(1) : source.value ;
	cell.className = cell.className.replace(" hide", "");
	if (hidestats) cell.className += " hide";
	alasql.promise(intolist.join(" ") + sourcevalue + "; SET dummy = 1;")
	.then(function(results){ console.log((Date.now() - timerstart) +" ms sql");
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
			   const d = new Date();
			   const ds = d. toISOString().replaceAll("-","").replaceAll(":","").replaceAll("T","_").substr(0,13);
		       let a = '<p class="link"><a href="' + url + '" download="export ' + ds  + '.csv">CSV</a>';
		       s += a;
			   }
		   }
		}
		
		
		output.innerHTML = s;
		const cell = document.getElementById('cell'+id);
		cell.style.backgroundColor = 'white';
		output.outerHTML = output.outerHTML; // force
		
		console.log((Date.now() - timerstart) +" ms html");
		
		if (down) { 
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				if (nextid != id)
					cellRun(nextid, true);
			} else {
			console.log("run end");
			}
			
		} else {
			console.log("run end");
		}
		
	}).catch(function(reason){
		console.log(reason);
		const cell = document.getElementById('cell'+id);
		cell.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
	});
}

// https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
// a proper state machine would be better
function*  parseCSV(str2) {
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
		 // result.push(s);
		 yield s;
	 }
	 
	 
    // return result;
}


function cleanName(s) {
	// remove space and invalid characters, but we need to keep " number";
	
	
	
	
	if (s.substr(-7,7) == " number")
	{
		return cleanName(s.replace(" number","")) + " number";
	}
	
	const keywordlist = ['VALUE', 'OF', 'SEARCH', 'SELECT', 'ROW', 'COLUMN', 'MATRIX', 'INDEX', 'RECORDSET', 'TEXT', 'ABSOLUTE', 'ACTION', 'ADD', 'AFTER', 'AGGR', 'AGGREGATE', 'AGGREGATOR', 'ALL', 'ALTER', 'AND', 'ANTI', 'ANY', 'APPLY', 'ARRAY', 'AS', 'ASSERT', 'ASC', 'ATTACH', 'AUTOINCREMENT', 'AUTO_INCREMENT', 'AVG', 'BEFORE', 'BEGIN', 'BETWEEN', 'BREAK', 'NOT', 'LIKE', 'BY', 'ILIKE', 'CALL', 'CASE', 'CAST', 'CHECK', 'CLASS', 'CLOSE', 'COLLATE', 'COLUMNS', 'COMMIT', 'CONSTRAINT', 'CONTENT', 'CONTINUE', 'CONVERT', 'CORRESPONDING', 'COUNT', 'CREATE', 'CROSS', 'CUBE', 'CURRENT_TIMESTAMP', 'DECLARE', 'DEFAULT', 'DELETE', 'DELETED', 'DESC', 'DETACH', 'DISTINCT', 'DROP', 'ECHO', 'EDGE', 'END', 'ENUM', 'ELSE', 'ESCAPE', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXISTS', 'EXPLAIN', 'FALSE', 'FETCH', 'FIRST', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'FUNCTION', 'GLOB', 'GO', 'GRAPH', 'GROUP', 'GROUPING', 'HAVING', 'IF', 'IDENTITY', 'IS', 'IN', 'INDEX', 'INDEXED', 'INNER', 'INSTEAD', 'INSERT', 'INSERTED', 'INTERSECT', 'INTERVAL', 'INTO', 'JOIN', 'KEY', 'LAST', 'lET', 'LEFT', 'LIKE', 'LIMIT', 'MATCHED', 'MAX', 'MIN', 'MERGE', 'MINUS', 'MODIFY', 'NATURAL', 'NEXT', 'NEW', 'NOCASE', 'NO', 'NOT', 'NULL', 'NULLS', 'OFF', 'ON', 'ONLY', 'OF', 'OFFSET', 'OPEN', 'OPTION', 'OR', 'ORDER', 'OUTER', 'OVER', 'PATH', 'PARTICION', 'PERCENT', 'PIVOT', 'PLAN', 'PRIMARY', 'PRINT', 'PRIOR', 'QUERY', 'READ', 'REDCORDSET', 'REDUCE', 'REFERENCES', 'REGEXP', 'REINDEX', 'RELATIVE', 'REMOVE', 'RENAME', 'REPEAT', 'REPLACE', 'REQUIRE', 'RESTORE', 'RETURN', 'RETURNS', 'RIGHT', 'ROLLBACK', 'ROLLUP', 'ROWS', 'SCHEMA', 'SCHEMAS', 'SEMI', 'SET', 'SETS', 'SHOW', 'SOME', 'SOURCE', 'STRATEGY', 'STORE', 'SUM', 'TOTAL', 'TABLE', 'TABLES', 'TARGET', 'TEMP', 'TEMPORARY', 'TEXTSTRING', 'THEN', 'TIMEOUT', 'TO', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUE', 'TRUNCATE', 'UNION', 'UNIQUE', 'UNPIVOT', 'UPDATE', 'USE', 'USING', 'VALUE', 'VALUES', 'VERTEX', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WORK' ];
	
	if (keywordlist.includes(s)) return s + "_";
	if (keywordlist.map( (x) => (x.toLowerCase()) ).includes(s)) return s + "_";
	
	
	return s.replaceAll('"','').trim().replace(/^[^a-zA-Z]/,"_").replaceAll(/[^a-zA-Z0-9]+/g,"_");
}

runner.data = function(id, down = false, diskdata = null) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    const cell =  document.getElementById('cell'+id);
	// we do not know if there were single or multiple statements
	// if there were single statements, then we have to make an array of it.
	// workaround: we add a dummy statement to the commands to force multiple statements
	
	//image
		
	if (source.value.substr(0,10) == "data:image" || source.value.substr(0,11) == "!data:image") {
		const img = document.createElement("IMG");
		const hidestats = (source.value.substr(0,1) == "!");
		if (hidestats) 
			img.src = source.value.substr(1);
		else
			img.src = source.value;
		console.log(img.src.substr(0,300));
		img.style = "max-width: 100%;";
		const hash = "i"+generateHash(source.value) % 1000000;
		output.innerHTML = img.outerHTML;
		setTimeout(() => { 
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0 );
			const data = context.getImageData(0, 0, img.width, img.height);
			console.log(data.data.length);
			console.log(typeof data.data)
			arr = new Array(data.data.length);
			for(let i = 0; i < data.data.length; i++) arr[i] = data.data[i];
			dataimages[hash] = { 
				width: data.width,
				height: data.height,
				data: arr
			};
			
			const tablename = hash;
			const tabledata = [];
			for(let i = 0; i < data.data.length; i += 4) 
			{
				let p = Math.floor(i/4);
				let x = p % data.width;
				let y = Math.floor(p / data.width);
				let r = data.data[i];
				let g = data.data[i+1];
				let b = data.data[i+2];
				let a = data.data[i+3];
				tabledata.push( { "x": x, "y": y, "r": r, "g": g, "b": b, "a": a});
			}
			alasql('DROP TABLE IF EXISTS ' + tablename + '; CREATE TABLE ' + tablename);
			console.log(tabledata.length);
			console.log(alasql.tables);
			console.log(alasql.tables[tablename]);
			alasql.tables[tablename].data = tabledata;
			if (!hidestats) output.innerHTML += "<p>" + tablename + "<br>cols x, y, r, g, b a<br>rows "+tabledata.length;
			cell.style.backgroundColor = 'white';
			if (down) { 
				let cell = document.getElementById("cell"+id);
				let nextcell = cell.nextSibling;
				
				if (nextcell) {
					let nextid = nextcell.id.replace("cell","");
					cellRun(nextid, true);
				} else {
					console.log("run end");
				}	
			} else {
				console.log("run end");
			}	    
	    	}, 300);
		
		
		
		return;
		
	}
	
	

	var lines = source.value.split(/\r?\n/);
	
	if (lines.length < 3) {
		output.innerHTML = '<span class="error">Error: invalid or empty CSV</span>';
		cell.style.backgroundColor = 'white';
		return;
	}
	
	const tablename = cleanName(lines.shift());
	
	if (!tablename) {
		output.innerHTML = '<span class="error">Error: missing tablename</span>';
		cell.style.backgroundColor = 'white';
		return;
	}
	
	const headerline = lines.shift();
	
	if (!headerline) {
		output.innerHTML = '<span class="error">Error: missing column names</span>';
		cell.style.backgroundColor = 'white';
		return;
	}
	
		
	/* if (!diskdata && lines[0] == "@") { console.log("@");
		opfsReadFile(tablename).then( 
			(data) => { console.log("data " + data.length);
				runner.data(id, down, data);
			},
			(reason) => {
				console.error(reason);
			}
		);
		return;
	}
	*/
	
	
	var comma = ",";
	if (headerline.substr(0,80).indexOf(";") > -1) comma = ";";
	if (headerline.substr(0,80).indexOf("\t") > -1) comma = "\t";
	const cleanheader = headerline.split(comma).map( (s) => cleanName(s) );
	lines.unshift(cleanheader);
	//const data = diskdata ? diskdata : (lines.join("\n"));
	const data = lines.join("\n");
	console.log("data");
	console.log(data.substr(0,300));
	const list = parseCSV(data);
	
    var isform = false;
    output.innerHTML = "Inserting data";
	if (tablename.substr(0,5) == "_form") {
		isform = true;
		// display form and add user value to the data 
		// columns: id, label, type, initial, minval, maxval, val
		let listholder = document.createElement("UL");
		output.appendChild(listholder);
		while (elem = list.next().value) {
// 		for (elem of list) {
			let listelem = document.createElement("LI");
			listholder.appendChild(listelem);
			var node;
			var q;
			if (elem.type == "radio") {
			  node = document.createElement("SPAN");
			  
			  for (e of elem.list.split("|")) {
			  	let node3 = document.createElement("INPUT");
			  	node3.id = elem.id;
			  	node3.name = elem.id;
			  	node3.type = "radio";
			  	node3.setAttribute("value",e);
			  	q = "UPDATE " + tablename + " SET val = '" + e + "' WHERE id = '" + elem.id + "'";
			  	node3.setAttribute("oninput","alasql(\""+q+"\")");
			  	if (e == elem.val) {
			  		node3.setAttribute("checked", 1);
			  	}
			  	node.appendChild(node3);
			  	let node4 = document.createElement("SPAN");
			  	node4.className = "radiovalue";
			  	node4.innerHTML = e;
			  	node.appendChild(node4);
			  }
			} else {
			    node = document.createElement("INPUT");
				node.id = elem.id;
				node.name = elem.id.substr(0,3);
				node.type = elem.type;
				node.setAttribute("value", elem.val);
				if(elem.type == "range") {
					node.setAttribute("min", elem.minval);
					node.setAttribute("max", elem.maxval);
					node.setAttribute("step", elem.stepval);
				}
				q = "UPDATE " + tablename + " SET val = '\" + this.value + \"' WHERE id = '" + node.id + "'";

				if (elem.type == "checkbox") {
					q = "UPDATE " + tablename + " SET val = 1 - val WHERE id = '" + node.id + "'";
					if (elem.checked == "1") node.setAttribute("checked", 1)
					else node.removeAttribute("checked");
				}
			/*if (elem.type == "radio") {
				
				q = "UPDATE " + tablename + " SET checked = 0 WHERE substr(id,1,3) = '" + node.id.substr(0,3) + "'; UPDATE " + tablename + " SET checked = 1 WHERE id = '" + node.id + "'";
				node.setAttribute("checked", elem.checked);
			} */
			
				node.setAttribute("oninput","alasql(\""+q+"\")");
			}
			let node2 = document.createElement("LABEL");
			node2.setAttribute("for", elem.id);
			node2.innerHTML = elem.label;
			listelem.appendChild(node2);
			listelem.appendChild(node);
		    if (elem.type == "range") {
		    	let node3 = document.createElement("SPAN");
		    	node3.id = node.id + "_label";
		    	node3.innerHTML = elem.val;
		    	listelem.appendChild(node3);
		    	node.setAttribute("onchange","let n = document.getElementById('" + node3.id + "'); console.log(n); n.innerHTML = this.value; alasql(\""+q+"\");");
		    }
		    
		    if (elem.type == "text" && elem.datalist) {
				let dlnode = document.createElement("DATALIST");
				dlnode.id = node.id;
				listelem.appendChild(dlnode);
				let dl = alasql("SELECT COLUMN * FROM " + elem.datalist);
				
				for (let delem of dl) {
					let opt = document.createElement("OPTION");
					opt.value = delem;
					dlnode.appendChild(opt);
				}
			}
		}
		
		let nextcell = cell.nextSibling;
		if (nextcell) {
			let listelem = document.createElement("LI");
			listholder.appendChild(listelem);
			let node = document.createElement("INPUT");
			node.type = "submit";
			node.value = "Run Next";
			let nextid = nextcell.id.replace("cell","");
			node.setAttribute("onclick", "cellRun(" + nextid + ", false);" );
			listelem.appendChild(node);
			let node2 = document.createElement("INPUT");
			node2.type = "submit";
			node2.value = "Run Next Down";
			node2.setAttribute("onclick", "cellRun(" + nextid + ", true);" );
			listelem.appendChild(node2);
		}	
		
		 
	}
	
	
	const header = lines.shift();
	var separator = ",";
	if (header.indexOf(";") > -1) separator = ";";
	if (header.indexOf("\t") > -1) separator = "\t";
	try {

		alasql('DROP TABLE IF EXISTS '+tablename+'; CREATE TABLE ' + tablename + "(" + header.join(", ") + ")"); 
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
			alasql("INSERT INTO "+tablename+" VALUES ?", [elem2]);
			if (Math.random() / list.length > 0.1) { output.innerHTML += "."; output.outerHTML = output.outerHTML; }
		}
	}
	catch(reason){
		console.log(reason);
		const cell = document.getElementById('cell'+id);
		cell.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
		return;
	};
	
	console.log((Date.now() - timerstart) +" ms insert");

	const statement = "SELECT count(*) AS c FROM "+tablename +"; SHOW COLUMNS FROM " + tablename;
	alasql.promise(statement)
	.then(function(results){ 
		var s = "";
		s += '<p>table '+tablename;		
		const cols = [];
		for (row of results[1]) {
			cols.push(row.columnid);
		}
		s += '<br>columns ' + cols.join(", ");
		s += '<br>rows ' + results[0][0].c; 
		
		if (! isform)output.innerHTML = s;
		const cell = document.getElementById('cell'+id);
		cell.style.backgroundColor = 'white';
		output.outerHTML = output.outerHTML; // force 
		
		console.log((Date.now() - timerstart) +" ms");
		
		if (down) { 
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			} else {
			console.log("run end");
			}
			
		} else {
			console.log("run end");
		}
		
	}).catch(function(reason){
		console.log(reason);
		const cell = document.getElementById('cell'+id);
		cell.style.backgroundColor = 'white';
		output.innerHTML = '<pre class="error">'+reason+'<pre>';
		output.outerHTML = output.outerHTML; // force
	});
}
echo = function () {};
dump = function () {};

runner.js = function(id, down = false) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    const code = source.value;
	
	output.innerHTML = "";
	echo = function(s) {
		output.innerHTML += s;
	}
	echocode = function(s) {
		echo('<code class="js">' + s + '</code>');
	}
	dump = function(fn, s = "") {
		echo('<code class="js">' + (fn.name ? fn.name : s) + ' = ' + fn.toString() + '</code>');
	}
	htmlTable = function(query) {
		let first = query[0];
	    if (typeof first === 'object') {
	        let cols = Object.keys(first);
	        let values = [];
	        for(row of query) {
		        let fields = [];
		        for(key in row) fields.push(row[key]);
		         values.push(fields);
	        }
	        echo(tableCreate(cols,values).outerHTML);
	    };
	}
	
	const cell = document.getElementById('cell'+id);
	cell.style.backgroundColor = 'white';
	const scriptnode = document.createElement("SCRIPT"); 
    scriptnode.innerHTML = "try { " + code + " } catch(reason) { console.log(reason); const c = document.getElementById('output'+"+id+"); c.innerHTML = '<pre class=error>'+reason+'</pre>'; c.style.backgroundColor = 'white'; console.log(c.innerHTML);}";
    
    /*
    window.onerror = function (a, b, c, d, e) {
        const co = document.getElementById('output'+id); 
        if (co) {
		co.innerHTML = '<pre class=error>' + a + '</pre>'; 
		co.style.backgroundColor = 'white'; 
		}
		console.error(a);
	}
	*/ 
	document.body.appendChild(scriptnode);
	console.log((Date.now() - timerstart) +" ms");
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			} else {
			console.log("run end");
			}
			
		} else {
			console.log("run end");
		}
}

readSyncDataURL = function(url, filetype = ""){
	// override for TTF
	// URL = rpnFontBasePath + font + ".ttf",
	
    // var url=URL.createObjectURL(file);//Create Object URL
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);//Synchronous XMLHttpRequest on Object URL
    xhr.overrideMimeType("text/plain; charset=x-user-defined");//Override MIME Type to prevent UTF-8 related errors
    xhr.send();
    URL.revokeObjectURL(url);
    var returnText = "";
    for (let i = 0; i < xhr.responseText.length; i++) {
       returnText += String.fromCharCode(xhr.responseText.charCodeAt(i) & 0xff) ;
    } //remove higher byte
    return "data:"+filetype+";base64,"+btoa(returnText); //Generate data URL
};

rpnProlog = "";

runner.ps = function(id, down = false) {
    const source = document.getElementById('source'+id);
    const output = document.getElementById('output'+id);
    const code = source.value;
	const scriptnode = document.createElement("TINY-PS");
	scriptnode.id = "tinyps"+id;
	scriptnode.setAttribute("width","640");
	scriptnode.setAttribute("height","360");
	scriptnode.setAttribute("format","svg,svgurl,canvasurl");
	scriptnode.setAttribute("textmode","1");
	scriptnode.setAttribute("error","1");
	scriptnode.setAttribute("interval","100");
    scriptnode.setAttribute("movie","1");
    scriptnode.setAttribute("zip","1");
	scriptnode.setAttribute("oversampling","4");
	scriptnode.setAttribute("transparent","0");
	scriptnode.innerHTML = code;
	
	const tabledump = []
	tabledump.push("rpnTables = []");
    for (t in alasql.tables) {
	    if (t.substr(0,1)=="_") {
	    	let t2 = alasql("SELECT * FROM " + t);
	    	// unescape undefined
	    	let j = JSON.stringify(t2, (k, v) => v === undefined ? null : v)
	        tabledump.push("rpnTables[\""+t+"\"] = " + j + " ;\n");
	        // §console.log(j);
	    }
    }
    
    const di = "\n dataimages = " + JSON.stringify(dataimages) + ";" ;
    
    rpnExtensions = tabledump.join("\n") + di ;

    output.innerHTML = "";		
	const cell = document.getElementById('cell'+id);
	cell.style.backgroundColor = 'white';
	output.appendChild(scriptnode);

	console.log("runner.ps changes tag")
	console.log((Date.now() - timerstart) +" ms");
	
	if (down) {
			let cell = document.getElementById("cell"+id);
			let nextcell = cell.nextSibling;
			if (nextcell) {
				let nextid = nextcell.id.replace("cell","");
				cellRun(nextid, true);
			} else {
			console.log("run end");
			}
			
		} else {
			console.log("run end");
		}
}

function cellRun(id, down = false) {

	 if (id == 0) {
		 const cell0 = document.getElementById('cellzone').firstChild;
		 id = cell0.id.replace('cell','');
	 } 
	 currentCell = id;

	 
	 const cell = document.getElementById('cell'+id);
	 
	 console.log(cell.id);
	 
	 const type = cell.getAttribute("type");
	 if (type != "wiki") {
		console.log("cellRun " + type + " " + id);
		timerstart = Date.now();
		cell.style.backgroundColor = 'yellow';
	}
	// setTimeout(function() { runner[type](id, down);}, 25 ); 	
	const run = async function() { runner[type](id, down); };
	run();
     
}

function cellRunNext() {
	const cell = document.getElementById("cell"+currentCell);
    if (cell) { 
	    const nextcell = cell.nextSibling;
	    if (nextcell) { 
			const nextid = nextcell.id.replace("cell","");
			cellRun(nextid, true); 
			console.log("cellRunNext "+nextid);
		}
	}
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
	console.log("openProject");
    const input = document.createElement('input');
    input.type = 'file';
    input.value = null;
	input.onchange = _ => {
		console.log("change");
        const files = Array.from(input.files);
        const reader = new FileReader();
        reader.onload = function(){ 
	        console.log("file");
            readProject(reader.result);
        };
        reader.readAsText(input.files[0]);
    }
    input.click();
// sinput.remove();    
  };
  
  
function readProject(json) {
	console.log("readProject");
	const zone = document.getElementById('cellzone');
	zone.innerHTML = "";
	const list = JSON.parse(json);
	console.log(list);
	var first = true;
	for(const elem of list) {
		const cell = cellEditor(elem.source, elem.type, first);
		first = false;
		zone.appendChild(cell);
		const id = cell.getAttribute("id").replace("cell","");
		if (elem.type == 'wiki') cellRun(id);
	}
	if (autorun) cellRun(0,true);
}

function btoaUnicode(s) {
    return btoa(encodeURIComponent(s).replace( /%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}
	));
};
    
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    
function generateHash(string) {
  var hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return Math.abs(hash);
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
				suggestedTitle = source.value.split('\n').shift().replace(/^==+(.*)==+$/,"$1").replaceAll(' ','-').toLowerCase();
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
	
	projectTouched = false;

}

const zone = document.getElementById('cellzone');
const url = window.location;
const urlParams = new URLSearchParams(url.search);
const dataimages = {};
var timerstart = Date.now();
var autorun = false;

if (urlParams.get("autorun") == 1) autorun = true;

if (urlParams.get('new') == 1) {
	zone.innerHTML = '';
	cell = cellEditor('','wiki', true, 1);
	zone.appendChild(cell);
	cellEdit(cell.id.replace("cell",""));
} else if (urlParams.get('example')) {
	readProject(examples[urlParams.get('example')]);
} else if (urlParams.get('url')) {
	fetch(urlParams.get('url')).then(response => response.text()).then(body => readProject(body));
} else {
	autorun = true;
    readProject(examples["home"]);
}

projectTouched = false;
currentCell = undefined;
window.onbeforeunload = askConfirm;
function askConfirm(){ if (projectTouched) return false; }

console.log("Secure context " + window.isSecureContext);