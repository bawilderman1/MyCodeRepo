script EhlersHighpassFilter {
    input price = close;
    input roofCutoffLength = 125;

    Assert(roofCutoffLength > 0, "roofCutoffLength must be positive: " + roofCutoffLength);

    def alpha1 = (Cos(Sqrt(2) * Double.Pi / roofCutoffLength) + Sin (Sqrt(2) * Double.Pi / roofCutoffLength) - 1) / Cos(Sqrt(2) * Double.Pi / roofCutoffLength);
    def highpass = if IsNaN(price + price[1] + price[2]) then 0 else Sqr(1 - alpha1 / 2) * (price - 2 * price[1] + price[2]) + 2 * (1 - alpha1) * GetValue(highpass, 1) - Sqr(1 - alpha1) * GetValue(highpass, 2);

    plot HighpassFilter = highpass;
}

input price = close;
input roofCutoffLength = 125;
input ShowWings = yes;
input WingMult = 3;

plot Decycler = close - reference EhlersHighpassFilter(price = price, "roof cutoff length" = roofCutoffLength);

def range = Median(high - low, roofCutoffLength);

plot UpperBand = Decycler + range;
plot LowerBand = Decycler - range;

Decycler.SetDefaultColor(GetColor(4));
Decycler.SetStyle(Curve.LONG_DASH);
UpperBand.SetDefaultColor(GetColor(4));
LowerBand.SetDefaultColor(GetColor(4));

plot LowerWing = if ShowWings then Decycler - (WingMult * range) else Double.NaN;
plot UpperWing = if ShowWings then Decycler + (WingMult * range) else Double.NaN;

LowerWing.SetStyle(Curve.SHORT_DASH);
LowerWing.SetDefaultColor(GetColor(4));
UpperWing.SetStyle(Curve.SHORT_DASH);
UpperWing.SetDefaultColor(GetColor(4));
