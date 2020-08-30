declare lower;

input aggregationPeriod = AggregationPeriod.DAY;
input averageType = {default Simple, SMA, EMA, VarMA};
input offset = 0;

#################################
#keltner bands
def factor = 1.5;
def length = 20;
def shift = factor * Average(TrueRange(high(period = aggregationPeriod),  close(period = aggregationPeriod),  low(period = aggregationPeriod)),  length);
def averageKelt = MovingAverage(averageType, close(period = aggregationPeriod), length);
def UpperBandKelt = averageKelt + shift;
def LowerBandKelt = averageKelt - shift;

###################################
#bol bands
def Num_Dev_DnBB = -2.0;
def Num_Dev_upBB = 2.0;
def sDevBB = StDev(data = close(period = aggregationPeriod), length = length);
def MidLineBol = MovingAverage(averageType, data = close(period = aggregationPeriod), length = length);
def LowerBandBol = MidLineBol + Num_Dev_DnBB * sDevBB;
def UpperBandBol = MidLineBol + Num_Dev_upBB * sDevBB;

rec squeezeRef = (if (UpperBandBol between LowerBandKelt and UpperBandKelt) and (LowerBandBol between LowerBandKelt and UpperBandKelt) then 1 + squeezeRef[1] else 0);

plot squeezeCnt = squeezeRef[offset];
squeezeCnt.SetPaintingStrategy(PaintingStrategy.POINTS);