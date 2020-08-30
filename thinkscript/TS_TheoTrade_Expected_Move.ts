# TheoTrade_Weely_Expected_Move 
# Copyright TheoTrade LLC
# V08.11.2017
# Free for use. Header credits must be included when any form of the code included in # this package is used. 
# 
# User assumes all risk. Author not responsible for errors or use of tool. 
# scripted by Todd Rind
# 
# Thanks to all those who have freely shared ThinkScript concepts over the Web. 
# 
# The study is used to analyze the DAILY CLOSING performance of an equity against 
# the expected move (EM) for any ticker. 
# The study works for daily aggregation only. 
# Best performance will be against ETF's due to the option and stock implied volatility 
# typically being close. When looking at equities, earnings will cause a difference 
# between volatility for options and stock. That is, option volatility may be 
# elevated as compared to the stock volatility. Since option volatility cannont 
# be accessed from ThinkScript, the script EM will be lower than the EM found 
# in the option chain. 
# 
# NEW LOGIC 
# 
# Drawing line from previous close. 
# Completed the daily calculations for inside EM. 
# Turned the "dots" for the bars exceeding EM to RED. 
# Added logic for "touches". The "dots" for touches are BLUE. 
# Touches are a calculated bandwidth around the EM bars. EX: 
# High touches occur when either the high or close is within the calculated 
# bandwith of the EM. Default is 90% of EM. 
# 
# MINOR ISSUES TO MONITOR 
# 
# Remove the bars not marked with EM levels from the % occurance calculation. 
# Fixed by making sure high & low bar > 1. 
# 
# Note sent to TOS Support about counter issues when checking day number-no response 
# from TO. It appears that occasionally a bar out of view is used as the start. 
# Seems to sometimes make Friday count one to many. 
# 
#-------------------- Header End ----------------------------

def agg = GetAggregationPeriod();

def err_label = if agg == AggregationPeriod.DAY then 
no 
else 
yes;

AddLabel(err_label, "Expected Move Study - Works with daily aggregation only.", Color.RED);

input em_skew_percent = 70; 
input em_bandwidth = 100; 
input touches_percent = 90;

input show_high_bubble = yes; 
input show_low_bubble = yes; 
input show_high_dots = yes; 
input show_low_dots = yes; 
input show_touches_high_dots=yes; 
input show_touches_low_dots=yes; 
input show_touches_daily=yes;

input show_em_calc = yes; 
input show_highlow_detail = yes; 
input show_highlow_daily = yes; 
input show_highlow_daily_inside= yes;

# 
# em_bandwith allow for narrow or wider ranges to be tested. 1.0 is normal. 
# for 0.5 Std Dev, then em_bandwidth = 0.5 Entered in % changed to decimal. 
# That is, allows for ajustment so that analysis can be made of Iron Fly expected #performance.

# 
# suggest leaving start & expire static. 
# start = 1 ==> Will pull EM data from previous bar. Assumed to be FRIDAY. CLOSING 
# then expires next Friday ==> 6 days. Assumes 
# calculating expected move on Saturday. 
# 
# 
# 
# Note - no longer allowing EM calculation days to change. 
# 
# input em_day_start = 1; 
#input em_day_expire = 6;

# 
# routine to force looking for the highest bar number 
#

def barcount = BarNumber(); 
def lastbar = HighestAll(if IsNaN(high) then 0 else barcount);

def ivGapHi; 
def expmove; 
def high_bar; 
def low_bar; 
def em_close; 
def weekcnt; 
def touch_high_bar; 
def touch_low_bar;

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

ivGapHi = imp_volatility()[1];

expmove = close[1] * ivGapHi * Sqrt(6) / Sqrt(365) * em_skew_percent / 100 * em_bandwidth / 100;

high_bar = close[1] + expmove; 
touch_high_bar = close[1] + (expmove * touches_percent/100); 
low_bar = close[1] - expmove; 
touch_low_bar = close[1] - (expmove * touches_percent/100); 
em_close = close[1]; 
weekcnt=weekcnt[1] + 1;

} 
else { 
ivGapHi = ivGapHi[1]; 
expmove = expmove[1]; 
high_bar = high_bar[1]; 
touch_high_bar = touch_high_bar[1]; 
low_bar = low_bar[1]; 
touch_low_bar= touch_low_bar[1]; 
em_close = em_close[1]; 
weekcnt = weekcnt[1];

}

# 
# calculations for over EM 
#

