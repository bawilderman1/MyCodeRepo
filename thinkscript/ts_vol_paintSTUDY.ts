# ************************************************************* 
# Yellow - Low volume for the size of the bar - Amateurs at work 
# White - Climax down 
# Blue -Climax up 
# Red - Churn - Pros buying at lows or unloading at highs 
# Magenta - Climax Churn - Pros taking profits at highs or lows 
# Gray - Normal (default) Bar 
# ************************************************************* 
# The Better Volume indicator improves on your typical volume histogram by coloring the bars based on 5 criteria: 
# Climax volume - high volume and high range 
# High volume churn - high volume but low range 
# Climax volume plus High volume churn - both the above conditions (rare) 
# Low volume churn - low volume and high range 
# Low volume - just low volume but not a low volume churn bar" 
# ************************************************************* 
# 
# 
# Create colors to use later
DefineGlobalColor("brightPurple", CreateColor(242, 13, 255));
DefineGlobalColor("faintPurple", CreateColor(157, 90, 184));
DefineGlobalColor("offGreen", CreateColor(145, 136, 81));
DefineGlobalColor("yellowGreen", CreateColor(166, 204, 59));
DefineGlobalColor("tdGreen", CreateColor(38, 162, 51));
DefineGlobalColor("paleBlue", CreateColor(82, 137, 168));
DefineGlobalColor("midBlue", CreateColor(45, 120, 209));
DefineGlobalColor("flatRed", CreateColor(196, 53, 58));
DefineGlobalColor("deepGray", CreateColor(63, 67, 76));
DefineGlobalColor("midGray", CreateColor(147, 152, 162));
DefineGlobalColor("mustard", CreateColor(219, 177, 48));
DefineGlobalColor("deepMint", CreateColor(81, 145, 89));
DefineGlobalColor("studyWhite",color.white);
DefineGlobalColor("studyBlack",color.black);

input lookback = 8;
input Use2Bars = {"No", default "Yes"};
input LowVol = {"No", default "Yes"};
input ClimaxUp = {"No", default "Yes"};
input ClimaxDown = {"No", default "Yes"};
input Churn = {"No", default "Yes"};
input ClimaxChurn = {"No", default "Yes"};
def LowVolColor = 8;
def ClimaxUpColor = 6; #9
def ClimaxDownColor = 1;
def ChurnColor = 5;
def ClimaxChurnColor = 0;
def DefaultBarColor = 9; #7
def AvgColor = 0; 
# 
def Range = TrueRange(high, low, close); 
#
def Value1 = If (close >= open, volume * ((Range) / ((2 + (Range * Range) / 10) * Range + (open - close))), volume * (((Range + close - open)) / (2 + (Range * Range) / 10) * Range + (close - open)));
def Value2 = volume - Value1;
def Value3 = Value1 + Value2;
def Value4 = Value1 * Range;
def Value5 = (Value1 - Value2) * Range;
def Value6 = Value2 * Range;
def Value7 = (Value2 - Value1) * Range;
def Value8 = If (Range <> 0, Value1 / Range, 1);
def Value9 = If (Range <> 0, (Value1 - Value2) / Range, 1);
def Value10 = If (Range <> 0, Value2 / Range, 1);
def Value11 = If (Range <> 0, (Value2 - Value1) / Range, 1);
def Value12 = If (Range <> 0, Value3 / Range, 1);
def Value13 = If (Use2Bars, Value3 + Value3[1], 1);
def Value14 = If (Use2Bars, (Value1 + Value1[1]) * (Highest(high, 2) - Lowest(low, 2)), 1);
def Value15 = If (Use2Bars, (Value1 + Value1[1] - Value2 - Value2[1]) * (Highest(high, 2) - Lowest(low, 2)), 1);
def Value16 = If (Use2Bars, (Value2 + Value2[1]) * (Highest(high, 2) - Lowest(low, 2)), 1);
def Value17 = If (Use2Bars, (Value2 + Value2[1] - Value1 - Value1[1]) * (Highest(high, 2) - Lowest(low, 2)), 1);
def Value18 = If ((Use2Bars and (Highest(high, 2) <> Lowest(low, 2))), (Value1 + Value1[1]) / (Highest(high, 2) - Lowest(low, 2)), 1);
def Value19 = If ((Use2Bars and (Highest(high, 2) <> Lowest(low, 2))), (Value1 + Value1[1] - Value2 - Value2[1]) / (Highest(high, 2) - Lowest(low, 2)), 1);
def Value20 = If ((Use2Bars and (Highest(high, 2) <> Lowest(low, 2))), (Value2 + Value2[1]) / (Highest(high, 2) - Lowest(low, 2)), 1);
def Value21 = If ((Use2Bars and (Highest(high, 2) <> Lowest(low, 2))), (Value2 + Value2[1] - Value1 - Value1[1]) / (Highest(high, 2) - Lowest(low, 2)), 1);
def Value22 = If ((Use2Bars and (Highest(high, 2) <> Lowest(low, 2))), Value13 / (Highest(high, 2) - Lowest(low, 2)), 1);
def Condition1 = If(Value3 == Lowest(Value3, lookback), 1, 0);
def Condition2 = If((Value4 == Highest(Value4, lookback) and close > open), 1, 0);
def Condition3 = If((Value5 == Highest(Value5, lookback) and close > open), 1, 0);
def Condition4 = If((Value6 == Highest(Value6, lookback) and close < open), 1, 0);
def Condition5 = If((Value7 == Highest(Value7, lookback) and close < open), 1, 0);
def Condition6 = If((Value8 == Lowest(Value8, lookback) and close < open), 1, 0);
def Condition7 = If((Value9 == Lowest(Value9, lookback) and close < open), 1, 0);
def Condition8 = If((Value10 == Lowest(Value10, lookback) and close > open), 1, 0);
def Condition9 = If((Value11 == Lowest(Value11, lookback) and close > open), 1, 0);
def Condition10 = If(Value12 == Highest(Value12, lookback), 1, 0);
def Condition11 = If (Use2Bars and (Value13 == Lowest(Value13, lookback) and close > open and close[1] > open[1]), 1, 0);
def Condition12 = If (Use2Bars and (Value14 == Highest(Value14, lookback) and close > open and close[1] > open[1]), 1, 0);
def Condition13 = If (Use2Bars and (Value15 == Highest(Value15, lookback) and close > open and close[1] < open[1]), 1, 0);
def Condition14 = If (Use2Bars and (Value16 == Lowest(Value16, lookback) and close < open and close[1] < open[1]), 1, 0);
def Condition15 = If (Use2Bars and (Value17 == Lowest(Value17, lookback) and close < open and close[1] < open[1]), 1, 0);
def Condition16 = If (Use2Bars and (Value18 == Lowest(Value18, lookback) and close < open and close[1] < open[1]), 1, 0);
def Condition17 = If (Use2Bars and (Value19 == Lowest(Value19, lookback) and close > open and close[1] < open[1]), 1, 0);
def Condition18 = If (Use2Bars and (Value20 == Lowest(Value20, lookback) and close > open and close[1] > open[1]), 1, 0);
def Condition19 = If (Use2Bars and (Value21 == Lowest(Value21, lookback) and close > open and close[1] > open[1]), 1, 0);
def Condition20 = If (Use2Bars and (Value22 == Lowest(Value22, lookback)), 1, 0);
def Vol = volume;

