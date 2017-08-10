input atrLength = {default "14", "21"};
input averageType = AverageType.WILDERS;
input round = no;
input rndTo_1_dividedBy = 4;
def length;

switch (atrLength) {
case "14":
    length = 14;
case "21":
    length = 21;
};

def ATR = MovingAverage(averageType, TrueRange(high, close, low), length);
def roundedATR = Round(ATR * rndTo_1_dividedBy, 0) / rndTo_1_dividedBy;
def atrToUse = if round == no then ATR else roundedATR;

def direction = if open[0] < close[0] then 1 else 0;
def bodyLength = if direction == 0 then open[0] - close[0] else close[0] - open[0];
def upperShadow = if direction == 1 then high[0] - close[0] else high[0] - open[0];
def lowerShadow = if direction == 1 then open[0] - low[0] else close[0] - low[0];

rec counterD;
rec counterU;

rec HalfDownVal; 
    if (direction == 0 && bodyLength > atrToUse && bodyLength > (upperShadow + lowerShadow)) {
        HalfDownVal = MidBodyVal();
        counterD = 0;
    } else if (!isnan(HalfDownVal[1]) && close[1] < HalfDownVal[1]) {
        HalfDownVal = HalfDownVal[1];
        counterD = counterD[1] + 1;
    } else {
        HalfDownVal = double.nan;
        counterD = -1;
    }

rec HalfUpVal;  
    if (direction == 1 && bodyLength > atrToUse && bodyLength > (upperShadow + lowerShadow)) {
        HalfUpVal = MidBodyVal(); 
        counterU = 0;
    } else if (!IsNaN(HalfUpVal[1]) && close[1] > HalfUpVal[1]) {
        HalfUpVal = HalfUpVal[1];
        counterU = counterU[1] + 1;
    } else {
        HalfUpVal = Double.NaN;
        counterU = - 1;
    }

plot HalfBackDown = if HalfDownVal > 0 && (counterD between 0 and 5) then HalfDownVal else double.nan;
HalfBackDown.SetStyle(Curve.SHORT_DASH);
HalfBackDown.SetDefaultColor(Color.MAGENTA);
HalfBackDown.SetLineWeight(2);

plot HalfBackUp = if HalfUpVal > 0 && (counterU between 0 and 5) then HalfUpVal else double.nan;
HalfBackUp.SetStyle(Curve.SHORT_DASH);
HalfBackUp.SetDefaultColor(Color.CYAN);
HalfBackUp.SetLineWeight(2);