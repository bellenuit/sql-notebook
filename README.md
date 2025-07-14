# SQL Notebook

Notebooks are applications that mix text and executed code in a printable document. They adhere to the scientific tradition to keep a journal of all experiences.

I needed a notebook that can be installed anywhere and runs SQL code locally. This notebook runs in the webbrowser. You can download it this page as webpage and then it will run the computer and never communicate with a server.

The SQL notebook is a playground where you can explore data. You can import data and run queries on it. You can visualize the data using PostScript. And you can enhance both SQL and PostScript with JavaScript. You can save the notebook as JSON document and reopen it later. The JSON document is self contained, meaning that it contains all the data.

## Demo

A running notebook is on https://www.belle-nuit.com/sql-notebook/index.html

You can save it as a webpage to run it locally.

## Using the notebook

A notebook is a collection of cells. Each cell can be either Wikitext, SQL code, Data, JavaScript code or PostScript code.

Click New to create a new notebook. It will open in a separate tab. A new notebook contains one single cell of the type Wiki and an empty textarea where you can start writing.

Write some text and then click OK. The textarea closes and the wiki is rendered to the page.

Click Edit to modify the text. Click then OK to apply the changes of Cancel to reject them.

Click Insert to add a new empty cell below the current cell.

Click Duplicate to add a copy of the current cell below the current cell.

Click Up or Down to modify the order of the cells.

Click Delete to remove the cell.

The editing of the cells is the same for all types of the cells. The difference is how they render to the page. To change the type of the cell, click on Wiki, SQL, Data, PS or JS. The black button is the current type.

When the type of the cell is not Wiki, a Run and a Run Down button appear. The code is not run when you click OK, but when you click Run. What is the difference between the two buttons? Run only executes the code of the current cell. Run Down executes the current cell and all cells below.

When you have finished, you can save the project with the save button so that you can open it later with open.

Note that when you open a notebook, it is not executed immediately. If you want to execute all, go to the first cell with code and click Run Down.

## Wiki text
 
Wiki text can be formatted in a basic way: Header 2-4, italic, bold, unnumbered and numbered lists as well as URL with https protocol. You can include math notation with double and triple $.

## SQL code

Notebook uses the implementation of https://alasql.org/ which creates a in memory database which is in large parts standard.

When you create tables, always preceed CREATE TABLE with DROP TABLE IF EXISTS tablename;
The columns are not typed.

Every table can be downloaded as CSV file. The database is persistend between cells.

CREATE TABLE tablename AS (subquery) is not supported, but you can create the table and then use the INTO operator.


## Data cell

Sometimes you would not want to write SQL code to insert data. The data cell is a shortcut to create tables.

The data cell has a fixed format

The first line is the name of the table

The following line is CSV text you can copy paste from Excel for example

The separator can be comma, semicolon or tab and is automatically detected.

Quotes are handled and quoted text can have newlines.

The first line of the CVS must contain the column names. These must be valid SQL names.


## PostScript code


You can PostScript to visualize the data or to add illustration. PostScript is rendered to an SVG file you can save.

The data has to be prepared in a table. Set the first column to the category and the following to the values.

To get the data, use the table command. It has the syntax (tablename) 1 table when the first column is a category, (tablename) 0 table when the first column is also a number. The result in the stack is an array of rows which are arrays of column values.

The script has one installed fonts you can use: TGL017.

Extensions: 
- number **numberformat** string
- string number **preparechart**
- procedure **patternfill**
- string numer **table** array


## JavaScript code

You can add aribtrarily JavaScript code which will be added to the page. The function echo renders to the page.

But the main use case is to extend SQL.

You can define a custom function for SQL.

alasql.fn.double = function(x) { return x*2 );
