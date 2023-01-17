declare lower;

input AvgLength = 10;
input AvgType = AverageType.SIMPLE;

plot Lvl1 = -0.8;
plot Lvl2 = -0.9;
plot Lvl3 = -1.0;
plot Lvl4 = -1.1;
plot Lvl5 = -1.2;
plot Lvl6 = -1.3;

Lvl1.SetDefaultColor(GetColor(3));
Lvl2.SetDefaultColor(GetColor(3));
Lvl3.SetDefaultColor(GetColor(3));
Lvl4.SetDefaultColor(GetColor(3));
Lvl5.SetDefaultColor(GetColor(3));
Lvl6.SetDefaultColor(GetColor(3));

Lvl1.SetStyle(Curve.MEDIUM_DASH);
Lvl2.SetStyle(Curve.MEDIUM_DASH);
Lvl3.SetStyle(Curve.MEDIUM_DASH);
Lvl4.SetStyle(Curve.MEDIUM_DASH);
Lvl5.SetStyle(Curve.MEDIUM_DASH);
Lvl6.SetStyle(Curve.MEDIUM_DASH);

def uvolCl = close("$UVOLSP");
#def uvolH = high("$UVOLSP");
#def uvolL = low("$UVOLSP");
#def uvolTp = hlc3("$UVOLSP");

def dvolCl = close("$DVOLSP");
#def dvolH = high("$DVOLSP");
#def dvolL = low("$DVOLSP");
#def dvolTp = hlc3("$DVOLSP");

def advCl = close("$ADVSP");
#def advH = high("$ADVSP");
#def advL = low("$ADVSP");
#def advTp = hlc3("$ADVSP");

def decCl = close("$DECLSP");
#def decH = high("$DECLSP");
#def decL = low("$DECLSP");
#def decTp = hlc3("$DECLSP");

def tradeMetric = -(decCl/advCl)/(dvolCl/uvolCl);
#def tradeMetric = (advCl/decCl)/(uvolCl/dvolCl);
plot TradingIndex = MovingAverage(
    AvgType, 
    tradeMetric, 
    AvgLength);
TradingIndex.SetDefaultColor(GetColor(2));


