declare hide_on_daily;
#declare once_per_bar;

DefineGlobalColor("pos", CreateColor(143, 239, 191));
DefineGlobalColor("neg", CreateColor(246, 188, 179));

#input AggPeriod = AggregationPeriod.FIFTEEN_MIN;
input ShowHL = yes;
input PaintBars = yes;

def AggPeriod = AggregationPeriod.FIFTEEN_MIN;

def fHigh = FundamentalType.HIGH;
def fLow = FundamentalType.LOW;
def fClose = FundamentalType.CLOSE;
def fOpen = FundamentalType.OPEN;


plot PrevPeriodHigh = if ShowHL then GetValue(Fundamental(fHigh, GetSymbol(), AggPeriod), 1, 1) else Double.NaN;
PrevPeriodHigh.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodHigh.SetDefaultColor(Color.UPTICK);

plot PrevPeriodLow = if ShowHL then GetValue(Fundamental(fLow, GetSymbol(), AggPeriod), 1, 1) else Double.NaN;
PrevPeriodLow.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodLow.SetDefaultColor(Color.DOWNTICK);

#plot PrevPeriodClose = GetValue(Fundamental(fClose, GetSymbol(), AggPeriod), 1, 1);
#PrevPeriodClose.SetPaintingStrategy(PaintingStrategy.DASHES);
#PrevPeriodClose.SetDefaultColor(CreateColor(153, 204, 255));

plot CurrPeriodOpen = GetValue(Fundamental(fOpen, GetSymbol(), AggPeriod), 0, 0);
CurrPeriodOpen.SetPaintingStrategy(PaintingStrategy.DASHES);
CurrPeriodOpen.SetDefaultColor(Color.WHITE);
CurrPeriodOpen.SetLineWeight(2);

AddVerticalLine(
    (secondsFromTime(930)/60) % 15 == 0, 
    "",
    Color.GRAY, 
    Curve.SHORT_DASH);

AssignPriceColor(
    if PaintBars and close > CurrPeriodOpen then GlobalColor("pos") 
    else if PaintBars and close < CurrPeriodOpen then GlobalColor("neg") 
    else Color.CURRENT
);
