declare hide_on_daily;
declare once_per_bar;

def aggDay = AggregationPeriod.DAY;
def fHigh = FundamentalType.HIGH;
def fLow = FundamentalType.LOW;
def fClose = FundamentalType.CLOSE;
def fOpen = FundamentalType.OPEN;


plot PrevDayHigh = GetValue(Fundamental(fHigh, GetSymbol(), aggDay), 1, 1);
PrevDayHigh.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevDayHigh.SetDefaultColor(Color.UPTICK);

plot PrevDayLow = GetValue(Fundamental(fLow, GetSymbol(), aggDay), 1, 1);
PrevDayLow.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevDayLow.SetDefaultColor(Color.DOWNTICK);

plot PrevDayClose = GetValue(Fundamental(fClose, GetSymbol(), aggDay), 1, 1);
PrevDayClose.SetPaintingStrategy(PaintingStrategy.DASHES);
PrevDayClose.SetDefaultColor(CreateColor(153, 204, 255));

plot CurrDayOpen = GetValue(Fundamental(fOpen, GetSymbol(), aggDay), 0, 0);
CurrDayOpen.SetPaintingStrategy(PaintingStrategy.DASHES);
CurrDayOpen.SetDefaultColor(Color.WHITE);
