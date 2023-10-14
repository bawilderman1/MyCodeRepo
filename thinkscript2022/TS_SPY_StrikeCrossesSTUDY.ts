declare hide_on_daily;

DefineGlobalColor("pos", CreateColor(44, 173, 243));
DefineGlobalColor("neg", CreateColor(243,114,44));
DefineGlobalColor("reg", CreateColor(204, 204, 204));

input PaintBars = yes;
input ShowLabel = yes;

def AggPeriod = AggregationPeriod.DAY;

def openPrice = Round(Open(GetUnderlyingSymbol(), AggPeriod), 0);
def curHigh = if SecondsFromTime(0930) >= 0 and SecondsTillTime(1600) > 0 
    then High(GetUnderlyingSymbol()) 
    else curHigh[1];
def curLow = if SecondsFromTime(0930) >= 0 and SecondsTillTime(1600) > 0 
    then Low(GetUnderlyingSymbol())
    else curLow[1];

def nextStrikeL = if SecondsFromTime(0930) == 0 then openPrice - 1 else nextStrikeL[1];
def nextStrikeH = if SecondsFromTime(0930) == 0 then openPrice + 1 else nextStrikeH[1];

def currentStrike = if SecondsFromTime(0930) == 0 then openPrice 
    else if curHigh >= currentStrike[1] + 1 
        then RoundDown(curHigh, 0)
    else if curLow <= currentStrike[1] - 1 
        then RoundUp(curLow, 0)
    else currentStrike[1];

AddLabel(
    ShowLabel, 
    GetUnderlyingSymbol() + ": " + currentStrike, 
    if curHigh >= currentStrike[1] + 1 then GlobalColor("pos") 
    else if curLow <= currentStrike[1] - 1 then GlobalColor("neg")
        else GlobalColor("reg"));

AssignPriceColor(
    if PaintBars and curHigh >= currentStrike[1] + 1 then GlobalColor("pos") 
    else if PaintBars and curLow <= currentStrike[1] - 1 then GlobalColor("neg") 
    else Color.CURRENT
);
