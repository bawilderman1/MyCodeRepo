declare upper;

input AggPeriod = AggregationPeriod.DAY;
#input Price = FundamentalType.CLOSE;
input Length = 5;
input Displace = -1;
input Step = 1;

Assert (Step >= 1, "Step must be greater then or equal to 1");

#def base = Power(
#    fold n = 0 to Length 
#        with s = 1 
#        do s * Log(GetValue(Fundamental(Price, GetSymbol(), AggPeriod), (n * Step) - Displace)), 
#    1/Length);

def base = Power(
    fold n = 0 to Length 
        with s = 1 
        do s * Log(
            (
                GetValue(Fundamental(FundamentalType.CLOSE, GetSymbol(), AggPeriod), (n * Step) - Displace) +
                GetValue(Fundamental(FundamentalType.OPEN, GetSymbol(), AggPeriod), (n * Step) - Displace)
            ) / 2
        ), 
    1/Length);

plot MA = Exp(base);
