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
def showLabel;

###Put in hiding logic if chart aggregation is greater than 30 minutes###
if GetAggregationPeriod() < AggregationPeriod.THIRTY_MIN && getsymbol() == "/ZB" {
    hideChart = no;
    showLabel = yes;
} else {
    hideChart = yes;
    showLabel = no;
}

###Get number of minutes in aggregation period###
def timeChart = getaggregationPeriod()/60000;
#addlabel(yes,timeChart + " min",color.blue);

###Add vertical divider lines between Periods###
AddVerticalLine(secondsTillTime(0720) == 0 && hideChart == no, "Start", Color.yellow, Curve.SHORT_DASH);
AddVerticalLine(secondsTillTime(0820) == 0 && hideChart == no, "End", Color.yellow, Curve.SHORT_DASH);

#addlabel(yes,getaggregationPeriod(),color.blue);
###Keeps track of chart plots start times###
def aggTime = getaggregationPeriod() / 60000;
def start = 0800 + (20 - aggTime);

###Keeps track of high during PreMarket###
rec firstHourH = if secondsTillTime(0720) == 0 
                        then high
                   else if secondsFromTime(0720) < (3600 * 1) && high > firstHourH[1]
                        then high    
                   else firstHourH[1];

###Plot first hour high for the rest of the day###
#plot firstHourHigh = if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
#                       then firstHourH
#                       else double.nan;

rec fhPH = if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60)) 
                and close >= (firstHourH - (ATR*numAtrs)) 
                and close <= (firstHourH + (ATR*numAtrs))
                       then firstHourH
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourH - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then firstHourH
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourH + (ATR*numAtrs), crossingdirection.BELOW) 
                       then firstHourH
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourH - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourH + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and !crosses(close, firstHourH - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, firstHourH - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, firstHourH + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, firstHourH + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(fhPH[1]) 
                       then firstHourH
           else double.nan;

plot firstHourHigh = fhPH;

###Keeps track of low during PreMarket###
rec firstHourL = if secondsTillTime(0720) == 0 
                        then low
                   else if secondsFromTime(0720) < (3600 * 1) && low < firstHourL[1]
                        then low    
                   else firstHourL[1];

###Plot Period A's low during PreMarket timeframe only###
#plot firstHourLow = if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
#                       then firstHourL
#                       else double.nan;

rec fhPL = if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and close >= (firstHourL - (ATR*numAtrs)) 
                and close <= (firstHourL + (ATR*numAtrs))
                       then firstHourL
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourL - (ATR*numAtrs), crossingdirection.ABOVE) 
                       then firstHourL
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourL + (ATR*numAtrs), crossingdirection.BELOW) 
                       then firstHourL
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourL - (ATR*(numAtrs+1)), crossingdirection.BELOW) 
                       then double.nan
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and crosses(close, firstHourL + (ATR*(numAtrs+1)), crossingdirection.ABOVE) 
                       then double.nan
           else if secondsTillTime(start) <= 0 && secondsFromTime(0820) < ((3600 * 6) + (40 * 60))
                and !crosses(close, firstHourL - (ATR*numAtrs), crossingdirection.ABOVE)
                and !crosses(close, firstHourL - (ATR*(numAtrs+1)), crossingdirection.BELOW)
                and !crosses(close, firstHourL + (ATR*numAtrs), crossingdirection.BELOW)
                and !crosses(close, firstHourL + (ATR*(numAtrs+1)), crossingdirection.ABOVE)
                and !isNaN(fhPL[1]) 
                       then firstHourL
           else double.nan;

plot firstHourLow = fhPL;

def fhRange = round((firstHourH - firstHourL) * 32);
addlabel(showLabel,"Range: " + fhRange + " Ticks", if fhRange < 17 then color.blue else color.black);

DefineGlobalColor("mintGreen", CreateColor(51, 255, 153));
DefineGlobalColor("brightRed", CreateColor(255, 0, 102));

###Format Chart###
firstHourHigh.setdefaultcolor(GlobalColor("mintGreen"));
firstHourLow.setdefaultColor(GlobalColor("brightRed"));

###Set Hiding###
firstHourHigh.sethiding(hideChart);
firstHourLow.sethiding(hideChart);