def peak = if high_bar > 1 and close > high_bar then 1 else 0;

def peakcnt = if peak then peakcnt[1] + 1 else peakcnt[1]; 
def peakamt = if peak then peakamt[1] + close - high_bar else peakamt[1];

#################### daily bar logic -- over EM 
# 
# Continue to monitor Friday's for count.

def fripeak = if high_bar > 1 and close > high_bar and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def fripeakcnt = if fripeak then fripeakcnt[1] + 1 else fripeakcnt[1]; 
def fripeakamt = if fripeak then fripeakamt[1] + close - high_bar else fripeakamt[1];

def thupeak = if high_bar > 1 and close > high_bar and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thupeakcnt = if thupeak then thupeakcnt[1] + 1 else thupeakcnt[1]; 
def thupeakamt = if thupeak then thupeakamt[1] + close - high_bar else thupeakamt[1];

def wenpeak = if high_bar > 1 and close > high_bar and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wenpeakcnt = if wenpeak then wenpeakcnt[1] + 1 else wenpeakcnt[1]; 
def wenpeakamt = if wenpeak then wenpeakamt[1] + close - high_bar else wenpeakamt[1];

def tuepeak = if high_bar > 1 and close > high_bar and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuepeakcnt = if tuepeak then tuepeakcnt[1] + 1 else tuepeakcnt[1]; 
def tuepeakamt = if tuepeak then tuepeakamt[1] + close - high_bar else tuepeakamt[1];

def monpeak = if high_bar > 1 and close > high_bar and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def monpeakcnt = if monpeak then monpeakcnt[1] + 1 else monpeakcnt[1]; 
def monpeakamt = if monpeak then monpeakamt[1] + close - high_bar else monpeakamt[1];

# 
# calculations for under EM 
#

def valley = if low_bar > 1 and close < low_bar then 1 else 0;

def valleycnt = if valley then valleycnt[1] + 1 else valleycnt[1]; 
def valleyamt = if valley then valleyamt[1] + low_bar - close else valleyamt[1];

#################### daily bar logic -- uner EM 
# 
# Continue to monitor Friday's for count.

def frivalley = if low_bar > 1 and close < low_bar and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def frivalleycnt = if frivalley then frivalleycnt[1] + 1 else frivalleycnt[1]; 
def frivalleyamt = if frivalley then frivalleyamt[1] + low_bar - close else frivalleyamt[1];

def thuvalley = if low_bar > 1 and close < low_bar and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thuvalleycnt = if thuvalley then thuvalleycnt[1] + 1 else thuvalleycnt[1]; 
def thuvalleyamt = if thuvalley then thuvalleyamt[1] + low_bar - close else thuvalleyamt[1];

def wenvalley = if low_bar > 1 and close < low_bar and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wenvalleycnt = if wenvalley then wenvalleycnt[1] + 1 else wenvalleycnt[1]; 
def wenvalleyamt = if wenvalley then wenvalleyamt[1] + low_bar - close else wenvalleyamt[1];

def tuevalley = if low_bar > 1 and close < low_bar and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuevalleycnt = if tuevalley then tuevalleycnt[1] + 1 else tuevalleycnt[1]; 
def tuevalleyamt = if tuevalley then tuevalleyamt[1] + low_bar - close else tuevalleyamt[1];

def monvalley = if low_bar > 1 and close < low_bar and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def monvalleycnt = if monvalley then monvalleycnt[1] + 1 else monvalleycnt[1]; 
def monvalleyamt = if monvalley then monvalleyamt[1] + low_bar - close else monvalleyamt[1];

# 
# Calc within for iron fly 
# 
#

def monpeakin = if high_bar > 1 and close < high_bar and close >= em_close and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def monpeakcntin = if monpeakin then monpeakcntin[1] + 1 else monpeakcntin[1]; 
def monpeakamtin = if monpeakin then monpeakamtin[1] + close - em_close else monpeakamtin[1];

def monvalleyin = if low_bar > 1 and close > low_bar and close < em_close and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def monvalleycntin = if monvalleyin then monvalleycntin[1] + 1 else monvalleycntin[1]; 
def monvalleyamtin = if monvalleyin then monvalleyamtin[1] + em_close - close else monvalleyamtin[1];

def tuepeakin = if high_bar > 1 and close < high_bar and close >= em_close and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuepeakcntin = if tuepeakin then tuepeakcntin[1] + 1 else tuepeakcntin[1]; 
def tuepeakamtin = if tuepeakin then tuepeakamtin[1] + close - em_close else tuepeakamtin[1];

