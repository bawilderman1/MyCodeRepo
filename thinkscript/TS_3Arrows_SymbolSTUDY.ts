declare lower;
AssignBackgroundColor(createColor(223,223,223)); 

input UserDefinedSymbol = "XLE";
input Label = "Energy";
############################################

def price = close(UserDefinedSymbol);
input length = 30;
input displace = 0;

def SMA = Average(price[-displace], length);

def agMa = if price > sma then 1
    else if price < sma then 0
    else agMa[1];
def arMa = if price < sma then -1 
    else if price > sma then 0
    else arMa[1];
#############################################
input fastLength = 8;
input slowLength = 17;
input MACDLength = 9;
input AverageType = {SMA, default EMA};

def Value;
def Avg;
switch (AverageType) {
case SMA:
    Value = Average(close(UserDefinedSymbol), fastLength) - Average(close(UserDefinedSymbol), slowLength);
    Avg = Average(Value, MACDLength);
case EMA:
    Value = ExpAverage(close(UserDefinedSymbol), fastLength) - ExpAverage(close(UserDefinedSymbol), slowLength);
    Avg = ExpAverage(Value, MACDLength);
}

def Diff = Value - Avg;
def ZeroLine = 0;
def agMacd = if diff > zeroline then 1 
    else if diff < zeroline then 0
    else agMacd[1];
def arMacd = if diff < zeroline then -1 
    else if diff > zeroline then 0
    else arMacd[1];
##############################################
input over_bought = 75;
input over_sold = 25;
input KPeriod = 14;
input lengthSto = 5;
def priceC = close(UserDefinedSymbol);
input smoothingType = {default SMA, EMA};

def hightest = Highest(high(UserDefinedSymbol), KPeriod);
def lowtest = Lowest(low(UserDefinedSymbol), KPeriod);

def K = (priceC - lowtest) / (hightest - lowtest) * 100;
#def D = Average(K, KPeriod);

def ValueSto;
switch (smoothingType) {
case SMA:
    ValueSto = Average(K, lengthSto);
case EMA:
    ValueSto = ExpAverage(K, lengthSto);
}

def slowk = ValueSto;

def OverBought = over_bought;
def OverSold = over_sold;

def agSto = if slowk crosses above OverSold then 1
    else if slowk crosses below OverBought then 0
    else if slowk crosses above 50 then 1 
    else if slowk crosses below 50 then 0 
    else agSto[1];

def arSto = if slowk crosses below OverBought then -1
    else if slowk crosses above OverSold then 0 
    else if slowk crosses above 50 then 0 
    else if slowk crosses below 50 then -1    
    else arSto[1];
#####################################################
# 3 Arrows Code

plot threeAGreen = (agMa + agMacd + agSto);
#plot threeAGreen = agSto;
threeAGreen.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
threeAGreen.SetLineWeight(3);

plot threeARed = (arMa + arMacd + arSto);
#plot threeARed = arSto;
threeARed.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
threeARed.SetLineWeight(3);
threeARed.SetDefaultColor(color.red);

plot ZeroLine2 = 0;
#####################################################
plot dotg = if threeAGreen crosses above 2 then 3.5 else double.NaN;
plot dotr = if threeAGreen crosses below 1 then -3.5 else double.NaN;
dotg.SetPaintingStrategy(PaintingStrategy.POINTS);
dotr.SetPaintingStrategy(PaintingStrategy.POINTS);
dotg.SetDefaultColor(color.dark_green);
dotr.SetDefaultColor(color.red);
########################################################
def timeG = if threeAGreen == 3 then 0 else (timeG[1] + 1);
def timeR = if threeAGreen == 0 then 0 else (timeR[1] + 1);
######################################################
AddLabel(yes, Concat(Concat(Label, ": "), round(close(UserDefinedSymbol), 2)), (if timeG < timeR then Color.UPTICK else Color.DOWNTICK));
#addlabel(yes, timeG, color.uptick);
#addlabel(yes, timeR, color.downtick);
AddLabel(yes, "MA", (if agMa == 1 then Color.UPTICK else Color.DOWNTICK));
AddLabel(yes, Concat("MACD: ", round(diff, 1)), (if agMacd == 1 then Color.UPTICK else Color.DOWNTICK));
AddLabel(yes, Concat("STO: ", round(slowk, 0)), (if agSto == 1 then Color.UPTICK else Color.DOWNTICK));