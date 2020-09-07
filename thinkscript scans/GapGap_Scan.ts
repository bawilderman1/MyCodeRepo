# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

input signalOffset = 0;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");

def _maShort = MovingAverage(AverageType.EXPONENTIAL, close, 8);
def _maLong = MovingAverage(AverageType.EXPONENTIAL, close, 21);
def _atr = MovingAverage(AverageType.WILDERS, TrueRange(high, close, low), 14);
def _atrFactor = 1.25;
def _barRange = (close - low) / (high - low);

def _gapUp = open > high[1];
def _gapDn = open < low[1];

def _upExtension = high > (_maShort + (_atrFactor * _atr));
def _dnExtension = low < (_maShort - (_atrFactor * _atr));

def _upUp = _gapUp[1] && _gapUp && _upExtension;
def _dnDn = _gapDn[1] && _gapDn && _dnExtension;
def _upDn = _gapUp[1] && _upExtension[1] && _gapDn;
def _dnUp = _gapDn[1] && _dnExtension[1] && _gapUp;

def _upSignal = _dnDn OR _dnUp;
def _dnSignal = _upUp OR _upDn;

plot Signal = _upSignal[signalOffset] OR _dnSignal[signalOffset] within 1 bars;