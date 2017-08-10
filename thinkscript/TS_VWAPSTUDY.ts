#
# TD Ameritrade IP Company, Inc. (c) 2011-2016
#

input numDevDn = -2.0;
input numDevUp = 2.0;
input timeFrame = {default DAY, WEEK, MONTH};
input numAtrs = 2;
input atrLength = {default "14", "21"};
input averageType = AverageType.WILDERS;
def length;

switch (atrLength) {
case "14":
    length = 14;
case "21":
    length = 21;
};

def ATR = MovingAverage(averageType, TrueRange(high, close, low), length);

def cap = getAggregationPeriod();
def errorInAggregation =
    timeFrame == timeFrame.DAY and cap >= AggregationPeriod.WEEK or
    timeFrame == timeFrame.WEEK and cap >= AggregationPeriod.MONTH;
assert(!errorInAggregation, "timeFrame should be not less than current chart aggregation period");

def yyyyMmDd = getYyyyMmDd();
def periodIndx;
switch (timeFrame) {
case DAY:
    periodIndx = yyyyMmDd;
case WEEK:
    periodIndx = Floor((daysFromDate(first(yyyyMmDd)) + getDayOfWeek(first(yyyyMmDd))) / 7);
case MONTH:
    periodIndx = roundDown(yyyyMmDd / 100, 0);
}
def isPeriodRolled = compoundValue(1, periodIndx != periodIndx[1], yes);

def volumeSum;
def volumeVwapSum;
def volumeVwap2Sum;

if (isPeriodRolled) {
    volumeSum = volume;
    volumeVwapSum = volume * vwap;
    volumeVwap2Sum = volume * Sqr(vwap);
} else {
    volumeSum = compoundValue(1, volumeSum[1] + volume, volume);
    volumeVwapSum = compoundValue(1, volumeVwapSum[1] + volume * vwap, volume * vwap);
    volumeVwap2Sum = compoundValue(1, volumeVwap2Sum[1] + volume * Sqr(vwap), volume * Sqr(vwap));
}
def price = volumeVwapSum / volumeSum;
def deviation = Sqrt(Max(volumeVwap2Sum / volumeSum - Sqr(price), 0));

plot VWAP = price;
def UB = price + numDevUp * deviation;
rec UpperB = if crosses(close, (UB - (ATR*numATRs)), crossingdirection.ABOVE)
                     and high > price 
                then UB 
             else if crosses(close, (UB - (ATR*(numATRs+1))), crossingdirection.BELOW)
                     and high < price
                then double.nan 
             else if !crosses(close, (UB - (ATR*numATRs)), crossingdirection.ABOVE) 
                     and !crosses(close, (UB - (ATR*(numATRs+1))), crossingdirection.BELOW)
                     and high > price 
                     and !isNaN(UpperB[1])
                then UB
             else 
                double.nan;

plot UpperBand = UpperB;
def LB = price + numDevDn * deviation;
rec LowerB = if crosses(close, (LB + (ATR*numATRs)), crossingdirection.BELOW) 
                     and low < price 
                then LB 
             else if crosses(close, (LB + (ATR*(numATRs+1))), crossingdirection.ABOVE) 
                     and low > price
                then double.nan 
             else if !crosses(close, (LB + (ATR*numATRs)), crossingdirection.BELOW) 
                     and !crosses(close, (LB + (ATR*(numATRs+1))), crossingdirection.ABOVE)
                     and low < price
                     and !isNaN(LowerB[1])
                then LB
             else 
                double.nan;

######################################################
#def UB = price + numDevUp * deviation;
#rec UpperB = if crosses(close, price, crossingdirection.ABOVE) 
#                then UB 
#             else if crosses(close, price - (4*ticksize()), crossingdirection.BELOW) 
#                then double.nan 
#             else if !crosses(close, price, crossingdirection.ABOVE) 
#                     and !crosses(close, price - (4*ticksize()), crossingdirection.BELOW)
#                     and !isNaN(UpperB[1])
#                then UB
#             else 
#                double.nan;

#plot UpperBand = UpperB;
#def LB = price + numDevDn * deviation;
#rec LowerB = if crosses(close, price, crossingdirection.BELOW) 
#                then LB 
#             else if crosses(close, price + (4*ticksize()), crossingdirection.ABOVE) 
#                then double.nan 
#             else if !crosses(close, price, crossingdirection.BELOW) 
#                     and !crosses(close, price + (4*ticksize()), crossingdirection.ABOVE)
#                     and !isNaN(LowerB[1])
#                then LB
#             else 
#                double.nan;

plot LowerBand = LowerB;

VWAP.setDefaultColor(color.plum);
UpperBand.setDefaultColor(color.dark_orange);
LowerBand.setDefaultColor(color.dark_orange);