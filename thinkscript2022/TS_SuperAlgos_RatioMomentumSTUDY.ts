declare lower;

input FastLength = 13;
input SlowLength = 48;

plot one = 1;
one.SetDefaultColor(Color.LIGHT_GRAY);

def fastRsi = RSI(
        length = FastLength, 
        price = close,
        "average type" = AverageType.Wilders)
    .RSI;

def slowRsi = RSI(
        length = SlowLength, 
        price = close,
        "average type" = AverageType.Wilders)
    .RSI;

plot Ratio = fastRsi / slowRsi;
Ratio.SetStyle(Curve.FIRM);
Ratio.SetPaintingStrategy(PaintingStrategy.LINE);
Ratio.SetDefaultColor(Color.DOWNTICK);
