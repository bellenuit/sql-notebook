examples = {};
examples['home'] = `

[
    {
        "type": "wiki",
        "source": "==SQL Notebook==\\nNotebooks are applications that mix text and executable code in a printable document. They adhere to the scientific tradition to keep a journal of all experiences"
    },
    {
        "type": "sql",
        "source": "CREATE TABLE _cities;\\nINSERT INTO _cities (city, population, trees, cats) VALUES ('Zürich', 449000, 70000, 17839);\\nINSERT INTO _cities (city, population, trees, cats) VALUES ('Genève', 207000, 40000, 9773);\\nINSERT INTO _cities (city, population, trees, cats) VALUES ('Lausanne', 144000, 88000, 17339);\\nINSERT INTO _cities (city, population, trees, cats) VALUES ('St. Gallen', 82000, 80000, 4120);\\nSELECT * FROM _cities;"
    },
    {
        "type": "ps",
        "source": "(_cities) 1 preparechart \\ncategory xaxis yticks ygrid\\n[1 2 3] bar \\n(Population by city) [1 2 3] toplegend\\n(Credits) credits\\n(Bar chart) title\\nshowpage "
    },
    {
        "type": "wiki",
        "source": "I needed a notebook that can be installed anywhere and runs SQL code locally. This notebook runs in the webbrowser. You can download it this page as webpage and then it will run the computer and never communicate with a server.\\n\\nThe SQL notebook is a playground where you can explore data. You can import data and run queries on it. You can visualize the data using PostScript. And you can enhance both SQL and PostScript with JavaScript. You can save the notebook as JSON document and reopen it later. The JSON document is self contained, meaning that it contains all the data."
    },
    {
        "type": "wiki",
        "source": "===Help===\\n\\nSee '''Help''' menu on top.\\n\\n===Examples===\\nSee https://www.belle-nuit.com/sql-notebook-examples"
    }
]

`;
