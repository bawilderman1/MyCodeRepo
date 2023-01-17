declare upper;
declare hide_on_intraday;

DefineGlobalColor("WeekDivider", Color.YELLOW);

def hideChart;

if GetAggregationPeriod() == AggregationPeriod.DAY {
    hideChart = no;
} else {
    hideChart = yes;
}

#def dayOfMonth = GetDayOfMonth(GetYYYYMMDD());
def firstDayOfMonth = (GetYear()*10000)+(GetMonth()*100)+1;
def dayOfMonth = CountTradingDays(firstDayOfMonth, GetYYYYMMDD());
def weekNumber = GetWeek();

AddVerticalLine(
    weekNumber <> weekNumber[1] && hideChart == no, 
    dayOfMonth, 
    GlobalColor("WeekDivider"), 
    Curve.SHORT_DASH);
