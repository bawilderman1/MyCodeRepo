declare lower;

input rmsLength = 50;
input cutoffLength = 20;

def derivative = close - close[2];
def rms = Sqrt(Average(Sqr(derivative), rmsLength));
def normDerivative = derivative / rms;
def ift = (Exp(2 * normDerivative) - 1) / (Exp(2 * normDerivative) + 1);

plot ElegantOsc = reference EhlersSuperSmootherFilter(price = ift, "cutoff length" = cutoffLength);
plot ZeroLine = 0;

ElegantOsc.SetDefaultColor(GetColor(2));
ZeroLine.SetDefaultColor(GetColor(7));
