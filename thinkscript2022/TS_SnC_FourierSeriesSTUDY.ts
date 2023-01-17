script BandpassFilter {
    input length = 20;
    input bandwidth = 0.1;
    input harmonic = 1;

    def l = Cos(2 * Double.Pi / (length / harmonic));
    def g = Cos(bandwidth * 2 * Double.Pi / (length / harmonic));
    def s = 1 / g - Sqrt(1 / Sqr(g) - 1);
    def bp = if IsNaN(close + close[2]) then 0 else (1 - s) * (close - close[2]) / 2 + l * (1 + s) * bp[1] - s * bp[2];
    plot Bandpass = bp;
}

declare lower;

input length = 20;
input bandwidth = 0.1;
input ShowSignals = yes;

def bandpass1 = BandpassFilter(20, 0.1, 1);
def bandpass2 = BandpassFilter(20, 0.1, 2);
def bandpass3 = BandpassFilter(20, 0.1, 3);

def quadrature1 = length / (2 * Double.Pi) * (bandpass1 - bandpass1[1]);
def quadrature2 = length / (2 * Double.Pi) * (bandpass2 - bandpass2[1]);
def quadrature3 = length / (2 * Double.Pi) * (bandpass3 - bandpass3[1]);

def power1 = Sum(Sqr(bandpass1) + Sqr(quadrature1), length);
def power2 = Sum(Sqr(bandpass2) + Sqr(quadrature2), length);
def power3 = Sum(Sqr(bandpass3) + Sqr(quadrature3), length);

plot Wave = bandpass1 + Sqrt(power2 / power1) * bandpass2 + Sqrt(power3 / power1) * bandpass3;
plot ZeroLine = 0;

Wave.SetDefaultColor(GetColor(2));
ZeroLine.SetDefaultColor(GetColor(7));

plot BuySignal = if (ShowSignals and Wave crosses above ZeroLine) 
                    then -0.5 
                 else Double.NaN;
BuySignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
BuySignal.SetDefaultColor(GetColor(2));

plot SellSignal = if (ShowSignals and Wave crosses below ZeroLine)
                    then 0.5
                  else Double.NaN;
SellSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
SellSignal.SetDefaultColor(GetColor(2));
