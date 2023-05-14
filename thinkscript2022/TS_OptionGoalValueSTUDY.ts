declare upper;

input FromBar = 1;
input TargetFactor = 1.0;

def start = if secondsTillTime(0930) == 0 then BarNumber() else start[1];
def dayBar = (BarNumber() + 1) - start;

def price = if dayBar < FromBar then Double.NaN 
    else if FromBar == dayBar then open 
    else price[1];

plot Initial = if !IsNaN(close) and !IsNaN(price) then price
    else Double.NaN;
Initial.SetDefaultColor(GetColor(4));

plot Target = Initial + (Initial * TargetFactor);
Target.SetDefaultColor(GetColor(4));
Target.SetStyle(Curve.MEDIUM_DASH);
