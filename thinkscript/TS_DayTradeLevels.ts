declare upper;
declare hide_on_daily;

#AddLabel(1, GetAggregationPeriod(), Color.GRAY);

def Today = if GetDay() == GetLastDay() then 1 else 0;
def futuresPreMkt = ((GetDay() == (GetLastDay() -1)) && secondsFromTime(1700) > 0)
    OR (GetDay() == GetLastDay() && secondsTillTime(0930) > 0);
def futuresTodayOnly = ((GetDay() == (GetLastDay() -1)) && secondsFromTime(1700) > 0)
    OR (GetDay() == GetLastDay() && secondsTillTime(1615) > 0);
def regularSession = secondsFromTime(0930) > 0 && secondsTillTime(1600) > 0;

def preMktPrdL = if futuresPreMkt && isNaN(preMktPrdL[1]) then low
             else if futuresPreMkt && low < preMktPrdL[1] then low
             else CompoundValue(1, preMktPrdL[1], Double.NaN);
#plot PreMktLow = if ShowTodayOnly and !Today then Double.NaN else preMktPrdL;
plot PreMktLow = if futuresTodayOnly then preMktPrdL else Double.NaN;
PreMktLow.SetDefaultColor(Color.PINK);
PreMktLow.SetStyle(Curve.SHORT_DASH);

def preMktPrdH = if futuresPreMkt && isNaN(preMktPrdH[1]) then high
             else if futuresPreMkt && high > preMktPrdH[1] then high
             else CompoundValue(1, preMktPrdH[1], Double.NaN);
#plot PreMktHigh = if ShowTodayOnly and !Today then Double.NaN else preMktPrdH;
plot PreMktHigh = if futuresTodayOnly then preMktPrdH else Double.NaN;
PreMktHigh.SetDefaultColor(Color.LIGHT_GREEN);
PreMktHigh.SetStyle(Curve.SHORT_DASH);

def regMktOpen = GetDay() == GetLastDay() && secondsFromTime(0930) <= 1 && secondsFromTime(0930) >= 0;
def openPrice = if regMktOpen && isNaN(openPrice[1]) then open
                else CompoundValue(1, openPrice[1], Double.NaN);
plot todaysOpen = openPrice;
todaysOpen.SetStyle(Curve.SHORT_DASH);
todaysOpen.SetDefaultColor(Color.WHITE);
#AddLabel(1, "Open "+ openPrice, Color.GRAY);

def yHigh = if GetDay() != GetLastDay() && secondsFromTime(0930) <= 1 && secondsFromTime(0930) >= 0 
                    then high
                 else if GetDay() != GetLastDay() && secondsFromTime(0930) > 1 
                    && secondsTillTime(1600) > 0 && high > yHigh[1] 
                    then high
                 else CompoundValue(1, yHigh[1], high);
#AddLabel(1, "yHigh: "+ yHigh, Color.Gray);

def yLow = if GetDay() != GetLastDay() && secondsFromTime(0930) <= 1 && secondsFromTime(0930) >= 0 
                    then low
                 else if GetDay() != GetLastDay() && secondsFromTime(0930) > 1 
                    && secondsTillTime(1600) > 0 && low < yLow[1] 
                    then low
                 else CompoundValue(1, yLow[1], low);
#AddLabel(1, "yLow: "+ yLow, Color.Gray);

def yCloseTick = if GetDay() != GetLastDay() && secondsFromTime(1600) <= 1 && secondsFromTime(1600) >= 0 
                    then open
                 else CompoundValue(1, yCloseTick[1], close);
def yCloseTime = if !futuresTodayOnly then Double.NaN else close(period=AggregationPeriod.DAY)[1];
#AddLabel(1, "yClose: "+ yClose, Color.Gray);

plot PrevDayHigh = if openPrice > yHigh then yHigh else Double.NaN; 
PrevDayHigh.SetStyle(Curve.SHORT_DASH);
PrevDayHigh.SetDefaultColor(Color.UPTICK);

plot PrevDayLow = if openPrice < yLow then yLow else Double.NaN;
PrevDayLow.SetStyle(Curve.SHORT_DASH);
PrevDayLow.SetDefaultColor(Color.DOWNTICK);

plot PrevDayClose = if GetDay() == GetLastDay() && GetAggregationPeriod() < 60000 then yCloseTime 
                    else if GetDay() == GetLastDay() && GetAggregationPeriod() >= 60000 then yCloseTime 
                    else Double.NaN;
PrevDayClose.SetStyle(Curve.SHORT_DASH);
PrevDayClose.SetDefaultColor(Color.CYAN);
#AddLabel(1, "PrevDayClose: "+ PrevDayClose, Color.Gray);

def gapFillL = if regularSession[-1] && isNaN(gapFillL[1]) then Max(openPrice, high)
               else if openPrice < yLow then Max(Max(openPrice, high), gapFillL[1])
               else CompoundValue(1, gapFillL[1], Double.NaN);
def gapFillLow = if gapFillL < PrevDayLow then gapFillL else Double.NaN;
#gapFillLow.SetDefaultColor(Color.CYAN);
AddCloud(PrevDayLow, gapFillLow, Color.LIGHT_GRAY, Color.LIGHT_GRAY);

def gapFillH = if regularSession[-1] && isNaN(gapFillH[1]) then Min(openPrice, low)
               else if openPrice > yHigh then Min(Min(openPrice, low), gapFillH[1])
               else CompoundValue(1, gapFillH[1], Double.NaN);
plot gapFillHigh = if gapFillH > PrevDayHigh then gapFillH else Double.NaN;
#gapFillHigh.SetDefaultColor(Color.CYAN);
AddCloud(gapFillHigh, PrevDayHigh, Color.LIGHT_GRAY, Color.LIGHT_GRAY);
