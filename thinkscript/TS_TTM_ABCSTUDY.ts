declare upper;
declare hide_on_daily;

input numAtrs = 2;
input atrLength = {default "14", "21"};
input averageType = AverageType.WILDERS;
def length;

switch (atrLength) {
case "14":
    length = 14;
case "21":
    length = 21;
};

def ATR = MovingAverage(averageType, TrueRange(high, close, low), length);

def hideChart;

###Put in hiding logic if chart aggregation is greater than 30 minutes###
if GetAggregationPeriod() < AggregationPeriod.THIRTY_MIN && getsymbol() != "/ZB" {
    hideChart = no;
} else {
    hideChart = yes;
}

###Get number of minutes in aggregation period###
def timeChart = getaggregationPeriod()/60000;
#addlabel(yes,timeChart + " min",color.blue);

###Add vertical divider lines between Periods###
AddVerticalLine(secondsTillTime(0930) == 0 && hideChart == no, "A Period", Color.yellow, Curve.SHORT_DASH);
AddVerticalLine(secondsTillTime(1200) == 0 && hideChart == no, "B Period", Color.yellow, Curve.SHORT_DASH);
AddVerticalLine(secondsTillTime(1430) == 0 && hideChart == no, "C Period", Color.yellow, Curve.SHORT_DASH);

#addlabel(yes,getaggregationPeriod(),color.blue);
###Keeps track of chart plots start times###
def aggTime = getaggregationPeriod() / 60000;
def aStart = 0900 + (30 - aggTime);
def bStart = 1100 + (60 - aggTime);
def cStart = 1400 + (30 - aggTime);

###Keeps track of high during PreMarket###
rec pmPrdH = if secondsTillTime(0800) == 0 
                        then high
                   else if secondsFromTime(0800) < (3600 * 1.5) && high > pmPrdH[1]
                        then high    
                   else pmPrdH[1];

###Plot Period A's high during PreMarket timeframe only###
#plot pmPeriodHigh = if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
#                       then pmPrdH
#                       else double.nan;

