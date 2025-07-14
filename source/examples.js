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
        "source": "% label x y\\n/state {\\ngsave\\ntranslate 0 0 30 0 360 arc stroke \\ndup stringwidth pop 2 div neg -3 moveto show\\ngrestore\\n} def\\n\\n/atartstate {\\ngsave\\ntranslate 0 0 30 0 360 arc stroke \\n0 0 25 0 360 arc stroke \\ndup stringwidth pop 2 div neg -3 moveto show\\ngrestore\\n} def\\n\\n% label x1 y1 x2 y2\\n/path {\\ngsave\\n/y2 exch def /x2 exch def /y1 exch def /x1 exch def /label exch def\\n/a y2 y1 sub x2 x1 sub atan def\\n% line\\nx1 a cos 30 mul add y1 a sin 30 mul add moveto\\nx2 a cos 30 mul sub y2 a sin 30 mul sub lineto stroke\\n% arrows\\nx2 a cos 30 mul sub y2 a sin 30 mul sub moveto\\na 150 add cos 10 mul a 150 add sin 10 mul rlineto stroke\\nx2 a cos 30 mul sub y2 a sin 30 mul sub moveto\\na -150 add cos 10 mul a -150 add sin 10 mul rlineto stroke\\n% label\\nx1 a cos 40 mul add 3 sub y1 a sin 40 mul add 2 sub moveto\\nlabel stringwidth pop 3 add 0 rlineto 0 12 rlineto\\nlabel stringwidth pop 3 add neg 0 rlineto 0 -12 rlineto\\n0.8 setgray fill  \\nx1 a cos 40 mul add y1 a sin 40 mul add moveto \\n0 setgray label show\\ngrestore  \\n} def\\n\\n% label x1 y1 x2 y2 x3 y3 x4 y4\\n/path2 {\\ngsave\\n/y4 exch def /x4 exch def /y3 exch def /x3 exch def\\n/y2 exch def /x2 exch def /y1 exch def /x1 exch def /label exch def\\n% line\\n/a1 y2 y1 sub x2 x1 sub atan def\\n/a4 y4 y3 sub x4 x3 sub atan def\\nx1 a1 cos 30 mul add y1 a1 sin 30 mul add moveto\\nx2 y2 lineto\\nx2 a1 cos 50 mul add y2 a1 sin 50 mul add\\nx3 a4 cos 50 mul sub y3 a4 sin 50 mul sub\\nx3 y3 curveto   \\nx4 a4 cos 30 mul sub y4 a4 sin 30 mul sub lineto stroke\\n% arrows\\nx4 a4 cos 30 mul sub y4 a4 sin 30 mul sub moveto\\na4 150 add cos 10 mul a4 150 add sin 10 mul rlineto stroke\\nx4 a4 cos 30 mul sub y4 a4 sin 30 mul sub moveto\\na4 -150 add cos 10 mul a4 -150 add sin 10 mul rlineto stroke\\n% label\\nx1 a1 cos 50 mul add 3 sub y1 a1 sin 50 mul add 2 sub moveto\\nlabel stringwidth pop 3 add 0 rlineto 0 12 rlineto\\nlabel stringwidth pop 3 add neg 0 rlineto 0 -12 rlineto\\n0.8 setgray fill  \\nx1 a1 cos 50 mul add y1 a1 sin 50 mul add moveto \\n0 setgray label show\\ngrestore  \\n} def\\n\\n/TGL017 findfont 12 scalefont setfont\\n\\n(start) 100 200 atartstate\\n(number) 200 175 state\\n(fraction) 200 260 state\\n(operator) 200 100 state\\n\\n(0-9-) 100 200 200 175 path\\n(0-9) 200 175 250 150 250 200 200 175 path2\\n(.) 200 175 200 260 path\\n(space) 200 175 170 225 100 225 100 200 path2\\n(0-9) 200 260 250 235 250 285 200 260 path2 \\n(space) 200 260 175 275 75 250 100 200 path2\\n(a-z) 100 200 200 100 path\\n(a-z0-9) 200 100 250 75 250 125 200 100 path2 \\n(space) 200 100 150 125 100 150 100 200 path2\\nshowpage"
    },
    {
        "type": "wiki",
        "source": "SQL notebook has a chart library to visualize data of yous SQL table."
    },
    {
        "type": "ps",
        "source": "(_third) 1 preparechart\\n(Population by city) description\\n(Credits) credits\\n(Bar chart) title\\nxaxis ygrid yticks category\\n[1] bar\\nshowpage"
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
        "source": "===History===\\n\\n16.3.2025 version 0.1 not published.\\n9.4.2025 version 1.0\\n28.4.2025 version 1.1\\n4.5.2025 version 1.2\\n30.5.2025 version 1.3\\n1.6.2025 version 1.4\\n25.6.2025 version 1.5\\n14.7.2025 version 1.6"
    },
    {
        "type": "wiki",
        "source": "===License===\\n\\nThe software as is under the  MIT license\\n    \\nCopyright 2025 Matthias Bürcher, Lausanne, Switzerland (matti@belle-nuit.com)\\n\\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \\"Software\\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\\n\\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\\n\\nTHE SOFTWARE IS PROVIDED \\"AS IS\\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\\n\\nIf you have any bugs, please post an issue on Github\\nhttps://github.com/bellenuit/sql-notebook"
    }
]
`;
