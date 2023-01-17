declare upper;

input MedianLength = 5;

def day = AggregationPeriod.DAY;
def todayOpen = GetValue(open(period = day), 0, 0);
def todayClose = GetValue(close(period = day), 0, 0);
def todayHigh = GetValue(high(period = day), 0, 0);
def todayLow = GetValue(low(period = day), 0, 0);

def dayHigh = GetValue(High(period = day), 1, 1);
def dayLow = GetValue(Low(period = day), 1, 1);
def mdnRange = Median(dayHigh-dayLow, MedianLength);

def todayRange = todayHigh-todayLow;
def openPctOfRange = (todayOpen-todayLow)/(todayRange);
def closePctOfRange = (todayClose-todayLow)/(todayRange);

def upDay = close > todayOpen;
def dnDay = close < todayOpen;

def baseData = if upDay then (todayOpen-todayLow)/(mdnRange) 
    else if dnDay then 
(todayHigh-todayOpen)/(mdnRange)
    else 0;

def data = Round(baseData*100, 2);

def isTrending = 
(upDay and openPctOfRange <= 0.2 and closePctOfRange >= 0.8) 
    or
(dnDay and openPctOfRange >= 0.8 and closePctOfRange <= 0.2);

#def isTrendDay = if isTrending then Data else Double.NaN;


def threshold = 15;

AddLabel(
    data < threshold, 
    if upDay then"LW_Tail: L"
    else if dnDay then "LW_Tail: S" 
    else "LW_Tail", 
    GetColor(2));
