declare upper;

DefineGlobalColor("plot", CreateColor(255, 255, 255));

input ShowLabel = yes;
input Operator = { default "+", "-" };

def hl1;
def hl2;
def h;
def l;
def o;
def c;
switch (Operator) {
case "+":
    o = open(GetSymbolPart(1)) + open(GetSymbolPart(2));
    c = close(GetSymbolPart(1)) + close(GetSymbolPart(2));
    hl1 = high(GetSymbolPart(1)) + low(GetSymbolPart(2));
    hl2 = low(GetSymbolPart(1)) + high(GetSymbolPart(2));
    h = Max(Max(Max(hl1, hl2), o), c);
    l = Min(Min(Min(hl1, hl2), o), c);
case "-":
    o = open(GetSymbolPart(1)) - open(GetSymbolPart(2));
    c = close(GetSymbolPart(1)) - close(GetSymbolPart(2));
    hl1 = high(GetSymbolPart(1)) - low(GetSymbolPart(2));
    hl2 = low(GetSymbolPart(1)) - high(GetSymbolPart(2));
    h = Max(Max(Max(hl1, hl2), o), c);
    l = Min(Min(Min(hl1, hl2), o), c);
}

AddChart(
    high = h, 
    low  = l, 
    open = o, 
    close = c, 
    type = ChartType.CANDLE , 
    GlobalColor("plot"));

AddLabel(ShowLabel, GetSymbolPart(1), GlobalColor("plot"));
AddLabel(ShowLabel, GetSymbolPart(2), GlobalColor("plot"));
