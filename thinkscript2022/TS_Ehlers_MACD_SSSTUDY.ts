declare lower;

input Price = close;
input FastLen = 12;
input SlowLen = 26;
input SmoothLen = 9;

def fast = EhlersSuperSmootherFilter(Price, FastLen);
def slow = EhlersSuperSmootherFilter(Price, SlowLen);

plot MACD = fast - slow;
plot Signal = MACD[1];
#plot Signal = EhlersSuperSmootherFilter(MACD, SmoothLen);

plot Zero = 0;

MACD.SetDefaultColor(GetColor(4));
Zero.SetDefaultColor(GetColor(7));
Signal.SetDefaultColor(GetColor(1));

def Rms = Sqrt(EhlersSuperSmootherFilter(Sqr(MACD), slowLen));
plot "+Rms" = Rms;
plot "-Rms" = -Rms;

"+Rms".SetDefaultColor(GetColor(7));
"-Rms".SetDefaultColor(GetColor(7));
