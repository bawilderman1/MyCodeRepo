declare upper;
declare hide_on_intraday;

DefineGlobalColor("burntOrange", CreateColor(255, 126, 0));

def quarters = if ((GetMonth() == 1 and GetMonth()[1] == 12) 
                   or (GetMonth() == 4 and GetMonth()[1] == 3)
                   or (GetMonth() == 7 and GetMonth()[1] == 6)
                   or (GetMonth() == 10 and GetMonth()[1] == 9)) 
               then quarters[1] + 1
               else compoundValue(1, quarters[1], 0);  

def earningsCycle = 
    if 
        HasEarnings(EarningTime.AFTER_MARKET)[1] 
        OR HasEarnings(EarningTime.BEFORE_MARKET)
        OR (HasEarnings() AND !HasEarnings(EarningTime.AFTER_MARKET) AND !HasEarnings(EarningTime.BEFORE_MARKET)) 
        then earningsCycle[1] + 1 
    else compoundValue(1, earningsCycle[1], 0);

def tp = (high + close + low) / 3;
def tpv = tp * volume;

def useEarningsEvents = !IsNaN(GetEventOffset(Events.EARNINGS, -1));
def cycleNumber = if useEarningsEvents then earningsCycle else quarters;
def rollVwap = compoundValue(1, cycleNumber != cycleNumber[1], yes);

def tpvSum;
def volSum;
if (rollVwap) {
    volSum = volume;
    tpvSum = tpv;
} else {
    volSum = compoundValue(1, volSum[1] + volume, volume);
    tpvSum = compoundValue(1, tpvSum[1] + tpv, tpv);
}

def _today = if IsNaN(close[-1]) AND !IsNaN(close[0]) then 1 else 0;

#def latestEarnings = HighestAll(earningsCycle);
#plot QtrVwap = if earningsCycle != latestEarnings then Double.NaN else tpvSum/volSum;
plot QtrVwap = if (cycleNumber != cycleNumber[-1] and !_today) or cycleNumber == 0 
    then Double.NaN 
    else tpvSum/volSum;
QtrVwap.setDefaultColor(GlobalColor("burntOrange"));
QtrVwap.SetStyle(Curve.MEDIUM_DASH);