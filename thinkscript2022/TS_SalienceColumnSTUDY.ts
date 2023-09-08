script GeomMvgAvg {
  input Price = close;
  input Length = 10;
  input Displace = 0;

  def base = Power(
    fold n = 0 to Length
      with s = 1
      do s * Log(GetValue(Price, n - Displace)),
    1 / Length);

    plot Value = Exp(base);
}

declare lower;

# Use with Monthly Aggregation
input Price = close;
input FastLength = 6;
input SlowLength = 12;
input SlopeLength = 1;

def fastGMA = GeomMvgAvg(Price, FastLength);
def slowGMA = GeomMvgAvg(Price, SlowLength);

def ratio = fastGMA / slowGMA;
plot Slope = (ratio - GetValue(ratio, SlopeLength)) / SlopeLength;
