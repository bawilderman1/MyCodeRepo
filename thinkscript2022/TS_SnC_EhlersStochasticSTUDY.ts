script EhlersSuperSmootherFilter {
    input price = close;

    def a1 = Exp(-Double.Pi * Sqrt(2) / 10);
    def coeff2 = 2 * a1 * Cos(Sqrt(2) * Double.Pi / 10);
    def coeff3 = - Sqr(a1);
    def coeff1 = 1 - coeff2 - coeff3;
    def filt = coeff1 * (price + price[1]) / 2 + coeff2 * filt[1] + coeff3 * filt[2];

    plot SuperSmootherFilter = filt;
}

script EhlersRoofingFilter {
    input price = close;

    def alpha1 = (Cos(Sqrt(2) * Double.Pi / 48) + Sin (Sqrt(2) * Double.Pi / 48) - 1) / Cos(Sqrt(2) * Double.Pi / 48);
    def highpass = Sqr(1 - alpha1 / 2) * (price - 2 * price[1] + price[2]) + 2 * (1 - alpha1) * highpass[1] - Sqr(1 - alpha1) * highpass[2];

    plot RoofingFilter = reference EhlersSuperSmootherFilter(highpass);
}

declare lower;

input price = close;
input length = 20;
input over_bought = .8;
input over_sold = .2;
input mode = {default Predictive, Conventional};

def filt = reference EhlersRoofingFilter(price);
def highestP = Highest(filt, length);
def lowestP = Lowest(filt, length);
def stoch = if (highestP - lowestP) != 0 then (filt - lowestP) / (highestP - lowestP) else 0;

plot Stochastic = reference EhlersSuperSmootherFilter(stoch);
plot OverBought = over_bought;
plot OverSold = over_sold;
plot Buy;
plot Sell;
switch (mode) {
case Predictive:
    Buy = if Stochastic crosses below OverSold then OverSold + .05 else Double.NaN;
    Sell = if Stochastic crosses above OverBought then OverBought - .05 else Double.NaN;
case Conventional:
    Buy = if Stochastic crosses above OverSold then OverSold + .05 else Double.NaN;
    Sell = if Stochastic crosses below OverBought then OverBought - .05 else Double.NaN;
}

Stochastic.SetDefaultColor(GetColor(5));
OverBought.SetDefaultColor(GetColor(7));
OverSold.SetDefaultColor(GetColor(7));
Buy.SetDefaultColor(Color.UPTICK);
Buy.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Buy.HideBubble();
Sell.SetDefaultColor(Color.DOWNTICK);
Sell.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
Sell.HideBubble();