#assignPriceColor(
#        if (ClimaxChurn and (Condition10 or Condition20)) and (Condition2 or Condition3 or Condition4 or Condition5 or Condition6 or Condition7 or Condition8 or Condition9) 
#            then GetColor(ClimaxChurnColor)
#        else if (LowVol and (Condition1 or Condition11)) 
#            then GetColor(LowVolColor) 
#        else if (ClimaxUp and (Condition2 or Condition3 or Condition8 or Condition9 or Condition12 or Condition13 or Condition18 or Condition19)) 
#            then GetColor(ClimaxUpColor) 
#        else if (ClimaxDown and (Condition4 or Condition5 or Condition6 or Condition7 or Condition14 or Condition15 or Condition16 or Condition17)) 
#            then GetColor(ClimaxDownColor) 
#        else if (Churn and Condition10 or Condition20) 
#            then GetColor(ChurnColor) 
#        else GetColor(DefaultBarColor)
#);

#GlobalColor("brightPurple")
assignPriceColor(
        if (ClimaxChurn and (Condition10 or Condition20)) and (Condition2 or Condition3 or Condition4 or Condition5 or Condition6 or Condition7 or Condition8 or Condition9) 
            then GlobalColor("faintPurple") #ClimaxChurn
        else if (LowVol and (Condition1 or Condition11)) 
            then GlobalColor("studyWhite") #LowVolume
        else if (ClimaxUp and (Condition2 or Condition3 or Condition8 or Condition9 or Condition12 or Condition13 or Condition18 or Condition19)) 
            then GlobalColor("tdGreen")  #ClimaxUpColor
        else if (ClimaxDown and (Condition4 or Condition5 or Condition6 or Condition7 or Condition14 or Condition15 or Condition16 or Condition17)) 
            then GlobalColor("flatRed") #ClimaxDownColor 
        else if (Churn and Condition10 or Condition20) 
            then GlobalColor("deepmint") #Churn
        else GlobalColor("studyBlack") #default
);
