# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

declare lower;

input signalOffset = 2;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");
input IntradayAtrs = 0.8;
Assert(IntradayAtrs >= 0, "IntradayAtrs must be positive or zero");

#def _atr = MovingAverage(AverageType.WILDERS, TrueRange(high, close, low), 14);
#def _maShort = MovingAverage(AverageType.EXPONENTIAL, close, 8);

#def _atrFromMa = if low > _maShort then (low - _maShort) / _atr
#                  else if high < _maShort then (high - _maShort) / _atr
#                  else 0;

def length = 14;
def bodySize = BodyHeight();                        #Bar Height
def avgBodySize = Average(bodySize, length);        #Average Bar Height
def stDevBody = StDev(avgBodySize, length) * 0.8;   #80% of 1 Standard Deviation
def bodyType = if (bodySize > avgBodySize + stDevBody) then 2 
               else if (bodySize between avgBodySize - stDevBody and avgBodySize + stDevBody) then 1
               else 0;                #2 = Long; 1 = Average; 0 = Short
#def ema8 = MovAvgExponential(_close, 8);

def intradayRange = AbsValue(open - close);
def dayRange = high - low;
def bodyHigh = Max(close, open);
def bodyLow = Min(close, open);
def uWick = high - bodyHigh;    #Upper Wick
def lWick = bodyLow - low;       #Lower Wick

def hammerCandle = lWick / dayRange >= 0.60;
def invHammerCandle = uWick / dayRange >= 0.60;

#def doji = bodyType == 0 && intradayRange / dayRange < 0.15;
def marubozu = intradayRange / dayRange >= 0.8;

def _upSignal = marubozu[1] && bodyType[1] >= 1 && close[1] < open[1] && invHammerCandle && bodyLow >= bodyLow[1] && bodyHigh < hl2[1] && high < high[1] && low > low[1];

#def _dnSignal = doji[1] && _atrFromMa[1] < 0.2 && _atrFromMa[1] >= 0 && _open < _low[1] && _close < ema8 && _close < _close[1];

plot Signal = _upSignal[signalOffset] within 3 bars;