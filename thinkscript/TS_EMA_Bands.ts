input length = 8;
input atrLength = 14;

plot ema = ExpAverage(close, length);
ema.SetDefaultColor(Color.YELLOW);

def _atr = MovingAverage(AverageType.WILDERS, TrueRange(high, close, low), atrLength);

plot UBand1 = ema + (1 * _atr);
UBand1.SetDefaultColor(Color.Dark_Gray);

plot UBand2 = ema + (2 * _atr);
UBand2.SetDefaultColor(Color.Dark_Gray);

plot LBand1 = ema - (1 * _atr);
LBand1.SetDefaultColor(Color.Dark_Gray);

plot LBand2 = ema - (2 * _atr);
LBand2.SetDefaultColor(Color.Dark_Gray);
