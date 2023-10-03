declare hide_on_daily;

DefineGlobalColor("pos", CreateColor(143, 239, 191));
DefineGlobalColor("neg", CreateColor(246, 188, 179));

input ShowHL = yes;
input PaintBars = yes;

def AggPeriod = AggregationPeriod.FIFTEEN_MIN;

def openBar = SecondsFromTime(0930) >= 0 and SecondsTillTime(0945) > 0;
def afterOpenBar = SecondsFromTime(0945) >= 0 and SecondsTillTime(1600) > 0;

def rollingHigh = if openBar 
        then GetValue(High(period=AggPeriod), 0) 
    else if afterOpenBar and GetValue(High(period=AggPeriod), 1) > GetValue(rollingHigh, 1) 
        then GetValue(High(period=AggPeriod), 1)
    else GetValue(rollingHigh, 1);
def rollingLow = if openBar 
        then GetValue(Low(period=AggPeriod), 0) 
    else if afterOpenBar and GetValue(Low(period=AggPeriod), 1) < GetValue(rollingLow, 1) 
        then GetValue(Low(period=AggPeriod), 1)
    else GetValue(rollingLow, 1);

plot PrevPeriodHigh = if ShowHL and afterOpenBar then rollingHigh else Double.NaN;
PrevPeriodHigh.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodHigh.SetDefaultColor(Color.UPTICK);

plot PrevPeriodLow = if ShowHL and afterOpenBar then rollingLow else Double.NaN;
PrevPeriodLow.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodLow.SetDefaultColor(Color.DOWNTICK);

plot CurrPeriodOpen = GetValue(Open(period=AggPeriod), 0, 0);
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
