script EhlersHighpassFilter {
    input price = close;
    input roofCutoffLength = 125;

    Assert(roofCutoffLength > 0, "roofCutoffLength must be positive: " + roofCutoffLength);

    def alpha1 = (Cos(Sqrt(2) * Double.Pi / roofCutoffLength) + Sin (Sqrt(2) * Double.Pi / roofCutoffLength) - 1) / Cos(Sqrt(2) * Double.Pi / roofCutoffLength);
    def highpass = if IsNaN(price + price[1] + price[2]) then 0 else Sqr(1 - alpha1 / 2) * (price - 2 * price[1] + price[2]) + 2 * (1 - alpha1) * GetValue(highpass, 1) - Sqr(1 - alpha1) * GetValue(highpass, 2);

    plot HighpassFilter = highpass;
}

script EhlersSimpleDecycler {
    input price = close;
    input roofCutoffLength = 125;
    input pctAbove = 0.5;
    input pctBelow = 0.5;

    plot Decycler = close - reference EhlersHighpassFilter(price = price, "roof cutoff length" = roofCutoffLength);
    plot UpperBand = Decycler * (1 + pctAbove / 100);
    plot LowerBand = Decycler * (1 - pctBelow / 100);
}

declare lower;
declare real_size;

input price = close;
input roofCutoffLength = 125;
input k = 1.0;

input roofCutoffLength2 = 100;
input k2 = 1.2;

def decycler = reference EhlersSimpleDecycler(price = price, "roof cutoff length" = roofCutoffLength);

plot DecyclerOsc = 100 * k * reference EhlersHighpassFilter(price = decycler, "roof cutoff length" = 0.5 * roofCutoffLength) / price;
plot ZeroLine = 0;

def decycler2 = reference EhlersSimpleDecycler(price = price, "roof cutoff length" = roofCutoffLength2);

plot SignalOsc = 100 * k2 * reference EhlersHighpassFilter(price = decycler2, "roof cutoff length" = 0.5 * roofCutoffLength2) / price;

DecyclerOsc.SetDefaultColor(GetColor(5));
SignalOsc.SetDefaultColor(Color.YELLOW);
ZeroLine.SetDefaultColor(GetColor(7));

