declare lower;

input rsiLength = 14;
input netLength = 14;

plot MyRSI = Sum(close - close[1], rsiLength) / Sum(AbsValue(close - close[1]), rsiLength);

def num = fold i = 1 to netLength with s do s - ( fold j = 0 to i with s2 do s2 + Sign(GetValue(MyRSI, i) - GetValue(MyRSI, j)) );
def den = 0.5 * netLength * (netLength - 1);

plot NET = num / den;
plot ZeroLine = 0;

MyRSI.SetDefaultColor(GetColor(2));
NET.SetDefaultColor(GetColor(1));
ZeroLine.SetDefaultColor(GetColor(7));

