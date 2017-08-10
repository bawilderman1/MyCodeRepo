declare lower;
AssignBackgroundColor(createColor(223,223,223));

input fastLength = 8;
input slowLength = 17;
input MACDLength = 9;
input AverageType = {SMA, default EMA, VarMA};
input price = close;
input hideArrows = no;

def tmp1 = if price > price[1] then price - price[1] else 0;
def tmp2 = if price[1] > price then price[1] - price else 0;
def d2 = Sum(tmp1, slowLength);
def d4 = Sum(tmp2, slowLength);
def cond = d2 + d4 == 0;
def ad3 = if cond then 0 else (d2 - d4) / (d2 + d4) * 100;
def coeff = 2 / (slowLength + 1) * AbsValue(ad3) / 100;
def asd = compoundValue("visible data" = coeff * price + (if IsNaN(asd[1]) then 0 else asd[1]) * (1 - coeff), "historical data" = price
);
def VMA = asd;

def Value;
def Avg;
switch (AverageType) {
case SMA:
    Value = Average(close, fastLength) - Average(close, slowLength);
    Avg = Average(Value, MACDLength);
case EMA:
    Value = ExpAverage(close, fastLength) - ExpAverage(close, slowLength);
    Avg = ExpAverage(Value, MACDLength);
case VarMA:
    Value = ExpAverage(close, fastLength) - VMA;
    Avg = Average(Value, MACDLength);
}

plot Diff = Value - Avg;
plot ZeroLine = if !IsNaN(close) then 0 else double.nan;

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.SetLineWeight(5);
Diff.DefineColor("Positive and Up", CreateColor(62, 193, 7));
Diff.DefineColor("Positive and Down", Color.DARK_GREEN);
Diff.DefineColor("Negative and Down", Color.RED);
Diff.DefineColor("Negative and Up", CreateColor(203, 2, 2));
Diff.AssignValueColor(if Diff >= 0 then if Diff > Diff[1] then Diff.Color("Positive and Up") else Diff.Color("Positive and Down") else if Diff < Diff[1] then Diff.Color("Negative and Down") else Diff.Color("Negative and Up"));
ZeroLine.SetDefaultColor(Color.BLACK);

plot Diff2 = Value - Avg;
Diff2.SetDefaultColor(GetColor(5));
Diff2.SetPaintingStrategy(PaintingStrategy.LINE);
Diff2.SetLineWeight(3);
Diff2.DefineColor("Positive and Up", CreateColor(62, 193, 7));
Diff2.DefineColor("Positive and Down", Color.DARK_GREEN);
Diff2.DefineColor("Negative and Down", Color.RED);
Diff2.DefineColor("Negative and Up", CreateColor(203, 2, 2));
Diff2.AssignValueColor(if Diff2 >= 0 then if Diff2 > Diff2[1] then Diff2.Color("Positive and Up") else Diff2.Color("Positive and Down") else if Diff2 < Diff2[1] then Diff2.Color("Negative and Down") else Diff2.Color("Negative and Up"));

AddCloud(Diff2, ZeroLine, Color.GREEN, Color.RED);

plot arrowup = if Diff2 crosses above ZeroLine then -.25 else Double.NaN;
plot ArrowDown = if Diff2 crosses below ZeroLine then .25 else Double.NaN;
arrowup.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ArrowDown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
arrowup.SetDefaultColor(Color.DARK_GREEN);
ArrowDown.SetDefaultColor(Color.RED);

def Hide1 =  if hideArrows == yes then yes else no;
arrowup.SetHiding(Hide1);
ArrowDown.SetHiding(Hide1);

#################################
#keltner bands
def factor = 1.5;
def length = 20;
def shift = factor * Average(TrueRange(high,  close,  low),  length);
def averageKelt = MovingAverage(AverageType.SIMPLE, price, length);
def UpperBandKelt = averageKelt + shift;
def LowerBandKelt = averageKelt - shift;

###################################
#bol bands
def Num_Dev_DnBB = -2.0;
def Num_Dev_upBB = 2.0;
def sDevBB = StDev(data = price, length = length);
def MidLineBol = MovingAverage(AverageType.SIMPLE, data = price, length = length);
def LowerBandBol = MidLineBol + Num_Dev_DnBB * sDevBB;
def UpperBandBol = MidLineBol + Num_Dev_upBB * sDevBB;

ZeroLine.SetDefaultColor(Color.BLACK);
ZeroLine.SetPaintingStrategy(PaintingStrategy.POINTS);
ZeroLine.SetLineWeight(1);
ZeroLine.DefineColor("Squeeze", Color.YELLOW);
ZeroLine.DefineColor("Normal", Color.BLACK);
ZeroLine.AssignValueColor(if (UpperBandBol between LowerBandKelt and UpperBandKelt) and (LowerBandBol between LowerBandKelt and UpperBandKelt) then ZeroLine.Color("Squeeze") else ZeroLine.Color("Normal"));