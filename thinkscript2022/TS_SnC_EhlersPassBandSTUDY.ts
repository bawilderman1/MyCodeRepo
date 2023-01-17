declare lower;

input length1 = 40;
input length2 = 60;

Assert(length1 >= 3, "'length1' must be greater than or equal to 3: " + length1);
Assert(length2 > length1, "'length2' must be greater than 'length1': " + length2);

def a1 = 5 / length1;
def a2 = 5 / length2;
def PB = (a1 - a2) * close + (a2 * (1 - a1) - a1 * (1 - a2)) * close[1] + ((1 - a1) + (1 - a2)) * PB[1] - (1 - a1) * (1 - a2) * PB[2];
def RMS = Sqrt(Average(Sqr(PB), 50));

plot SuperPassbandFilter = PB;
plot "+RMS" = RMS;
plot "-RMS" = -RMS;
plot ZeroLine = 0;

SuperPassbandFilter.SetDefaultColor(GetColor(5));
"+RMS".SetDefaultColor(GetColor(4));
"-RMS".SetDefaultColor(GetColor(4));
ZeroLine.SetDefaultColor(GetColor(7));

