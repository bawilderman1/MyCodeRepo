declare lower;

input price = close;
input cutoffLength = 10;
input k = .8;

def alpha1 = (Cos(Sqrt(2) * Double.Pi / 100) + Sin (Sqrt(2) * Double.Pi / 100) - 1) / Cos(Sqrt(2) * Double.Pi / 100);
def highpass = if IsNaN(price + price[1] + price[2]) then highpass[1] else Sqr(1 - alpha1 / 2) * (price - 2 * price[1] + price[2]) + 2 * (1 - alpha1) * highpass[1] - Sqr(1 - alpha1) * highpass[2];
def filt = reference EhlersSuperSmootherFilter(highpass, cutoffLength);
def peak = if AbsValue(filt) > peak[1] * .991 then AbsValue(filt) else peak[1] * .991;
plot NormRoofingFilter = filt / peak;
plot Quotient = (NormRoofingFilter + k) / (k * NormRoofingFilter + 1);
plot ZeroLine = 0;

NormRoofingFilter.SetDefaultColor(GetColor(1));
Quotient.SetDefaultColor(GetColor(2));
ZeroLine.SetDefaultColor(GetColor(7));


