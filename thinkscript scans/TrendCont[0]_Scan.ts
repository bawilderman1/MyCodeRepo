# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

declare lower;

input signalOffset = 0;
# input signalOffset = 1; ### -> Use offset to look additional days back
Assert(signalOffset >= 0, "signalOffset must be positive or zero");
input RunLength = 5;

def _open = open;
def _close = close;
def _high = high;
def _low = low;

def higherHigh = _high > _high[1];
def higherLow = _low > _low[1];
def lowerHigh = _high < _high[1];
def lowerLow = _low < _low[1];

def closeRange = (_close - _low) / (_high - _low);
def upDay = _close > _open;
def dnDay = _close < _open;

def ema3High = ExpAverage(_high, 3);
def ema3Low = ExpAverage(_low, 3);

def ema8 = ExpAverage(_close, 8); 
def ema21 = ExpAverage(_close, 21);
def atr14 = MovingAverage(AverageType.SIMPLE, TrueRange(_high, _close, _low), 14);
def atrFromEma8 = if _low > ema8 then (_low - ema8) / atr14
                  else if _high < ema8 then (_high - ema8) / atr14
                  else 0;
def incrAtrFromEma8 = atrFromEma8 > atrFromEma8[1];
def decrAtrFromEma8 = atrFromEma8 < atrFromEma8[1];

def upTrend = ema8 > ema21;
def dnTrend = ema8 < ema21;

#######################################################################

def MaRiseHeight = ema8 - GetValue(ema8, runLength -1);

def MaAngle = (ATan(MaRiseHeight / runLength) * 180) / Double.Pi;

def PriceRiseHeight = hlc3 - GetValue(hlc3, runLength -1);
def PriceAngle = (ATan(PriceRiseHeight / runLength) * 180) / Double.Pi;

def PriceAngle_Offset3 = PriceAngle[2];
def PriceAngle_Offset5 = PriceAngle[4];

########################################################################


def upTestCondition = if upTrend AND atrFromEma8 crosses below 0.2 AND atrFromEma8 >= 0 then 1
                      else if atrFromEma8 < 0 OR dnTrend OR incrAtrFromEma8 then 0
                      else CompoundValue(1, upTestCondition[1], 0);

def upEma8Touches = if ema8 crosses ema21 then 0
                  else if upTrend AND upTestCondition[1] AND !upTestCondition AND incrAtrFromEma8 AND closeRange > 0.5 
                    then upEma8Touches[1] + 1
                  else CompoundValue(1, upEma8Touches[1], 0);

#def upSignal = if upTrend AND incrAtrFromEma8  
#                  AND upTestCondition[1] AND !upTestCondition 
#                  AND (closeRange > 0.5 OR _close > _close[1]) then 1
#               else 0;

def upSignal = if upTrend AND (upTestCondition[1] OR upTestCondition)
                  AND (PriceAngle_Offset3 >= 25 OR PriceAngle_Offset5 >= 25)
                  AND MaAngle >= 25 AND PriceAngle < MaAngle
                  AND close < ema3High AND close > ema8 then 1
               else 0;

def dnTestCondition = if dnTrend AND atrFromEma8 crosses above -0.2 AND atrFromEma8 <= 0 then 1
                      else if atrFromEma8 > 0 OR upTrend OR decrAtrFromEma8 then 0
                      else CompoundValue(1, dnTestCondition[1], 0);

def dnEma8Touches = if ema8 crosses ema21 then 0
                  else if dnTrend AND dnTestCondition[1] AND !dnTestCondition AND decrAtrFromEma8 AND closeRange < 0.5
                    then dnEma8Touches[1] + 1
                  else CompoundValue(1, dnEma8Touches[1], 0);

def dnSignal = if dnTrend AND (dnTestCondition[1] OR dnTestCondition)
                  AND (PriceAngle_Offset3 <= -25 OR PriceAngle_Offset5 <= -25)
                  AND MaAngle <= -25 AND PriceAngle > MaAngle
                  AND close > ema3Low AND close < ema8 then 1
               else 0;

plot Signal = upSignal[signalOffset] OR dnSignal[signalOffset] within 1 bars;