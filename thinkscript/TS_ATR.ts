##########################################################
# sdi_atr: Display Average True Range as a label
#hint: Displays the AverageTrueRange as a color-coded chart label. Red=decreasing, Orange=level, Green=increasing. Version:1.0
# source:http://www.smallDogInvestor.com
# author: allen everhart
# date: 10Mar2011
# copylefts reserved. This is free software. That means you are free
# to use or modify it for your own usage but not for resale.
# Help me get the word out about my blog by keeping this header
# in place.
declare upper;
input length = 14 ;
input RoundDecimals = 2;

Assert(RoundDecimals >= 0, "RoundDecimal must be greater than or equal to zero");
Assert(length >= 0, "RoundDecimal must be greater than or equal to zero");

DefineGlobalColor("mediumGreen", CreateColor(103, 191, 92));
DefineGlobalColor("mediumRed", CreateColor(237, 102, 93));
DefineGlobalColor("mediumBlue", CreateColor(114, 158, 206));

def bar = Round(WildersAverage(TrueRange(high, close, low), length),RoundDecimals);
#AddChartLabel(1,concat(concat(concat("ATR(",length), "):"), bar),
AddLabel(1, Concat(Concat(Concat("ATR(", length), "):"), bar),
  if bar > bar[1] then
    GlobalColor("mediumGreen")
  else if bar == bar[1] then
    GlobalColor("mediumBlue")
  else
    GlobalColor("mediumRed")
);
#################