def tuevalleyin = if low_bar > 1 and close > low_bar and close < em_close and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuevalleycntin = if tuevalleyin then tuevalleycntin[1] + 1 else tuevalleycntin[1]; 
def tuevalleyamtin = if tuevalleyin then tuevalleyamtin[1] + em_close - close else tuevalleyamtin[1];

def wenpeakin = if high_bar > 1 and close < high_bar and close >= em_close and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wenpeakcntin = if wenpeakin then wenpeakcntin[1] + 1 else wenpeakcntin[1]; 
def wenpeakamtin = if wenpeakin then wenpeakamtin[1] + close - em_close else 
wenpeakamtin[1];

def wenvalleyin = if low_bar > 1 and close > low_bar and close < em_close and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wenvalleycntin = if wenvalleyin then wenvalleycntin[1] + 1 else wenvalleycntin[1]; 
def wenvalleyamtin = if wenvalleyin then wenvalleyamtin[1] + em_close - close else wenvalleyamtin[1];

def thupeakin = if high_bar > 1 and close < high_bar and close >= em_close and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thupeakcntin = if thupeakin then thupeakcntin[1] + 1 else thupeakcntin[1]; 
def thupeakamtin = if thupeakin then thupeakamtin[1] + close - em_close else 
thupeakamtin[1];

def thuvalleyin = if low_bar > 1 and close > low_bar and close < em_close and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thuvalleycntin = if thuvalleyin then thuvalleycntin[1] + 1 else thuvalleycntin[1]; 
def thuvalleyamtin = if thuvalleyin then thuvalleyamtin[1] + em_close - close else thuvalleyamtin[1];

def fripeakin = if high_bar > 1 and close < high_bar and close >= em_close and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def fripeakcntin = if fripeakin then fripeakcntin[1] + 1 else fripeakcntin[1]; 
def fripeakamtin = if fripeakin then fripeakamtin[1] + close - em_close else fripeakamtin[1];

def frivalleyin = if low_bar > 1 and close > low_bar and close < em_close and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def frivalleycntin = if frivalleyin then frivalleycntin[1] + 1 else frivalleycntin[1]; 
def frivalleyamtin = if frivalleyin then frivalleyamtin[1] + em_close - close else frivalleyamtin[1];

# 
# touches calculations 
# 
# testing to determine if high or close was within touches% of highbar 
# or 
# if low or close was within touches% of lowbar 
#

def touchpeak = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) then 1 else 0; 
def touchpeakcnt = if touchpeak then touchpeakcnt[1] + 1 else touchpeakcnt[1];

def touchvalley = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) then 1 else 0; 
def touchvalleycnt = if touchvalley then touchvalleycnt[1] + 1 else touchvalleycnt[1];

# 
# touches detail 
#

def montouchpeakin = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def montouchpeakcntin = if montouchpeakin then montouchpeakcntin[1] + 1 else montouchpeakcntin[1];

def montouchvalleyin = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 1 then 1 else 0; 
def montouchvalleycntin = if montouchvalleyin then montouchvalleycntin[1] + 1 else montouchvalleycntin[1];

def tuetouchpeakin = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuetouchpeakcntin = if tuetouchpeakin then tuetouchpeakcntin[1] + 1 else tuetouchpeakcntin[1];

def tuetouchvalleyin = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 2 then 1 else 0; 
def tuetouchvalleycntin = if tuetouchvalleyin then tuetouchvalleycntin[1] + 1 else tuetouchvalleycntin[1];

def wentouchpeakin = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wentouchpeakcntin = if wentouchpeakin then wentouchpeakcntin[1] + 1 else wentouchpeakcntin[1];

def wentouchvalleyin = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 3 then 1 else 0; 
def wentouchvalleycntin = if wentouchvalleyin then wentouchvalleycntin[1] + 1 else wentouchvalleycntin[1];

def thutouchpeakin = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thutouchpeakcntin = if thutouchpeakin then thutouchpeakcntin[1] + 1 else thutouchpeakcntin[1];

def thutouchvalleyin = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 4 then 1 else 0; 
def thutouchvalleycntin = if thutouchvalleyin then thutouchvalleycntin[1] + 1 else thutouchvalleycntin[1];

