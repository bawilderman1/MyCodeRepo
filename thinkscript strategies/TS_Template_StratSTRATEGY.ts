script entryLongCriteria {
    plot Signal = ExpAverage(close, 8) crosses above ExpAverage(close, 21);
}

script exitAtrCriteria {
    input OrderType = {default Long, Short};
    input Length = 14;
    input Average = AverageType.WILDERS;
    input Up = 2.00;
    input Down = 1.25;

    def atr = ATR(length, average);
    def entryPrice = EntryPrice();

    def entryAtr = 
        if !IsNaN(entryPrice[0]) and IsNaN(entryPrice[1]) then atr
        else CompoundValue(1, entryAtr[1], atr);

    def _longAtrStop =
        if high[1] > entryPrice + entryAtr then entryPrice
        else if !IsNaN(entryPrice[0]) and IsNaN(entryPrice[1]) then entryPrice - (entryAtr * Down)
        else CompoundValue(1, _longAtrStop[1], atr);

    def _shortAtrStop = 
        if low[1] < entryPrice - entryAtr then entryPrice
        else if !IsNaN(entryPrice[0]) and IsNaN(entryPrice[1]) then entryPrice + (entryAtr * Up)
        else CompoundValue(1, _shortAtrStop[1], atr);

    plot StopFromAtr;
    plot TargetFromAtr;

    switch (OrderType) {
        case Long:
            StopFromAtr = _longAtrStop;
            TargetFromAtr = entryPrice + (entryAtr * Up);
        case Short:
            StopFromAtr = _shortAtrStop;
            TargetFromAtr = entryPrice - (entryAtr * Down);
    }
}

script exitPctCriteria {
    input OrderType = {default Long, Short};
    input TargetPercent = 0.05;
    input StopPercent = 0.03;

    def entryPrice = EntryPrice();

    def _longPctStop = entryPrice * (1 - StopPercent);
    def _longPctTarget = entryPrice * (1 + TargetPercent);

    def _shortPctStop = entryPrice * (1 + StopPercent);
    def _shortPctTarget = entryPrice * (1 - TargetPercent);

    plot StopFromPercent;
    plot TargetFromPercent;

    switch (OrderType) {
        case Long:
            StopFromPercent = _longPctStop;
            TargetFromPercent = _longPctTarget;
        case Short:
            StopFromPercent = _shortPctStop;
            TargetFromPercent = _shortPctTarget;
    }
}

script exitBarsCriteria {
    input Bars = 5;

    def entryPrice = EntryPrice();
    def barCounter =
        if !IsNaN(entryPrice[0]) and IsNaN(entryPrice[1]) then 1
        else if IsNaN(entryPrice[0]) then 0
        else CompoundValue(1, barCounter[1] + 1, 0);

    plot BarCounts = barCounter;
    plot ExitBar = barCounter == Bars;
}

#############################################################

input StrategyName = "TrendCont";
input ShareSize = 100;
input AtrLength = 14;
input AtrAverage = AverageType.WILDERS;
input UpFactor = 2.00;
input DnFactor = 1.25;

def entryPrice = EntryPrice();
def longEntry = entryLongCriteria();

AddOrder(
    type = OrderType.BUY_TO_OPEN, 
    condition = longEntry, 
    price = close[0], 
    tradeSize = ShareSize,
    tickcolor = Color.CYAN, 
    arrowcolor = Color.CYAN, 
    name = StrategyName + "_LE");

def goal = exitAtrCriteria(OrderType = "Long", Length = AtrLength, Average = AtrAverage, Up = UpFactor, Down = DnFactor).TargetFromAtr;

#def goalPct = exitPctCriteria(TargetPercent = 0.03).TargetFromPercent;

AddOrder(
    type = OrderType.SELL_TO_CLOSE, 
    condition = high >= goal, 
    price = goal, 
    tradeSize = ShareSize,
    tickcolor = Color.UPTICK, 
    arrowcolor = Color.UPTICK, 
    name = StrategyName + "_LX");

def protection = exitAtrCriteria(OrderType = "Long", Length = AtrLength, Average = AtrAverage, Up = UpFactor, Down = DnFactor).StopFromAtr;

#def protectionPct = exitPctCriteria(StopPercent = 0.01).StopFromPercent;
#def protectionBars = exitBarsCriteria(5).ExitBar;

AddOrder(
    type = OrderType.SELL_TO_CLOSE, 
    condition = low <= protection, 
    price = protection, 
    tradeSize = ShareSize,
    tickcolor = Color.DOWNTICK, 
    arrowcolor = Color.DOWNTICK, 
    name = StrategyName + "_LX");

plot Entry = entryPrice;
Entry.SetDefaultColor(Color.CYAN);

#plot Stop = protection;
#Stop.SetDefaultColor(Color.PINK);

#plot Target = goal;
#Target.SetDefaultColor(Color.LIME);
