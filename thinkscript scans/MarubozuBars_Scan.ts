# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

declare lower;

input signalOffset = 2;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");
input IntradayAtrs = 0.8;
Assert(IntradayAtrs >= 0, "IntradayAtrs must be positive or zero");


def _open = open;
def _close = close;
def _high = high;
def _low = low;

def intradayRange = AbsValue(_open - _close);
def atr14 = MovingAverage(AverageType.WILDERS, TrueRange(_high, _close, _low), 14);
def intradayPct = intradayRange / _open;

def _signal = intradayRange / atr14 > IntradayAtrs;

plot Signal = _signal[signalOffset] within 3 bars;