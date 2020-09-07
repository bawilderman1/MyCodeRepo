# weekly options intersects penny increment options
# average(volume,50) > 500000;
# last > 50;

declare lower;

def high20 = Highest(high, 20);
def low20 = Lowest(low, 20);

def volAvg50 = Average(volume, 50);
def lowVolume = volume < volAvg50 * 0.8;

def newHigh = high > high20[1];
def newLow = low < low20[1];

def LastHighGreaterThan4Bars = Sum(newHigh, 4) == 0;
def LastLowGreaterThan4Bars = Sum(newLow, 4) == 0;

def UpBreak = newHigh && LastHighGreaterThan4Bars[1] && lowVolume;
def DnBreak = newLow && LastLowGreaterThan4Bars[1] && lowVolume;

def UpSignal = (UpBreak && close < high20[1])
                OR (UpBreak[1] && close < high20[2]);
def DnSignal = (DnBreak && close > low20[1])
                OR (DnBreak[1] && close > low20[2]);

input signalOffset = 5;
Assert(signalOffset >= 0, "signalOffset must be positive or zero");
plot Signal = UpSignal[signalOffset] OR DnSignal[signalOffset] within 3 bars;