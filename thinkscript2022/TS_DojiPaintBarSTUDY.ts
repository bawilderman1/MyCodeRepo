declare upper;

#DefineGlobalColor("mediumGreen", CreateColor(103, 191, 92));
#DefineGlobalColor("mediumRed", CreateColor(237, 102, 93));
#DefineGlobalColor("mediumBlue", CreateColor(114, 158, 206));
#DefineGlobalColor("mediumYellow", CreateColor(255, 221, 113));
DefineGlobalColor("golden", CreateColor(238, 204, 95));

input IntradayAtrs = 0.8;
Assert(IntradayAtrs >= 0, "IntradayAtrs must be positive or zero");


def _open = open;
def _close = close;
def _high = high;
def _low = low;

def length = 14;
def bodySize = BodyHeight();                        #Bar Height
def avgBodySize = Average(bodySize, length);        #Average Bar Height
def stDevBody = StDev(avgBodySize, length) * 0.8;   #80% of 1 Standard Deviation
def bodyType = if (bodySize > avgBodySize + stDevBody) then 2 
               else if (bodySize between avgBodySize - stDevBody and avgBodySize + stDevBody) then 1
               else 0;                #2 = Long; 1 = Average; 0 = Short
def ema8 = MovAvgExponential(_close, 8);

def intradayRange = AbsValue(_open - _close);
def dayRange = _high - _low;
def doji = bodyType <= 1 && intradayRange / dayRange < 0.15;

AssignPriceColor(if doji then GlobalColor("golden") else Color.CURRENT);
