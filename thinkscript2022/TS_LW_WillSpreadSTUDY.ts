declare lower;

input Stocks = "/ES";
input Bonds = "/ZB";
input BondOffset = 4;

def base = GetValue(close(Stocks), 0, 0)/GetValue(close(Bonds), BondOffset, BondOffset);
def shortMa = MovingAverage(AverageType.SIMPLE, base, 3);
def longMa = MovingAverage(AverageType.SIMPLE, base, 15);

plot Spread = shortMa - longMa;
Spread.SetDefaultColor(GetColor(2));

plot Zero = 0;
Zero.SetDefaultColor(GetColor(3));

def weekdayNum = GetDayOfWeek(GetYYYYMMDD());

AddVerticalLine(
    secondsTillTime(0930) == 0, 
    if weekdayNum == 1 then "M"
    else if weekdayNum == 2 then "T"
    else if weekdayNum == 3 then "W"
    else if weekdayNum == 4 then "TH"
    else "F", 
    Color.yellow, 
    Curve.SHORT_DASH);
