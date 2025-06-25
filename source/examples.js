examples = {};
examples['home'] = `
[
    {
        "type": "wiki",
        "source": "==SQL Notebook==\\nNotebooks are applications that mix text and executed code in a printable document. They adhere to the scientific tradition to keep a journal of all experiences.\\n\\nI needed a notebook that can be installed anywhere and runs SQL code locally. This notebook runs in the webbrowser. You can download it this page as webpage and then it will run the computer and never communicate with a server.\\n\\nThe SQL notebook is a playground where you can explore data. You can import data and run queries on it. You can visualize the data using PostScript. And you can enhance both SQL and PostScript with JavaScript. You can save the notebook as JSON document and reopen it later. The JSON document is self contained, meaning that it contains all the data."
    },
    {
        "type": "wiki",
        "source": "===Examples===\\nSee https://www.belle-nuit.com/sql-notebook-examples"
    },
    {
        "type": "wiki",
        "source": "===Using the notebook===\\n\\nA notebook is a collection of cells. Each cell can be either Wikitext, SQL code, Data, JavaScript code or PostScript code.\\n\\nClick '''New''' to create a new notebook. It will open in a separate tab. A new notebook contains one single cell of the type '''Wiki''' and an empty textarea where you can start writing. \\nWrite some text and then click  '''OK'''. The textarea closes and the wiki is rendered to the page. \\nClick '''...''' to modify the text. Click then '''OK''' to apply the changes of '''Cancel''' to reject them.\\nClick '''Insert''' to add a new empty cell below the current cell. \\nClick '''Duplicate''' to add a copy of the current cell below the current cell.\\nClick '''Up''' or '''Down''' to modify the order of the cells. \\nClick '''Delete''' to remove the cell.\\n\\nThe editing of the cells is the same for all types of the cells. The difference is how they render to the page. To change the type of the cell, click on '''Wiki''', '''SQL''', '''Data''', '''PS''' or '''JS'''. The black button is the current type.\\n\\nWhen the type of the cell is not Wiki, a '''Run''' and a '''Run Down''' button appear. The code is not run when you click OK, but when you click '''Run'''. What is the difference between the two buttons? '''Run''' only executes the code of the current cell. '''Run Down''' executes the current cell and all cells below.\\n\\nWhen you have finished, you can save the project with the '''save''' button so that you can open it later with '''open'''. \\n\\nNote that when you open a notebook, it is not executed immediately. If you want to execute all cells, go to the top and click '''Run All'''. \\n"
    },
    {
        "type": "wiki",
        "source": "===Wiki text===\\nWiki text can be formatted in a basic way. The following syntax elements are supported:\\n* Header 2 to Header 4\\n* Italic, bold and bold italic\\n* Unnumbered and numbered lists\\n* Links starting with https\\n* Mathematical formulas (using double and triple $)"
    },
    {
        "type": "wiki",
        "source": "===SQL code===\\n\\nNotebook uses the implementation of https://alasql.org/ which creates a in memory database which is in large parts standard.\\n\\nWhen you create tables, always preceed '''CREATE TABLE''' with '''DROP TABLE IF EXISTS tablename;''' \\nThe columns are not typed."
    },
    {
        "type": "sql",
        "source": "DROP TABLE IF EXISTS test;\\nCREATE TABLE test;\\nINSERT test(foo, bar) VALUES(1,2),(3,'text');\\nSELECT * FROM test;"
    },
    {
        "type": "wiki",
        "source": "Every table can be downloaded as CSV file.\\nThe database is persistend between cells."
    },
    {
        "type": "sql",
        "source": "SELECT foo FROM test;"
    },
    {
        "type": "wiki",
        "source": "'''CREATE TABLE tablename AS (subquery)''' is not supported, but you can create the table and then use the '''INTO''' operator."
    },
    {
        "type": "sql",
        "source": "DROP TABLE IF EXISTS other;\\nCREATE TABLE other;\\nSELECT * INTO other FROM test WHERE foo < 2;\\nSELECT * FROM other;\\n"
    },
    {
        "type": "wiki",
        "source": "===Data cell===\\nSometimes you would not want to write SQL code to insert data. The data cell is a shortcut to create tables.\\nThe data cell has a fixed format\\n* The first line is the name of the table\\n* The following line is CSV text you can copy paste from Excel for example\\n* The separator can be comma, semicolon or tab and is automatically detected. \\n* Quotes are handled and quoted text can have newlines.\\n* The first line of the CVS must contain the column names. These must be valid SQL names.\\nClick '''edit''' of the following cell to inspect the code.\\n"
    },
    {
        "type": "data",
        "source": "_third\\ncity, population\\nZürich, 400000\\nGenève, 250000\\nLausanne, 150000"
    },
    {
        "type": "sql",
        "source": "SELECT * FROM _third"
    },
    {
        "type": "wiki",
        "source": "===PostScript code===\\nYou can PostScript to visualize the data or to add illustration. PostScript is rendered to an SVG file you can save.\\n* The data has to be prepared in a table and have a name starting with underscore. The first parameter is the table name and the second the number of columns which are not numbers. The result in the stack is an array of rows which are arrays of column values.\\n* The script has one installed fonts you can use: '''TGL017'''. \\nClick '''edit''' of the following cell to inspect the code."
    },
    {
        "type": "ps",
        "source": "% data\\n/data (_third) 1 table def\\n\\n% options\\n/title (Income and expenses per year) def\\n/colors [ [0.078 0.431 0.667] [0 0.510 0.353] [0.902 0.196 0.157] [0.941 0.549 0.157] [0.427 0.224 0.545] [0.941 0.784 0] ] def \\n/width 550 def\\n/height 290 def\\n20 20 translate\\n/TGL017 findfont 16 scalefont setfont \\n\\n% utilities\\n/round1 { log 0.5 sub round 10 exch exp } def\\n/setcolor { colors length 1 sub min /c exch def colors c get 0 get colors c get 1 get colors c get 2 get setrgbcolor } def\\n\\n% autosize\\n/xcount data length 1 sub def\\n/series data 0 get length 1 sub def\\n/ymax data 1 get 1 get def\\n/ymin data 1 get 1 get def\\n1 1 series { /s exch def\\n1 1 xcount { /x exch def /y data x get s get def\\n/ymax ymax y max def /ymin ymin y min def } for } for\\n/ystep ymax ymin sub round1 def\\n/yoffset ymin ystep div 0.5 sub round ystep mul def\\n/ycount ymax ymin sub ystep div 1.5 add round def\\n/xaxish 30 def\\n/yscale height ycount 2 add ystep mul xaxish add div def\\n\\n/yaxisw yoffset cvs stringwidth pop 5 add def \\n/width2 width yaxisw sub def\\n/barwidth width2 xcount div series div 3 div round def\\n/xoffset width2 xcount div round def\\n \\n\\n\\n% set origin\\n% frame\\n% 0 0 moveto width 0 lineto width height lineto 0 height lineto closepath stroke\\n\\nyaxisw xaxish translate\\n\\n% y axis\\n0 1 ycount { /y exch def \\n0.7 setgray\\ny ystep mul yscale mul 0 exch moveto width2 0 rlineto stroke \\n0 setgray\\n/label y ystep mul yoffset add cvs def\\nlabel stringwidth pop neg 2 sub y ystep mul yscale mul moveto label show} for\\n\\n% bars and xlabels\\n1 1 xcount { /x exch def x gsave 0.5 sub xoffset mul barwidth 2 div sub 0 translate\\n1 1 series { /s exch def\\n/y data x get s get yoffset sub yscale mul def\\ns 1 sub setcolor\\nbarwidth s 1 sub mul 0 moveto barwidth 0 rlineto 0 y rlineto barwidth neg 0 rlineto closepath fill } for\\n/label data x get 0 get def \\n0 setgray\\nbarwidth series mul 2 div label stringwidth pop 2 div sub -20 moveto label show\\ngrestore} for\\n0 setgray\\n\\n% x axis\\n0 0 moveto width2 0 lineto stroke\\n% title\\nyaxisw neg ycount 1 add ystep mul yscale mul moveto title show\\n\\nshowpage\\n"
    },
    {
        "type": "wiki",
        "source": "===JavaScript code===\\nYou can add aribtrarily JavaScript code which will be added to the page. The function echo renders to the page.\\n\\necho(\\"Hello World\\")"
    },
    {
        "type": "js",
        "source": "echo(\\"Hello World\\")"
    },
    {
        "type": "wiki",
        "source": "But the main use case is to extend SQL.\\nou can define a custom function for SQL.\\n\\nalasql.fn.double = function(x) { return x*2 );"
    },
    {
        "type": "js",
        "source": "alasql.fn.double = function(x) { return x*2 };"
    },
    {
        "type": "sql",
        "source": "SELECT city, double(population) FROM _third"
    },
    {
        "type": "wiki",
        "source": "===Saving and exporting===\\nProjects are saved in compact JSON files you can open again later. Tables can be exported as CSV files, images as SVG or PNG. If you want to print the notebook, export it as PDF. If you want to edit it in Word, export it as PDF. Word is able to read quite much out of the PDF including charts and math notation."
    },
    {
        "type": "wiki",
        "source": "===History===\\n\\n16.3.2025 version 0.1 not published.\\n9.4.2025 version 1.0\\n28.4.2025 version 1.1\\n4.5.2025 version 1.2\\n30.5.2025 version 1.3\\n1.6.2025 version 1.4\\n25.6.2025 version 1.5"
    },
    {
        "type": "wiki",
        "source": "===License===\\n\\nThe software as is under the  MIT license\\n    \\nCopyright 2025 Matthias Bürcher, Lausanne, Switzerland (matti@belle-nuit.com)\\n\\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \\"Software\\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\\n\\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\\n\\nTHE SOFTWARE IS PROVIDED \\"AS IS\\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\\n\\nIf you have any bugs, please post an issue on Github\\nhttps://github.com/bellenuit/sql-notebook"
    }
]
`;
