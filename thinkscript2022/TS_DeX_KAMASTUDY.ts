script F {
    input Periods =  2.0;

    plot Value = 2/(Periods+1);
}

script SmoothingConstant {
    input ERLength = 24;
    input FastPeriod = 2.0;
    input SlowPeriod = 30.0;

    plot Value = Sqr(EfficiencyRatio(length = ERLength) * (F(FastPeriod) - F(SlowPeriod)) + F(SlowPeriod));
}

declare upper;

input ERLength = 24;
input FastPeriod = 2.0;
input SlowPeriod = 30.0;
input SignalFastPeriod = 3.0;
input SignalSlowPeriod = 30.0;

def sc = SmoothingConstant(ERLength, FastPeriod, SlowPeriod);
def signalSc = SmoothingConstant(ERLength, SignalFastPeriod, SignalSlowPeriod);

def k = CompoundValue(1, k[1], close) + (sc * (close - CompoundValue(1, k[1], close)));
def signalK = CompoundValue(1, signalK[1], close) + (signalSc * (close - CompoundValue(1, signalK[1], close)));

plot KAMA = k;
plot SignalKAMA = signalK;

plot DownCross = KAMA crosses below SignalKAMA;
DownCross.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
DownCross.SetDefaultColor(Color.DOWNTICK);

plot UpCross = KAMA crosses above SignalKAMA;
UpCross.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
UpCross.SetDefaultColor(Color.UPTICK);
