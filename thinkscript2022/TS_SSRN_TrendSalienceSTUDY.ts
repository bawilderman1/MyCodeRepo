script GeomMvgAvg {
    input Price = close;
    input Length = 10;

    def logPrice = Log(Price);
    def sumPrice = Sum(logPrice, Length);

    plot Value = Exp(sumPrice/Length);
}

declare lower;

input Price = close;
input FastLength = 6;
input SlowLength = 12;
input SlopeLength = 1;

def fastGMA = GeomMvgAvg(Price, FastLength);
def slowGMA = GeomMvgAvg(Price, SlowLength);

def ratio = fastGMA / SlowGMA;
plot Slope = Round((ratio - GetValue(ratio, SlopeLength)) / SlopeLength, 5);