def fritouchpeakin = if high_bar > 1 and ((high < high_bar and high >= touch_high_bar) or (close < high_bar and close >= touch_high_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def fritouchpeakcntin = if fritouchpeakin then fritouchpeakcntin[1] + 1 else fritouchpeakcntin[1];

def fritouchvalleyin = if low_bar > 1 and ((low > low_bar and low <= touch_low_bar) or (close > low_bar and close <= touch_low_bar)) and GetDayOfWeek(GetYYYYMMDD()) == 5 then 1 else 0; 
def fritouchvalleycntin = if fritouchvalleyin then fritouchvalleycntin[1] + 1 else fritouchvalleycntin[1];

plot spxhigh = if high_bar < 1 then Double.NaN else high_bar;

spxhigh.SetDefaultColor(Color.GREEN); 
spxhigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL); 
spxhigh.SetLineWeight(2);

plot spxlow = if low_bar < 1 then Double.NaN else low_bar;

spxlow.SetDefaultColor(Color.RED); 
spxlow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL); 
spxlow.SetLineWeight(2);

plot spxzero = if em_close < 1 then Double.Nan else em_close;

spxzero.setdefaultcolor(color.black); 
spxzero.setpaintingstrategy(paintingstrategy.horizontal); 
spxzero.setlineweight(2);

# 
# Mark peaks & valleys with dots 
#

plot peakArrow = if peak and show_high_dots then high else double.nan;

peakArrow.SetStyle(curve.POINTS); 
peakArrow.SetLineWeight(3); 
peakArrow.AssignValueColor(color.red);

plot valleyArrow = if valley and show_low_dots then low else double.nan; 
valleyArrow.setstyle(curve.pointS); 
valleyArrow.setlineweight(3); 
valleyarrow.assignvalueColor(color.red);

plot touchpeakArrow = if touchpeak and show_touches_high_dots then high else double.nan;

touchpeakArrow.SetStyle(curve.POINTS); 
touchpeakArrow.SetLineWeight(3); 
touchpeakArrow.AssignValueColor(color.blue);

plot touchvalleyArrow = if touchvalley and show_touches_low_dots then low else double.nan;

touchvalleyArrow.SetStyle(curve.POINTS); 
touchvalleyArrow.SetLineWeight(3); 
touchvalleyArrow.AssignValueColor(color.blue);

#AddLabel(yes,"Warning-No Holiday Adjustment & Percent Occurance Calc Slightly #Understated (<1%)"); 
#AddLabel(show_em_calc, "Last IV = " + ivGapHi); 
#AddLabel(show_em_calc, "Last EM = " + expmove, Color.Gray); 
AddLabel(show_em_calc, "Last High Bar = " + high_bar, Color.Gray); 
AddLabel(show_em_calc, "Last Low Bar = " + low_bar, Color.Gray); 
#AddLabel(show_em_calc, "EM Skew%/Std Dev Adj(%)/Touches% = " + em_skew_percent + "/" + em_bandwidth + "/" + touches_percent); 
AddLabel(show_highlow_detail, "Over EM Cnt/Avg=" + peakcnt + "/" + if peakcnt > 0 then peakamt / peakcnt else 0); 
AddLabel(show_highlow_detail, "Over EM % " + if lastbar > 0 then peakcnt / lastbar * 100 else 0); 
AddLabel(show_highlow_detail, "Under EM Cnt/Avg=" + valleycnt + "/" + if valleycnt > 0 then valleyamt / valleycnt else 0); 
AddLabel(show_highlow_detail, "Under EM % " + if lastbar > 0 then valleycnt / lastbar * 100 else 0); 
AddLabel(show_highlow_detail, "Bars=" + lastbar + " Weeks=" + weekcnt);

AddLabel(show_highlow_daily, "Mon Over EM Cnt/Avg=" + monpeakcnt + "/" + if monpeakamt > 0 then monpeakamt/monpeakcnt else 0); 
AddLabel(show_highlow_daily, "Mon Under EM Cnt/Avg=" + monvalleycnt + "/" + if monvalleyamt > 0 then monvalleyamt/monvalleycnt else 0);

AddLabel(show_highlow_daily, "Tue Over EM Cnt/Avg=" + tuepeakcnt + "/" + if tuepeakamt > 0 then tuepeakamt/tuepeakcnt else 0); 
AddLabel(show_highlow_daily, "Tue Under EM Cnt/Avg=" + tuevalleycnt + "/" + if tuevalleyamt > 0 then tuevalleyamt/tuevalleycnt else 0);

