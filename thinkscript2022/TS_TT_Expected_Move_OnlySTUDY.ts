declare upper;
#declare hide_on_intraday;
declare once_per_bar;
###Need to determine offset from aggregation period for daily
### and pull data from GetValue()

#def agg = GetAggregationPeriod();
#def err_label = if agg == AggregationPeriod.DAY then no 
#else yes;

#AddLabel(err_label, "Expected Move Study - Works with daily aggregation only.", Color.RED);

input em_skew_percent = 70; 
input em_bandwidth = 100; 
input show_current_week_only = yes;

def currentweek = GetYear() >= GetLastYear() and GetWeek() >= GetLastWeek();

def ivGapHi; 
def expmove; 
def high_bar; 
def low_bar; 
def em_close; 

############ logic to check for holidays ######### 
# 
# Change EM calculation on Monday (Day #1) or when last trading day 
# was a Friday (Day #5) and the current day is Tuesday (Day #2). 
# 
# Continue assumption that EM is being calculated on a Saturday. 6 days 
# to expire. 
# 
#
if GetDayOfWeek(GetYYYYMMDD()) == 1 or (getdayofweek(getYYYYMMDD()[1]) == 5 and getdayofweek(getyyyymmdd()) == 2) 
then {
    ivGapHi = imp_volatility(period = AggregationPeriod.DAY)[1];
    expmove = close(period = AggregationPeriod.DAY)[1]*ivGapHi*Sqrt(6)/Sqrt(365)*
              em_skew_percent/100*em_bandwidth/100;
    high_bar = close(period = AggregationPeriod.DAY)[1] + expmove; 
    low_bar = close(period = AggregationPeriod.DAY)[1] - expmove; 
    em_close = close(period = AggregationPeriod.DAY)[1]; 
} 
else { 
    #ivGapHi = imp_volatility(period = AggregationPeriod.DAY)[2]; 
    #expmove = close(period = AggregationPeriod.DAY)[2]*imp_volatility(period = AggregationPeriod.DAY)[2]*Sqrt(6)/Sqrt(365)*em_skew_percent/100*em_bandwidth/100; 
    #high_bar = close(period = AggregationPeriod.DAY)[2] + expmove; 
    #low_bar = close(period = AggregationPeriod.DAY)[2] - expmove; 
    #em_close = close(period = AggregationPeriod.DAY)[2]; 

    ivGapHi = ivGapHi[1]; 
    expmove = expmove[1]; 
    high_bar = high_bar[1]; 
    low_bar = low_bar[1]; 
    em_close = em_close[1]; 
}

def _emHigh = if high_bar < 1 then Double.NaN else high_bar;
plot EmHigh = if !show_current_week_only then _emHigh
               else (if currentweek then _emHigh else Double.NaN);
EmHigh.SetDefaultColor(GetColor(6)); 
EmHigh.SetPaintingStrategy(PaintingStrategy.DASHES); 
EmHigh.SetLineWeight(1);

def _emLow = if low_bar < 1 then Double.NaN else low_bar;
plot EmLow = if !show_current_week_only then _emLow
               else (if currentweek then _emLow else Double.NaN);

EmLow.SetDefaultColor(GetColor(5)); 
EmLow.SetPaintingStrategy(PaintingStrategy.DASHES); 
EmLow.SetLineWeight(1);

def _emZero = if em_close < 1 then Double.Nan else em_close;
plot EmZero = if !show_current_week_only then _emZero
               else (if currentweek then _emZero else Double.NaN);

EmZero.SetDefaultColor(GetColor(9)); 
EmZero.SetPaintingStrategy(PaintingStrategy.DASHES); 
EmZero.SetLineWeight(1);

