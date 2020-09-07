### Daily Attributes

# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

declare lower;

input signalOffset = 0;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");

def _open = open;
def _close = close;
def _high = high;
def _low = low;

def ema8 = ExpAverage(_close, 8); 
def ema21 = ExpAverage(_close, 21);
def atr14 = MovingAverage(AverageType.SIMPLE, TrueRange(_high, _close, _low), 14);
def atrFromEma8 = if _low > ema8 then (_low - ema8) / atr14
                  else if _high < ema8 then (_high - ema8) / atr14
                  else 0;

def upTrend = ema8 > ema21;
def dnTrend = ema8 < ema21;

def upSignal = upTrend and atrFromEma8 > 0.20;
def dnSignal = dnTrend and atrFromEma8 < -0.2;

plot Signal = upSignal[signalOffset] OR dnSignal[signalOffset] within 1 bars;

### Intraday (30min No Ext Hours) Attributes

input signalOffset = 0;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");

def lowCompressionSqueeze = !TTM_Squeeze(price=close,length=20,nk=2.0,nbb=2.0,alertline=1.0).SqueezeAlert;

plot Signal = lowCompressionSqueeze[signalOffset] within 1 bars;