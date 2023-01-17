declare upper;
declare hide_on_daily;

DefineGlobalColor("Day", Color.YELLOW);
DefineGlobalColor("Mid", Color.WHITE);
DefineGlobalColor("HIGH", Color.UPTICK);
DefineGlobalColor("LOW", Color.DOWNTICK);

input ShowMidDay = yes;
input ShowHigh = yes;
input ShowLow = yes;

def hideChart;

if GetAggregationPeriod() < AggregationPeriod.FOUR_HOURS {
    hideChart = no;
} else {
    hideChart = yes;
}

def weekdayNum = GetDayOfWeek(GetYYYYMMDD());

AddVerticalLine(
    secondsTillTime(0930) == 0 && hideChart == no, 
    if weekdayNum == 1 then "M"
    else if weekdayNum == 2 then "T"
    else if weekdayNum == 3 then "W"
    else if weekdayNum == 4 then "TH"
    else "F", 
    GlobalColor("Day"), 
    Curve.SHORT_DASH);

AddVerticalLine(
    secondsTillTime(1230) == 0 && ShowMidDay,
    "MID",
    GlobalColor("Mid"),
    Curve.SHORT_DASH);

def todayHigh = GetValue(high(period = AggregationPeriod.DAY), 0, 0);

AddVerticalLine(
    secondsFromTime(1230) > 0 && secondsTillTime(1600) > 0 
    && High == TodayHigh && ShowHigh,
    "H",
    GlobalColor("High"),
    Curve.SHORT_DASH);

def todayLow = GetValue(low(period = AggregationPeriod.DAY), 0, 0);

AddVerticalLine(
    secondsFromTime(1230) > 0 && secondsTillTime(1600) > 0 
    && Low == TodayLow && ShowLow,
    "L",
    GlobalColor("Low"),
    Curve.SHORT_DASH);
