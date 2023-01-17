declare lower;

### Potential Signals ###
# 1) VixRSI > 1.40 => Sell Signal
# 2) VixRSI delining for 1 day after exceeding 1.40
# 3) VixRSI declining after rising for at least 3 consecutive
#    days and exceeding at least 1.00
# 4) Stock < 200 day SMA an initial 7 day high VixRSI is a
#    Short Selling signal

def highClose = Highest(close, 22);
def vixFix = ((((highClose - low[0]) / highClose) * 100) + 50);

def rsi = RSI(14, 70, 30, CLOSE, AverageType.WILDERS, no);
def expVixFix = ExpAverage(vixFix, 3);
def expRsi = ExpAverage(rsi, 3);

plot VixRSI = expVixFix / expRsi;

def bullTrigger = VixRSI[0] < 0.875 AND VixRSI[1] >= 0.875 AND Highest(VixRSI, 8) >= 1;
def bullSentiment = 
    if bullTrigger then 1
    else if VixRSI[0] <= VixRSI[1] AND bullSentiment[1] then 1
    else Double.NaN;
plot Bullish = if !IsNaN(bullSentiment) then VixRSI else bullSentiment;
Bullish.SetDefaultColor(Color.ORANGE);
Bullish.SetPaintingStrategy(PaintingStrategy.POINTS);
Bullish.SetLineWeight(2); 

plot OneSevenFive = 1.75;
OneSevenFive.SetDefaultColor(Color.LIGHT_GRAY);
OneSevenFive.SetStyle(Curve.MEDIUM_DASH);

plot OneSixTwoFive = 1.625;
OneSixTwoFive.SetDefaultColor(Color.LIGHT_GRAY);
OneSixTwoFive.SetStyle(Curve.MEDIUM_DASH);

plot OneFive = 1.5;
OneFive.SetDefaultColor(Color.LIGHT_GRAY);
OneFive.SetStyle(Curve.MEDIUM_DASH);

plot OneThreeSevenFive = 1.375;
OneThreeSevenFive.SetDefaultColor(Color.LIGHT_GRAY);
OneThreeSevenFive.SetStyle(Curve.MEDIUM_DASH);

plot OneTwoFive = 1.25;
OneTwoFive.SetDefaultColor(Color.LIGHT_GRAY);
OneTwoFive.SetStyle(Curve.MEDIUM_DASH);

plot OneOneTwoFive = 1.125;
OneOneTwoFive.SetDefaultColor(Color.LIGHT_GRAY);
OneOneTwoFive.SetStyle(Curve.MEDIUM_DASH);

plot One = 1;
One.SetDefaultColor(Color.LIGHT_GRAY);
One.SetStyle(Curve.MEDIUM_DASH);

plot ZeroEightSevenFive = 0.875;
ZeroEightSevenFive.SetDefaultColor(Color.LIGHT_GRAY);
ZeroEightSevenFive.SetStyle(Curve.MEDIUM_DASH);

plot ZeroSevenFive = 0.75;
ZeroSevenFive.SetDefaultColor(Color.LIGHT_GRAY);
ZeroSevenFive.SetStyle(Curve.MEDIUM_DASH);