AddLabel(show_highlow_daily, "Wen Over EM Cnt/Avg=" + wenpeakcnt + "/" + if wenpeakamt > 0 then wenpeakamt/wenpeakcnt else 0); 
AddLabel(show_highlow_daily, "Wen Under EM Cnt/Avg=" + wenvalleycnt + "/" + if wenvalleyamt > 0 then wenvalleyamt/wenvalleycnt else 0);

AddLabel(show_highlow_daily, "Thu Over EM Cnt/Avg=" + thupeakcnt + "/" + if thupeakamt > 0 then thupeakamt/thupeakcnt else 0); 
AddLabel(show_highlow_daily, "Thu Under EM Cnt/Avg=" + thuvalleycnt + "/" + if thuvalleyamt > 0 then thuvalleyamt/thuvalleycnt else 0);

AddLabel(show_highlow_daily, "Fri Over EM Cnt/Avg=" + fripeakcnt + "/" + if fripeakamt > 0 then fripeakamt/fripeakcnt else 0); 
AddLabel(show_highlow_daily, "Fri Under EM Cnt/Avg=" + frivalleycnt + "/" + if frivalleyamt > 0 then frivalleyamt/frivalleycnt else 0);

AddLabel(show_highlow_daily_inside, "Mon Within EM High Cnt/Avg=" + monpeakcntin + "/" + if monpeakamtin > 0 then monpeakamtin/monpeakcntin else 0); 
AddLabel(show_highlow_daily_inside, "Mon Within EM Low Cnt/Avg=" + monvalleycntin + "/" + if monvalleyamtin > 0 then monvalleyamtin/monvalleycntin else 0);

AddLabel(show_highlow_daily_inside, "Tue Within EM High Cnt/Avg=" + tuepeakcntin + "/" + if tuepeakamtin > 0 then tuepeakamtin/tuepeakcntin else 0); 
AddLabel(show_highlow_daily_inside, "Tue Within EM Low Cnt/Avg=" + tuevalleycntin + "/" + if tuevalleyamtin > 0 then tuevalleyamtin/tuevalleycntin else 0);

AddLabel(show_highlow_daily_inside, "Wen Within EM High Cnt/Avg=" + wenpeakcntin + "/" + if wenpeakamtin > 0 then wenpeakamtin/wenpeakcntin else 0); 
AddLabel(show_highlow_daily_inside, "Wen Within EM Low Cnt/Avg=" + wenvalleycntin + "/" + if wenvalleyamtin > 0 then wenvalleyamtin/wenvalleycntin else 0);

AddLabel(show_highlow_daily_inside, "Thu Within EM High Cnt/Avg=" + thupeakcntin + "/" + if thupeakamtin > 0 then thupeakamtin/thupeakcntin else 0); 
AddLabel(show_highlow_daily_inside, "Thu Within EM Low Cnt/Avg=" + thuvalleycntin + "/" + if thuvalleyamtin > 0 then thuvalleyamtin/thuvalleycntin else 0);

AddLabel(show_highlow_daily_inside, "Fri Within EM High Cnt/Avg=" + fripeakcntin + "/" + if fripeakamtin > 0 then fripeakamtin/fripeakcntin else 0); 
AddLabel(show_highlow_daily_inside, "Fri Within EM Low Cnt/Avg=" + frivalleycntin + "/" + if frivalleyamtin > 0 then frivalleyamtin/frivalleycntin else 0);

AddLabel(show_touches_daily, "Mon Touches EM High/Low/Tot Cnt=" + montouchpeakcntin + "/" + montouchvalleycntin + "/" + (montouchpeakcntin+montouchvalleycntin)); 
AddLabel(show_touches_daily, "Tue Touches EM High/Low/Tot Cnt=" + tuetouchpeakcntin + "/" + tuetouchvalleycntin + "/" + (tuetouchpeakcntin+tuetouchvalleycntin)); 
AddLabel(show_touches_daily, "Wen Touches EM High/Low/Tot Cnt=" + wentouchpeakcntin + "/" + wentouchvalleycntin + "/" + (wentouchpeakcntin+wentouchvalleycntin)); 
AddLabel(show_touches_daily, "Thu Touches EM High/Low/Tot Cnt=" + thutouchpeakcntin + "/" + thutouchvalleycntin + "/" + (thutouchpeakcntin+thutouchvalleycntin)); 
AddLabel(show_touches_daily, "Fri Touches EM High/Low/Tot Cnt=" + fritouchpeakcntin + "/" + fritouchvalleycntin + "/" + (fritouchpeakcntin+fritouchvalleycntin)); 
AddLabel(show_touches_daily, "Total Touches EM High/Low/Tot Cnt=" + touchpeakcnt + "/" + touchvalleycnt + "/" + (touchpeakcnt+touchvalleycnt));

