script LW_Tails {
    input Symbol = "SPY";
    input MedianLength = 5;

    def day = AggregationPeriod.DAY;
    #def todayOpen = GetValue(open(period = day), 0, 0);
    def todayOpen = Fundamental(FundamentalType.OPEN, Symbol, day);
    #def todayClose = GetValue(close(period = day), 0, 0);
    def todayClose = Fundamental(FundamentalType.CLOSE, Symbol, GetAggregationPeriod());
    #def todayHigh = GetValue(high(period = day), 0, 0);
    def todayHigh = if SecondsTillTime(0930) == 0 
            OR Fundamental(FundamentalType.HIGH, Symbol, GetAggregationPeriod()) > todayHigh[1] 
        then Fundamental(FundamentalType.HIGH, Symbol, GetAggregationPeriod()) 
        else todayHigh[1];
    #def todayLow = GetValue(low(period = day), 0, 0);
    def todayLow = if SecondsTillTime(0930) == 0 
            OR Fundamental(FundamentalType.LOW, Symbol, GetAggregationPeriod()) < todayLow[1] 
        then Fundamental(FundamentalType.LOW, Symbol, GetAggregationPeriod()) 
        else todayLow[1];

    def dayHigh = GetValue(Fundamental(FundamentalType.HIGH, Symbol, day), 1, 1);
    def dayLow = GetValue(Fundamental(FundamentalType.LOW, Symbol, day), 1, 1);
    def mdnRange = Median(dayHigh-dayLow, MedianLength);

    def todayRange = todayHigh-todayLow;
    def openPctOfRange = (todayOpen-todayLow)/(todayRange);
    def closePctOfRange = (todayClose-todayLow)/(todayRange);

    def upDay = Fundamental(FundamentalType.CLOSE, Symbol, GetAggregationPeriod()) > todayOpen;
    def dnDay = Fundamental(FundamentalType.CLOSE, Symbol, GetAggregationPeriod()) < todayOpen;

    def baseData = if upDay then (todayOpen-todayLow)/(mdnRange) 
        else if dnDay then 
            (todayHigh-todayOpen)/(mdnRange)
        else 0;

    def data = Round(baseData*100, 2);

    def isTrending = 
        (upDay and openPctOfRange <= 0.2 and closePctOfRange >= 0.8) 
        or
        (dnDay and openPctOfRange >= 0.8 and closePctOfRange <= 0.2);

    #def isTrendDay = if isTrending then Data else Double.NaN;

    def threshold = 15;

    plot Up = if data < threshold AND upDay then 1 else 0;
    plot Dn = if data < threshold AND dnDay then 1 else 0;
}

declare lower;
declare hide_on_daily;

input Price = FundamentalType.HLC3;
input SnP500 = "SPY";
input Nasdaq = "QQQ";
input Dow = "DIA";
input Russell = "IWM";
input ShowLabels = yes;
input ShowTails = yes;

def sOpen = Open(SnP500, AggregationPeriod.DAY);
def nOpen = Open(Nasdaq, AggregationPeriod.DAY);
def dOpen = Open(Dow, AggregationPeriod.DAY);
def rOpen = Open(Russell, AggregationPeriod.DAY);

def sClose = Fundamental(Price, SnP500, GetAggregationPeriod());
def nClose = Fundamental(Price, Nasdaq, GetAggregationPeriod());
def dClose = Fundamental(Price, Dow, GetAggregationPeriod());
def rClose = Fundamental(Price, Russell, GetAggregationPeriod());

plot SChg = Round(((sClose-sOpen)/sOpen)*100, 2);
SChg.SetDefaultColor(GetColor(1));

plot NChg = Round(((nClose-nOpen)/nOpen)*100, 2);
NChg.SetDefaultColor(GetColor(2));

plot DChg = Round(((dClose-dOpen)/dOpen)*100, 2);
DChg.SetDefaultColor(GetColor(4));

plot RChg = Round(((rClose-rOpen)/rOpen)*100, 2);
RChg.SetDefaultColor(GetColor(6));

plot Zero = 0;
Zero.SetDefaultColor(Color.WHITE);
Zero.SetStyle(Curve.MEDIUM_DASH);

AddLabel(ShowLabels, "S", GetColor(1));
AddLabel(ShowLabels, "N", GetColor(2));
AddLabel(ShowLabels, "D", GetColor(4));
AddLabel(ShowLabels, "R", GetColor(6));

def mdn = 5;
plot STail = if ShowTails AND (LW_Tails(SnP500, mdn).Up OR LW_Tails(SnP500, mdn).Dn) 
    then SChg 
    else Double.NaN;
STail.SetPaintingStrategy(PaintingStrategy.POINTS);
STail.SetDefaultColor(GetColor(1));

plot NTail = if ShowTails AND (LW_Tails(Nasdaq, mdn).Up OR LW_Tails(Nasdaq, mdn).Dn) 
    then NChg 
    else Double.NaN;
NTail.SetPaintingStrategy(PaintingStrategy.POINTS);
NTail.SetDefaultColor(GetColor(2));

plot DTail = if ShowTails AND (LW_Tails(Dow, mdn).Up OR LW_Tails(Dow, mdn).Dn) 
    then DChg 
    else Double.NaN;
DTail.SetPaintingStrategy(PaintingStrategy.POINTS);
DTail.SetDefaultColor(GetColor(4));

plot RTail = if ShowTails AND (LW_Tails(Russell, mdn).Up OR LW_Tails(Russell, mdn).Dn) 
    then RChg 
    else Double.NaN;
RTail.SetPaintingStrategy(PaintingStrategy.POINTS);
RTail.SetDefaultColor(GetColor(6));
