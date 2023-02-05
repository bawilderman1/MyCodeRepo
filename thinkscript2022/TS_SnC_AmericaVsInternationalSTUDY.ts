declare lower;

def us = Lg(hl2(Symbol = "SPY"));
def internatl = Lg(hl2(Symbol = "EFA"));

def RelStr = Round(us/internatl, 3);
plot SmRelStr = Round(MovAvgTriangular(us/internatl, 3), 3);
#plot MA = Round(EhlersSuperSmootherFilter(RelStr, 20), 3);
#plot MA = Round(Median(RelStr, 20), 3);
#plot MA = Round(MovingAverage(AverageType.SIMPLE, RelStr, 20), 3);
plot MA = Round(MovAvgTriangular(RelStr, 20), 3);

#RelStr.SetDefaultColor(GetColor(2));
SmRelStr.SetDefaultColor(GetColor(2));
MA.SetDefaultColor(GetColor(7));
