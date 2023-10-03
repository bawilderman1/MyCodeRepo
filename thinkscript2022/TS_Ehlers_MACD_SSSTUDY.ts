#DefineGlobalColor("buttermilk", CreateColor(255, 247, 192));
#DefineGlobalColor("rain", CreateColor(110, 196, 219));
#DefineGlobalColor("bluesy", CreateColor(0, 125, 225));
#DefineGlobalColor("sunny", CreateColor(255, 221, 113));
#DefineGlobalColor("offgray", CreateColor(79, 79, 79));

declare lower;

input Price = close;
input FastLen = 12;
input SlowLen = 26;

def fast = EhlersSuperSmootherFilter(GetValue(Price, 0), FastLen);
def slow = EhlersSuperSmootherFilter(GetValue(Price, 0), SlowLen);

plot MACD = Round(fast - slow, 2);
def signal = GetValue(MACD, 1);
#plot Signal = MACD[1];
#plot Signal = EhlersSuperSmootherFilter(MACD, SmoothLen);

plot Zero = 0;

MACD.SetDefaultColor(Color.WHITE);
#MACD.SetDefaultColor(GetColor(4));
Zero.SetDefaultColor(GetColor(7));
#Signal.SetDefaultColor(GetColor(1));

def Rms = Round(Sqrt(EhlersSuperSmootherFilter(Sqr(MACD), slowLen)), 2);
plot "+Rms" = if !IsNaN(MACD) and IsNaN(Rms) then 0 else Rms;
plot "-Rms" = if !IsNaN(MACD) and IsNaN(Rms) then 0 else -Rms;
"+Rms".SetDefaultColor(GetColor(7));
"-Rms".SetDefaultColor(GetColor(7));

def posTrigger = CompoundValue(
    1,
    if MACD crosses above 0 then 1
    else if MACD[1] crosses below "-Rms"[1] then 0
    else posTrigger[1],
    0);
#plot PTrig = if posTrigger then 0.5 else Double.NaN;
#PTrig.SetDefaultColor(Color.UPTICK);
#PTrig.SetPaintingStrategy(PaintingStrategy.POINTS);

def negTrigger = CompoundValue(
    1,
    if MACD crosses below 0 then 1
    else if MACD[1] crosses above "+Rms"[1] then 0    
    else negTrigger[1],
    0);
#plot NTrig = if negTrigger then -0.5 else Double.NaN;
#NTrig.SetDefaultColor(Color.DOWNTICK);
#NTrig.SetPaintingStrategy(PaintingStrategy.POINTS);

plot ZCross = if MACD crosses Zero then Zero else Double.NaN;
ZCross.SetDefaultColor(GetColor(4));
ZCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot PCross = if MACD crosses above "+Rms" and negTrigger then "+Rms" else Double.NaN;
PCross.SetDefaultColor(GetColor(4));
PCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot NCross = if MACD crosses below "-Rms" and posTrigger then "-Rms" else Double.NaN;
NCross.SetDefaultColor(GetColor(4));
NCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot FlipDn = if MACD crosses below signal and MACD > "+Rms" then MACD else Double.NaN;
FlipDn.SetDefaultColor(GetColor(1));
FlipDn.SetPaintingStrategy(PaintingStrategy.POINTS);

plot FlipUp = if MACD crosses above signal and MACD < "-Rms" then MACD else Double.NaN;
FlipUp.SetDefaultColor(GetColor(1));
FlipUp.SetPaintingStrategy(PaintingStrategy.POINTS);


#Quartile Estimate
def bandLength = 125;
def band = Round(AbsValue("+Rms" - "-Rms"), 2);
def bandMedian = Median(band, bandLength);
def qEst = Round(AbsValue(bandMedian / 2), 2);
#plot Q1 = bandMedian/2;
plot Squeeze = if band < qEst and BarNumber() > bandLength then 0 else Double.NaN;
Squeeze.SetDefaultColor(Color.DOWNTICK);
Squeeze.SetPaintingStrategy(PaintingStrategy.SQUARES);
Squeeze.SetLineWeight(2);