rec pmPH = if secondsTillTime(aStart) == 0 && close >= (pmPrdH - (ATR*numAtrs)) 
                and close <= (pmPrdH + (ATR*numAtrs))
                       then pmPrdH
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdH - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then pmPrdH
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdH + (ATR*numAtrs), crossingdirection.BELOW) 
                       then pmPrdH
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and !crosses(close, pmPrdH - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, pmPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, pmPrdH + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, pmPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(pmPH[1]) 
                       then pmPrdH
           else double.nan;

plot pmPeriodHigh = pmPH;

###Keeps track of low during PreMarket###
rec pmPrdL = if secondsTillTime(0800) == 0 
                        then low
                   else if secondsFromTime(0800) < (3600 * 1.5) && low < pmPrdL[1]
                        then low    
                   else pmPrdL[1];

###Plot Period A's low during PreMarket timeframe only###
#plot pmPeriodLow = if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
#                       then pmPrdL
#                       else double.nan;

rec pmPL = if secondsTillTime(aStart) == 0 && close >= (pmPrdL - (ATR*numAtrs)) 
                and close <= (pmPrdL + (ATR*numAtrs))
                       then pmPrdL
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdL - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then pmPrdL
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdL + (ATR*numAtrs), crossingdirection.BELOW) 
                       then pmPrdL
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and crosses(close, pmPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(aStart) <= 0 && secondsFromTime(0930) < (3600 * 2.5)
                and !crosses(close, pmPrdL - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, pmPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, pmPrdL + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, pmPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(pmPL[1]) 
                       then pmPrdL
           else double.nan;

plot pmPeriodLow = pmPL;

##########################################################################################

###Keeps track of high during Period A###
rec aPrdH = if secondsTillTime(0930) == 0 
                        then high
                   else if secondsFromTime(0930) < (3600 * 2.5) && high > aPrdH[1]
                        then high    
                   else aPrdH[1];

###Plot Period A's high during Period B's timeframe only###
#plot aPeriodHigh = if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
#                       then aPrdH
#                       else double.nan;

rec aPH = if secondsTillTime(bStart) == 0 && close >= (aPrdH - (ATR*numAtrs)) 
                and close <= (aPrdH + (ATR*numAtrs))
                       then aPrdH
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdH - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then aPrdH
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdH + (ATR*numAtrs), crossingdirection.BELOW) 
                       then aPrdH
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and !crosses(close, aPrdH - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, aPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, aPrdH + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, aPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(aPH[1]) 
                       then aPrdH
           else double.nan;

plot aPeriodHigh = aPH;

###Keeps track of low during Period A###
rec aPrdL = if secondsTillTime(0930) == 0 
                        then low
                   else if secondsFromTime(0930) < (3600 * 2.5) && low < aPrdL[1]
                        then low    
                   else aPrdL[1];

###Plot Period A's low during Period B's timeframe only###
#plot aPeriodLow = if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
#                       then aPrdL
#                       else double.nan;

rec aPL = if secondsTillTime(bStart) == 0 && close >= (aPrdL - (ATR*numAtrs)) 
                and close <= (aPrdL + (ATR*numAtrs))
                       then aPrdL
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdL - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then aPrdL
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdL + (ATR*numAtrs), crossingdirection.BELOW) 
                       then aPrdL
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and crosses(close, aPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(bStart) <= 0 && secondsFromTime(1200) < (3600 * 2.5)
                and !crosses(close, aPrdL - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, aPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, aPrdL + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, aPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(aPL[1]) 
                       then aPrdL
           else double.nan;

plot aPeriodLow = aPL;

###Keeps track of high during Period B###
rec bPrdH = if secondsTillTime(1200) == 0 
                        then high
                   else if secondsFromTime(1200) < (3600 * 2.5) && high > bPrdH[1]
                        then high    
                   else bPrdH[1];

###Plot Period B's high during Period C's timeframe only###
#plot bPeriodHigh = if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
#                       then bPrdH
#                       else double.nan;

rec bPH = if secondsTillTime(cStart) == 0 && close >= (bPrdH - (ATR*numAtrs)) 
                and close <= (bPrdH + (ATR*numAtrs))
                       then bPrdH
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdH - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then bPrdH
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdH + (ATR*numAtrs), crossingdirection.BELOW) 
                       then bPrdH
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and !crosses(close, bPrdH - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, bPrdH - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, bPrdH + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, bPrdH + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(bPH[1]) 
                       then bPrdH
           else double.nan;

plot bPeriodHigh = bPH;

###Keeps track of low during Period B###
rec bPrdL = if secondsTillTime(1200) == 0 
                        then low
                   else if secondsFromTime(1200) < (3600 * 2.5) && low < bPrdL[1]
                        then low    
                   else bPrdL[1];

###Plot Period B's low during Period C's timeframe only###
#plot bPeriodLow = if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
#                       then bPrdL
#                       else double.nan;

rec bPL = if secondsTillTime(cStart) == 0 && close >= (bPrdL - (ATR*numAtrs)) 
                and close <= (bPrdL + (ATR*numAtrs))
                       then bPrdL
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdL - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then bPrdL
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdL + (ATR*numAtrs), crossingdirection.BELOW) 
                       then bPrdL
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and crosses(close, bPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(0930) < (3600 * 1.5)
                and crosses(close, bPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(cStart) <= 0 && secondsFromTime(1430) < (3600 * 1.5)
                and !crosses(close, bPrdL - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, bPrdL - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, bPrdL + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, bPrdL + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(bPL[1]) 
                       then bPrdL
           else double.nan;

plot bPeriodLow = bPL;

DefineGlobalColor("mintGreen", CreateColor(51, 255, 153));
DefineGlobalColor("brightRed", CreateColor(255, 0, 102));

###Format Chart###
pmPeriodHigh.setdefaultcolor(GlobalColor("mintGreen"));
pmPeriodLow.setdefaultColor(GlobalColor("brightRed"));
aPeriodHigh.setdefaultColor(GlobalColor("mintGreen"));
aPeriodLow.setdefaultColor(GlobalColor("brightRed"));
bPeriodHigh.setdefaultColor(GlobalColor("mintGreen"));
bPeriodLow.setdefaultColor(GlobalColor("brightRed"));

###Set Hiding###
pmPeriodHigh.sethiding(hideChart);
pmPeriodLow.sethiding(hideChart);
aPeriodHigh.sethiding(hideChart);
aPeriodLow.sethiding(hideChart);
bPeriodHigh.sethiding(hideChart);
bPeriodLow.sethiding(hideChart);

