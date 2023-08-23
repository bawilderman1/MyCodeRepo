declare upper;
declare hide_on_intraday;

DefineGlobalColor("mediumBlue", CreateColor(116,189,232));

def firstDayOfMonth = (GetYear() * 10000) + (GetMonth() * 100) + 1;
def firstDayNextMonth = 
     ((if GetMonth() == 12 then GetYear() +1 else GetYear())*10000)
    +((if GetMonth() == 12 then 1 else GetMonth() + 1)*100)
    +1;
def weekCounter;
def monthNumber;
if (
    (DaysTillDate(firstDayNextMonth) < 5 AND GetMonth() == GetMonth()[1]) 
     OR (GetMonth() <> GetMonth()[1] AND weekCounter[1] <> 1)
   ) {
    weekCounter = 1;
    monthNumber = if GetDayOfMonth(GetYYYYMMDD()) > 7 
        then if GetMonth() == 12 
            then 1 
            else GetMonth() + 1 
        else GetMonth();
} else {
    weekCounter = weekCounter[1] + 1;
    monthNumber = monthNumber[1];
}
def dayOfMonth = CountTradingDays(firstDayOfMonth, GetYYYYMMDD());
def weekNumber = GetWeek();

def weekCounterOffset = GetValue(weekCounter, weekCounter);
def lastLow = fold n = weekCounter to weekCounter + weekCounterOffset
        with s = Double.POSITIVE_INFINITY 
        do Min(s, GetValue(low, n));
plot L = lastLow;
L.SetDefaultColor(Color.DOWNTICK);
L.SetPaintingStrategy(PaintingStrategy.DASHES);

def lastHigh = fold m = weekCounter to weekCounter + weekCounterOffset
        with r = Double.NEGATIVE_INFINITY
        do Max(r, GetValue(high, m));
plot H = lastHigh;
H.SetDefaultColor(Color.UPTICK);
H.SetPaintingStrategy(PaintingStrategy.DASHES);

plot C = GetValue(close, weekCounter);
C.SetDefaultColor(CreateColor(153, 204, 255));
C.SetPaintingStrategy(PaintingStrategy.DASHES);
