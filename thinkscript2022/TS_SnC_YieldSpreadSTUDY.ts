declare lower;
declare hide_on_intraday;

#input type = ChartType.BAR;

#def lowYieldOp = open("IEF");
#def lowYieldCl = close("IEF");
#def lowYieldHi = high("IEF");
#def lowYieldLo = low("IEF");
def lowYieldTp = hlc3("IEF");

#def highYieldOp = open("JNK");
#def highYieldCl = close("JNK");
#def highYieldHi = high("JNK");
#def highYieldLo = low("JNK");
def highYieldTp = hlc3("JNK");

#def op = lowYieldOp/highYieldOp;
#def cl = lowYieldCl/highYieldCl;
#def hi = lowYieldHi/highYieldHi;
#def lo = lowYieldLo/highYieldLo;
plot TypPrice = lowYieldTp/highYieldTp;

#AddChart(high = hi, low  = lo, open = op, close = cl, type = type , growColor = Color.WHITE, fallColor = Color.WHITE, neutralColor = Color.WHITE);

plot FastMa = ExpAverage(TypPrice, 5);
#plot SlowMa = ExpAverage(cl, 40);

plot TriMa = (TypPrice+
    2*CompoundValue(1, TypPrice[1], TypPrice)+
    2*CompoundValue(2, TypPrice[2], TypPrice)+
    CompoundValue(3, TypPrice[3], TypPrice))/6;
