declare lower;

plot RSI = RSI(14, 70, 30, CLOSE, AverageType.WILDERS, no).RSI;
RSI.SetDefaultColor(Color.YELLOW);

plot FastSMA = MovingAverage(AverageType.SIMPLE, RSI, 9);
FastSMA.SetDefaultColor(Color.WHITE);
FastSMA.SetStyle(Curve.SHORT_DASH);

plot SlowEMA = ExpAverage(RSI, 45);
SlowEMA.SetDefaultColor(Color.BLUE);
SlowEMA.SetStyle(Curve.FIRM);

plot Twenty = 20;
Twenty.SetDefaultColor(Color.DOWNTICK);
Twenty.SetStyle(Curve.FIRM);

plot Forty = 40;
Forty.SetDefaultColor(Color.UPTICK);
Forty.SetStyle(Curve.MEDIUM_DASH);

plot Sixty = 60;
Sixty.SetDefaultColor(Color.DOWNTICK);
Sixty.SetStyle(Curve.MEDIUM_DASH);

plot Eighty = 80;
Eighty.SetDefaultColor(Color.UPTICK);
Eighty.SetStyle(Curve.FIRM);
