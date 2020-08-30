declare upper;
input ShowSignals = yes;
input ShowLabel = yes;

plot VMA = reference VariableMA(price=close, length=21);

def vwma8 = SUM(volume * close, 8) / SUM(volume, 8);
def vwma21 = SUM(volume * close, 21) / SUM(volume, 21);
def vwma34 = SUM(volume * close, 34) / SUM(volume, 34);

def bullish = vwma8 > vwma21 && vwma21 > vwma34;
def bearish = vwma8 < vwma21 && vwma21 < vwma34;
def distribution = !bullish && !bearish;

AddLabel(
    ShowLabel, 
    if bullish then "Stage: ACCELERATION" 
        else if bearish then "Stage: DECELERATION" 
        else if close >= VMA then "Stage: ACCUMULATION" 
        else "Stage: DISTRIBUTION", 
    if bullish then Color.Green 
        else if bearish then Color.RED 
        else if close >= VMA then Color.Yellow 
        else Color.ORANGE);
VMA.DefineColor("Bearish",Color.RED);
VMA.DefineColor("Bullish",Color.GREEN);
VMA.DefineColor("Indecision",Color.GRAY);
VMA.AssignValueColor(
    if bearish && close <= VMA then VMA.Color("Bearish") 
    else if bullish && close >= VMA then VMA.Color("Bullish")
    else VMA.Color("Indecision"));

def intoAcceleration = bullish && close >= VMA;
def intoDeceleration = bearish && close <= VMA;

plot upSignal = intoAcceleration && !intoAcceleration;
upSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
upSignal.SetDefaultColor(Color.GREEN);
upSignal.SetHiding(ShowSignals);

plot dnSignal = intoDeceleration && !intoDeceleration;
dnSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
dnSignal.SetDefaultColor(Color.RED);
dnSignal.SetHiding(ShowSignals);