# 
# diagnostic bubbles 
#

AddChartBubble(peak and show_high_bubble, high + 1, "Peak Cnt=" + peakcnt + " Over Amt=" + (close - high_bar) + " Cum Over Amt=" + peakamt + " Highbar=" + high_bar, Color.WHITE);

AddChartBubble(valley and show_low_bubble, low - 1, "Valley Cnt=" + valleycnt + " Under Amt=" + (low_bar - close) + " Cum Under Amt=" + valleyamt + " Valleybar=" + low_bar, Color.WHITE);

# 
# check em calc's 
#

#AddChartBubble(yes, high + 1, "bar " + BarNumber() + "D=" + getdayofweek(getyyyymmdd()) + "Hbar " + high_bar + "iv " + imp_volatility() + " close " + close + " em " + expmove + " Lbar " + low_bar + " EMClose " + em_close, Color.WHITE);

# 
# daily bar diagnostic section 
#

#peak

#AddChartBubble(fripeak, high + 1, "Fri Over Count=" + fripeakcnt + "Fri Over Amt=" + (close - high_bar) + "Cum Fri Over Amt=" + fripeakamt + " Highbar=" + high_bar, color.white); 
#AddChartBubble(thupeak, high + 1, "Thu Over Count=" + thupeakcnt + "Thu Over Amt=" + (close - high_bar) + "Cum Thu Over Amt=" + thupeakamt + " Highbar=" + high_bar, color.white); 
#AddChartBubble(wenpeak, high + 1, "Wen Over Count=" + wenpeakcnt + "Wen Over Amt=" + (close - high_bar) + "Cum Wen Over Amt=" + wenpeakamt + " Highbar=" + high_bar, color.white); 
#AddChartBubble(tuepeak, high + 1, "Tue Over Count=" + tuepeakcnt + "Tue Over Amt=" + (close - high_bar) + "Cum Tue Over Amt=" + tuepeakamt + " Highbar=" + high_bar, color.white); 
#AddChartBubble(monpeak, high + 1, "Mon Over Count=" + monpeakcnt + "Mon Over Amt=" + (close - high_bar) + "Cum Mon Over Amt=" + monpeakamt + " Highbar=" + high_bar, color.white);

# valley

#AddChartBubble(monvalley, high + 1, "Mon Under Count=" + monvalleycnt + "Mon Under Amt=" + (low_bar - close) + "Cum Mon Under Amt=" + monvalleyamt + " Lowbar=" + low_bar, color.white); 
#AddChartBubble(tuevalley, high + 1, "Tue Under Count=" + tuevalleycnt + "Tue Under Amt=" + (low_bar - close) + "Cum Tue Under Amt=" + tuevalleyamt + " Lowbar=" + low_bar, color.white);

#AddChartBubble(wenvalley, high + 1, "Wen Under Count=" + wenvalleycnt + "Wen Under Amt=" + (low_bar - close) + "Cum Wen Under Amt=" + wenvalleyamt + " Lowbar=" + low_bar, color.white); 
#AddChartBubble(thuvalley, high + 1, "Thu Under Count=" + thuvalleycnt + "Thu Under Amt=" + (low_bar - close) + "Cum Thu Under Amt=" + thuvalleyamt + " Lowbar=" + low_bar, color.white); 
#AddChartBubble(frivalley, high + 1, "Fri Under Count=" + frivalleycnt + "Fri Under Amt=" + (low_bar - close) + "Cum Fri Under Amt=" + frivalleyamt + " Lowbar=" + low_bar, color.white);

# touches

#AddChartBubble(touchpeak, high + 1, "Close=" +close + " High=" + high + " High_bar=" + high_bar + " Touches%=" + touches_percent + " EM=" + expmove + "EMclose=" + em_close +" High_Touch_Bar=" + touch_high_bar, Color.WHITE);

#AddChartBubble(touchvalley, low - 1, "Close=" + close + " Low=" + low + " Low_bar=" + low_bar + " Touches%=" + touches_percent + " EM=" + expmove + " Emclose=" + em_close+" Low_Touch_Bar=" + touch_low_bar, Color.WHITE);