script MeanBreakout {
    input Length = 13;

    def ema = ExpAverage(close, Length);

    #def up = fold i = 0 to Length 
    #          with u = 0
    #          do u + if (GetValue(close, i, Length) > GetValue(ema, i, Length)) then 1 else 0;

    plot Signal = ((close[0] - ema[0]) / (Highest(high, Length) - Lowest(low, Length)));
}

declare lower;

DefineGlobalColor("Fast", CreateColor(219, 62, 177));
DefineGlobalColor("Slow", CreateColor(65, 182, 230));

input FastLength = 13;
input SlowLength = 48;

plot zero = 0;
zero.SetDefaultColor(Color.LIGHT_GRAY);

plot FastSignal = MeanBreakout(FastLength).Signal;
plot SlowSignal = MeanBreakout(SlowLength).Signal;

FastSignal.SetPaintingStrategy(PaintingStrategy.LINE);
FastSignal.SetStyle(Curve.FIRM);
FastSignal.SetDefaultColor(GlobalColor("Fast"));

SlowSignal.SetPaintingStrategy(PaintingStrategy.LINE);
SlowSignal.SetStyle(Curve.FIRM);
SlowSignal.SetDefaultColor(GlobalColor("Slow"));
