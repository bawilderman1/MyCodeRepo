declare lower;

input anchorDate = 20190701;
#input anchorTime = 930;
input BarsGoBack = 120;
input devStop = {default One, Two, Three, Zero, NegOne, NegTwo, NegThree};
input devStop2 = {One, default Two, Three, Zero, NegOne, NegTwo, NegThree};
input ShowStopLabel = yes;

def postAnchorDate = GetYYYYMMDD() >= anchorDate;
#def postAnchorTime = SecondsFromTime(anchorTime) >= 0;

def chosenDev;
switch(devStop) {
    case One: chosenDev = 1;
    case Two: chosenDev = 2;
    case Three: chosenDev = 3;
    case Zero: chosenDev = 0;
    case NegOne: chosenDev = -1;
    case NegTwo: chosenDev = -2;
    case NegThree: chosenDev = -3;
}

def chosenDev2;
switch(devStop2) {
    case One: chosenDev2 = 1;
    case Two: chosenDev2 = 2;
    case Three: chosenDev2 = 3;
    case Zero: chosenDev2 = 0;
    case NegOne: chosenDev2 = -1;
    case NegTwo: chosenDev2 = -2;
    case NegThree: chosenDev2 = -3;
}

def yyyyMmDd = getYyYYMMDD();
def periodIndex = if getAggregationPeriod() < AggregationPeriod.HOUR then yyyyMmDd else postAnchorDate;
def isPeriodRolled = CompoundValue(1, periodIndex != periodIndex[1], yes);

def volumeSum;
def volumeVwapSum;
def volumeVwap2Sum;

if (isPeriodRolled) {
    volumeSum = volume;
    volumeVwapSum = volume * vwap;
    volumeVwap2Sum = volume * Sqr(vwap);
} else {
    volumeSum = CompoundValue(1, volumeSum[1] + volume, volume);
    volumeVwapSum = CompoundValue(1, volumeVwapSum[1] + (volume * vwap), volume * vwap);
    volumeVwap2Sum = CompoundValue(1, volumeVwap2Sum[1] + (volume * Sqr(vwap)), volume * Sqr(vwap));    
}

def price = volumeVwapSum / volumeSum;
def deviation = Sqrt(Max(volumeVwap2Sum / volumeSum - Sqr(price), 0));

def vBase = ((price - close) * (-1)) / deviation;
plot VScore = if vBase > 5 or vBase < -5 then 0 else vBase;
VScore.SetDefaultColor(Color.YELLOW);
VScore.SetLineWeight(2);

plot zero = 0;
zero.SetDefaultColor(Color.WHITE);

plot one = 1;
one.SetDefaultColor(Color.GREEN);

plot two = 2;
two.SetDefaultColor(Color.GREEN);

plot three = 3;
three.SetDefaultColor(Color.GREEN);

plot negOne = -1;
negOne.SetDefaultColor(Color.RED);

plot negTwo = -2;
negTwo.SetDefaultColor(Color.RED);

plot negThree = -3;
negThree.SetDefaultColor(Color.RED);

plot posInt = 0.3;
posInt.SetStyle(Curve.MEDIUM_DASH);
posInt.SetDefaultColor(Color.VIOLET);

plot negInt = -0.3;
negInt.SetStyle(Curve.MEDIUM_DASH);
negInt.SetDefaultColor(Color.VIOLET);

def stopPrice = (chosenDev * deviation) + price;
def stopPrice2 = (chosenDev2 * deviation) + price;

AddLabel(ShowStopLabel, chosenDev+"SD: "+AsPrice(Round(stopPrice,2)), Color.GRAY);
AddLabel(ShowStopLabel, chosenDev2+"SD: "+AsPrice(Round(stopPrice2,2)), Color.GRAY);

def zeroAndOne = VScore > zero && VScore <= one;
def oneAndTwo = VScore > one && VScore <= two;
def twoAndThree = VScore > two && VScore <= three;

def zeroAndNegOne = VScore > negOne && VScore <= zero;
def negOneAndNegTwo = VScore > negTwo && VScore <= negOne;
def negTwoAndNegThree = VScore > negThree && VScore <= negTwo;

