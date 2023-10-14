DefineGlobalColor("faintYellow", CreateColor(255, 242, 153));
DefineGlobalColor("rain", CreateColor(110, 196, 219));
#DefineGlobalColor("bluesy", CreateColor(0, 125, 225));
#DefineGlobalColor("sunny", CreateColor(255, 221, 113));
#DefineGlobalColor("offgray", CreateColor(108, 108, 108));
#DefineGlobalColor("mediumYellow", CreateColor(255,221,113));
DefineGlobalColor("sunset", CreateColor(238, 108, 77));

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
    if MACD crosses above "+Rms" then 1
    else if MACD[1] crosses below "-Rms"[1] then 0
    else if MACD < "+Rms" and MACD crosses above signal then 0
    else posTrigger[1],
    0);
#plot PTrig = if posTrigger then 0.5 else Double.NaN;
#PTrig.SetDefaultColor(Color.UPTICK);
#PTrig.SetPaintingStrategy(PaintingStrategy.POINTS);

def negTrigger = CompoundValue(
    1,
    if MACD crosses below "-Rms" then 1
    else if MACD[1] crosses above "+Rms"[1] then 0
    else if MACD > "-Rms" and MACD crosses below signal then 0
    else negTrigger[1],
    0);
#plot NTrig = if negTrigger then -0.5 else Double.NaN;
#NTrig.SetDefaultColor(Color.DOWNTICK);
#NTrig.SetPaintingStrategy(PaintingStrategy.POINTS);

plot ZCross = if MACD crosses Zero then Zero else Double.NaN;
ZCross.SetDefaultColor(GlobalColor("faintYellow"));
ZCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot PCross = if MACD crosses above "+Rms" and negTrigger then "+Rms" else Double.NaN;
PCross.SetDefaultColor(GlobalColor("sunset"));
PCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot NCross = if MACD crosses below "-Rms" and posTrigger then "-Rms" else Double.NaN;
NCross.SetDefaultColor(GlobalColor("sunset"));
NCross.SetPaintingStrategy(PaintingStrategy.POINTS);

plot FlipDn = if MACD crosses below signal and MACD > "+Rms" then MACD else Double.NaN;
FlipDn.SetDefaultColor(GlobalColor("rain"));
FlipDn.SetPaintingStrategy(PaintingStrategy.POINTS);

plot FlipUp = if MACD crosses above signal and MACD < "-Rms" then MACD else Double.NaN;
FlipUp.SetDefaultColor(GlobalColor("rain"));
FlipUp.SetPaintingStrategy(PaintingStrategy.POINTS);
