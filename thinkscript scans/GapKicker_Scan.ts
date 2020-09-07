# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

input signalOffset = 0;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");

def _maShort = MovingAverage(AverageType.EXPONENTIAL, close, 8);
def _maLong = MovingAverage(AverageType.EXPONENTIAL, close, 21);
def _atr = MovingAverage(AverageType.WILDERS, TrueRange(high, close, low), 14);
def _atrFactor = 1.1;
def _barRange = (close - low) / (high - low);

def _baseUpLogic = close[1] < open[1] 
                   && _barRange[1] <= 0.5 
                   && close > open 
                   && _barRange >= 0.5 
                   && open > open[1];

def _expandUpLogic = close[1] < _maLong[1] && close[1] < _maShort[1] && open > _maShort && open > _maLong;
def _contractUpLogic = low[1] < (_maShort[1] - (_atrFactor * _atr[1]));

def _upSignal = _baseUpLogic && (_expandUpLogic OR _contractUpLogic);

def _baseDnLogic = close[1] > open[1] 
                   && _barRange[1] >= 0.5 
                   && close < open 
                   && _barRange <= 0.5 
                   && open < open[1];

def _expandDnLogic = close[1] > _maLong[1] && close[1] > _maShort[1] && open < _maShort && open < _maLong;
def _contractDnLogic = high[1] > (_maShort[1] + (_atrFactor * _atr[1]));

def _dnSignal = _baseDnLogic && (_expandDnLogic OR _contractDnLogic);

plot Signal = _upSignal[signalOffset] OR _dnSignal[signalOffset] within 1 bars;