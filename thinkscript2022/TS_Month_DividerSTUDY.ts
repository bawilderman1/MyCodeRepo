declare upper;
declare hide_on_intraday;

DefineGlobalColor("WeekDivider", Color.YELLOW);
DefineGlobalColor("mediumBlue", CreateColor(116,189,232));

def hideChart;

if GetAggregationPeriod() == AggregationPeriod.WEEK {
    hideChart = no;
} else {
    hideChart = yes;
}

def firstDayOfMonth = (GetYear() * 10000) + (GetMonth() * 100) + 1;
def firstDayNextMonth = ((if GetMonth() == 12 then GetYear() +1 else GetYear())*10000)+((if GetMonth() == 12 then 1 else GetMonth() + 1)*100)+1;
def weekCounter;
def monthNumber;
if ((DaysTillDate(firstDayNextMonth) < 5 AND GetMonth() == GetMonth()[1]) OR (GetMonth() <> GetMonth()[1] AND weekCounter[1] <> 1)) {
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

AddVerticalLine(
    weekCounter == 1 && hideChart == no, 
    if monthNumber == 1 then "JAN"
    else if monthNumber == 2 then "FEB"
    else if monthNumber == 3 then "MAR"
    else if monthNumber == 4 then "APR"
    else if monthNumber == 5 then "MAY"
    else if monthNumber == 6 then "JUN"
    else if monthNumber == 7 then "JUL"
    else if monthNumber == 8 then "AUG"
    else if monthNumber == 9 then "SEP"
    else if monthNumber == 10 then "OCT"
    else if monthNumber == 11 then "NOV"
    else if monthNumber == 12 then "DEC"
    else "NA",
    if monthNumber == 1 then GlobalColor("mediumBlue") else GlobalColor("WeekDivider"), 
    Curve.SHORT_DASH);
