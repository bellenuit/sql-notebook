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


rpnOperators.numberformat = function(context) {
    const [r] = context.pop("number");
    if (!r) return context;
    const x = new Intl.NumberFormat('en-US',{maximumFractionDigits: 2}).format(r.value).replaceAll(","," ");
    context.stack.push(new rpnString(x,context.heap));
    return context;
};
rpnOperators.preparechart = function(context) {
    const code = `
% options
/colors [ [0.078 0.431 0.667] [0 0.510 0.353] [0.902 0.196 0.157] [0.941 0.549 0.157] [0.427 0.224 0.545] [0.941 0.784 0] ] def 
/blue [0.078 0.431 0.667] def
/green [0 0.510 0.353] def
/red [0.902 0.196 0.157]  def
/orange [0.941 0.549 0.157] def
/violet [0.427 0.224 0.545] def
/yellow [0.941 0.784 0] def
/black [0 0 0] def
/gray [ 0.5 0.5 0.5 ] def
/width 550 def
/height 290 def
/TGL017 findfont 16 scalefont setfont 

% utilities
/round1 { log 0.5 sub round 10 exch exp } def
/setcolor { /c exch def c 0 get c 1 get c 2 get setrgbcolor } def
/verticalbar { /pos exch def setcolor /s exch def 1 1 xcount { /x exch def
/y data x get s get ymin sub yscale mul def
x 0.5 sub xoffset mul 
series 2 div barwidth mul sub 
pos 1 sub barwidth mul add 0 moveto 
barwidth 0 rlineto 0 y rlineto barwidth neg 0 rlineto closepath fill  } for} def
/stackedverticalbar { /pos exch def /cols exch def /sgroup exch def
1 1 xcount { /x exch def /ybase 0 def
1 1 sgroup length { /s exch def
/y data x get s get ymin sub yscale mul def
cols s 1 sub get setcolor
x 0.5 sub xoffset mul
series 2 div barwidth mul sub 
pos 1 sub barwidth mul add ybase moveto 
barwidth 0 rlineto 0 y rlineto barwidth neg 0 rlineto closepath fill 
/ybase y def } for  } for} def
/dot { setcolor /s exch def 1 1 xcount { /x exch def 
/y data x get s get ymin sub yscale mul def
4 setlinewidth
/x1 x 0.5 sub xoffset mul def
x1 y 4 0 360 arc fill } for
} def

/straightline { setcolor /s exch def 1 1 xcount { /x exch def 
/y data x get s get ymin sub yscale mul def
4 setlinewidth
/x1 x 0.5 sub xoffset mul def
x 1 eq { x1 y moveto } { x1 y lineto} ifelse } for
stroke
} def
/splineline { setcolor /s exch def 
/y data 1 get s get  def
/after data 2 get s get def
/c1 after y sub 3 div y add def
1 0.5 sub xoffset mul y ymin sub yscale mul moveto
2 1 xcount 1 sub { /x exch def 
/before data x 1 sub get s get  def
/y data x get s get  def
/after data x 1 add get s get def
/c2 before after sub 6 div y add def
x 0.5 sub 0.66 sub xoffset mul c1 ymin sub yscale mul  
x 0.5 sub 0.33 sub xoffset mul c2 ymin sub yscale mul  
x 0.5 sub xoffset mul y ymin sub yscale mul curveto
/c1 y y c2 sub add def
 } for
/y data xcount get s get def
/before data xcount 1 sub get s get def
/c2 before y sub 3 div y add def
0.5 xcount 1 sub add 0.66 sub xoffset mul c1 ymin sub yscale mul  
0.5 xcount 1 sub add 0.33 sub xoffset mul c2 ymin sub yscale mul  
0.5 xcount 1 sub add xoffset mul y ymin sub yscale mul curveto
4 setlinewidth
stroke
} def
/bars {
1 1 series { /s exch def s colors s 1 sub get s verticalbar } for
} def 
/lines {
1 1 series { /s exch def s colors s 1 sub get straightline } for
} def 
/splinelines {
1 1 series { /s exch def s colors s 1 sub get splineline } for
} def 
/dots {
1 1 series { /s exch def s colors s 1 sub get dot } for
} def
% autosize
/xcount data length 1 sub def
/series data 0 get length 1 sub def
/ymax data 1 get 1 get def
/ymin data 1 get 1 get def
1 1 series { /s exch def
1 1 xcount { /x exch def /y data x get s get def
/ymax ymax y max def /ymin ymin y min def } for } for


/ystep ymax ymin sub round1 def

/ymin ymin ystep div 0.8 sub round ystep mul def

/ycount ymax ymin sub ystep div 1.0 add round def
/xaxish 30 def
/yscale height ycount 2 add ystep mul xaxish add div def

/yaxisw ymax numberformat stringwidth pop 15 add def 
/width2 width yaxisw sub def
/series data 0 get length 1 sub def
/barwidth width2 xcount div series 1 add div round def
/xoffset width2 xcount div round def

/ydim {
/ymax exch def
/ystep exch def
 /ymin exch def 
/ycount ymax ymin sub ystep div round def
/yscale height ycount 2 add ystep mul xaxish add div def
} def

/xdim { 
/x exch def
/width2 width2 x sub def
/series data 0 get length 1 sub def
/barwidth width2 xcount div series 1 add div round def
/xoffset width2 xcount div def
} def


% set origin
% frame
% 0 0 moveto width 0 lineto width height lineto 0 height lineto closepath stroke

/yaxis { gsave 
0 1 ycount { /y exch def 
0.7 setgray
y ystep mul yscale mul 0 exch moveto width2 0 rlineto stroke 
0 setgray
/label y ystep mul ymin add numberformat def
label stringwidth pop neg 2 sub y ystep mul yscale mul moveto label show} for
grestore} def

/xlabels { gsave
1 1 xcount { /x exch def
/label data x get 0 get def 
0 setgray
x 0.5 sub xoffset mul 
label stringwidth pop 2 div sub -20 moveto label show
} for
grestore } def

/xaxis { gsave
0 setgray 
2 setlinewidth
0 0 moveto width2 0 lineto stroke
% title

grestore } def

/title { /s exch def
0 setgray
yaxisw neg ycount 1 add ystep mul yscale mul moveto s show
} def

/legend { /y exch series 20 mul add def /x exch def
1 1 series { /s exch def
colors s 1 sub get setcolor
x y moveto 10 0 rlineto 0 10 rlineto -10 0 rlineto closepath fill 
black setcolor
x 15 add y moveto data 0 get s get show
/y y 20 sub def
} for
} def

/inlinelegend {
1 1 series { /s exch def
colors s 1 sub get setcolor
/x xcount xoffset mul def
/y data xcount get s get ymin sub yscale mul def
x 3 add y 8 sub moveto data 0 get s get show
} for
} def


`;
    context =  rpn(code, context);
    return context;
};