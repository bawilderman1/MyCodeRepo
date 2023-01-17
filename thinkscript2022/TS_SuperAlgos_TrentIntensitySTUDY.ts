script TrendCheck {
input Length = 14;

def ema = ExpAverage(close, Length);

def up = fold i = 0 to Length 
          with u = 0
          do u + + if (GetValue(close, i, Length) > GetValue(ema, i, Length)) then 1 else 0;

def down = fold j = 0 to Length 
          with d = 0
          do d + if (GetValue(close, j, Length) < GetValue(ema, j, Length)) then 1 else 0;

plot Intensity = (up / (up + down)) * 100;
}

declare lower;

DefineGlobalColor("Fast", CreateColor(219, 62, 177));
DefineGlobalColor("Slow", CreateColor(65, 182, 230));

input FastLength = 13;
input SlowLength = 48;

plot fifty = 50;
fifty.SetDefaultColor(Color.LIGHT_GRAY);

plot FastIntensity = TrendCheck(FastLength).Intensity;
plot SlowIntensity = TrendCheck(SlowLength).Intensity;

FastIntensity.SetPaintingStrategy(PaintingStrategy.LINE);
FastIntensity.SetStyle(Curve.FIRM);
FastIntensity.SetDefaultColor(GlobalColor("Fast"));

SlowIntensity.SetPaintingStrategy(PaintingStrategy.LINE);
SlowIntensity.SetStyle(Curve.FIRM);
SlowIntensity.SetDefaultColor(GlobalColor("Slow"));
