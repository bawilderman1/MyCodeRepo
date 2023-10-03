declare hide_on_intraday;
declare once_per_bar;

input AggPeriod = AggregationPeriod.WEEK;

def fHigh = FundamentalType.HIGH;
def fLow = FundamentalType.LOW;
def fClose = FundamentalType.CLOSE;
def fOpen = FundamentalType.OPEN;


plot PrevPeriodHigh = GetValue(Fundamental(fHigh, GetSymbol(), AggPeriod), 1, 1);
PrevPeriodHigh.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodHigh.SetDefaultColor(Color.UPTICK);

plot PrevPeriodLow = GetValue(Fundamental(fLow, GetSymbol(), AggPeriod), 1, 1);
PrevPeriodLow.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodLow.SetDefaultColor(Color.DOWNTICK);

plot PrevPeriodClose = GetValue(Fundamental(fClose, GetSymbol(), AggPeriod), 1, 1);
PrevPeriodClose.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevPeriodClose.SetDefaultColor(CreateColor(153, 204, 255));

plot CurrPeriodOpen = GetValue(Fundamental(fOpen, GetSymbol(), AggPeriod), 0, 0);
CurrPeriodOpen.SetPaintingStrategy(PaintingStrategy.DASHES);
CurrPeriodOpen.SetDefaultColor(Color.WHITE);