def cloud1;
def cloud2;
if  Sum(zeroAndOne, BarsGoBack) > Sum(oneAndTwo, BarsGoBack) && 
    Sum(zeroAndOne, BarsGoBack) > Sum(twoAndThree, BarsGoBack) && 
    Sum(zeroAndOne, BarsGoBack) > Sum(zeroAndNegOne, BarsGoBack) && 
    Sum(zeroAndOne, BarsGoBack) > Sum(negOneAndNegTwo, BarsGoBack) && 
    Sum(zeroAndOne, BarsGoBack) > Sum(negTwoAndNegThree, BarsGoBack) { 
    cloud1 = zero; 
    cloud2 = one; 
} else if Sum(oneAndTwo, BarsGoBack) > Sum(zeroAndOne, BarsGoBack) && 
    Sum(oneAndTwo, BarsGoBack) > Sum(twoAndThree, BarsGoBack) && 
    Sum(oneAndTwo, BarsGoBack) > Sum(zeroAndNegOne, BarsGoBack) && 
    Sum(oneAndTwo, BarsGoBack) > Sum(negOneAndNegTwo, BarsGoBack) && 
    Sum(oneAndTwo, BarsGoBack) > Sum(negTwoAndNegThree, BarsGoBack) { 
    cloud1 = one; 
    cloud2 = two; 
} else if Sum(twoAndThree, BarsGoBack) > Sum(zeroAndOne, BarsGoBack) && 
    Sum(twoAndThree, BarsGoBack) > Sum(oneAndTwo, BarsGoBack) && 
    Sum(twoAndThree, BarsGoBack) > Sum(zeroAndNegOne, BarsGoBack) && 
    Sum(twoAndThree, BarsGoBack) > Sum(negOneAndNegTwo, BarsGoBack) && 
    Sum(twoAndThree, BarsGoBack) > Sum(negTwoAndNegThree, BarsGoBack) { 
    cloud1 = two; 
    cloud2 = three; 
} else if Sum(zeroAndNegOne, BarsGoBack) > Sum(zeroAndOne, BarsGoBack) && 
    Sum(zeroAndNegOne, BarsGoBack) > Sum(oneAndTwo, BarsGoBack) && 
    Sum(zeroAndNegOne, BarsGoBack) > Sum(twoAndThree, BarsGoBack) && 
    Sum(zeroAndNegOne, BarsGoBack) > Sum(negOneAndNegTwo, BarsGoBack) && 
    Sum(zeroAndNegOne, BarsGoBack) > Sum(negTwoAndNegThree, BarsGoBack) { 
    cloud1 = zero; 
    cloud2 = negOne; 
} else if Sum(negOneAndNegTwo, BarsGoBack) > Sum(zeroAndOne, BarsGoBack) && 
    Sum(negOneAndNegTwo, BarsGoBack) > Sum(oneAndTwo, BarsGoBack) && 
    Sum(negOneAndNegTwo, BarsGoBack) > Sum(twoAndThree, BarsGoBack) && 
    Sum(negOneAndNegTwo, BarsGoBack) > Sum(zeroAndNegOne, BarsGoBack) && 
    Sum(negOneAndNegTwo, BarsGoBack) > Sum(negTwoAndNegThree, BarsGoBack) { 
    cloud1 = negOne; 
    cloud2 = negTwo; 
} else if Sum(negTwoAndNegThree, BarsGoBack) > Sum(zeroAndOne, BarsGoBack) && 
    Sum(negTwoAndNegThree, BarsGoBack) > Sum(oneAndTwo, BarsGoBack) && 
    Sum(negTwoAndNegThree, BarsGoBack) > Sum(twoAndThree, BarsGoBack) && 
    Sum(negTwoAndNegThree, BarsGoBack) > Sum(zeroAndNegOne, BarsGoBack) && 
    Sum(negTwoAndNegThree, BarsGoBack) > Sum(negOneAndNegTwo, BarsGoBack) { 
    cloud1 = negTwo; 
    cloud2 = negThree; 
} else {
    cloud1 = Double.NaN; 
    cloud2 = Double.NaN;
}

AddCloud(cloud1, cloud2, Color.LIGHT_RED, Color.LIGHT_GREEN);

def _cci = CCI();

plot BullSignal = if (cloud1 == one or cloud2 == one or cloud1 == two or cloud2 == two or cloud1 == three or cloud2 == three) && 
    (VScore <= 0.3 && VScore[1] > 0) && 
    _cci > -100  then -2 
  else Double.NaN;
BullSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
BullSignal.SetDefaultColor(Color.CYAN);

plot BearSignal = if (cloud1 == negOne or cloud2 == negOne or cloud1 == negTwo or cloud2 == negTwo or cloud1 == negThree or cloud2 == negThree) && 
    (VScore >= -0.3 && VScore[1] < 0) && 
    _cci < 100  then 2 
  else Double.NaN;
BearSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
BearSignal.SetDefaultColor(Color.PINK); 