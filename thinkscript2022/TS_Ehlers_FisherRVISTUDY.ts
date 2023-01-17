script CyclePeriod {
    input Price = HL2;
    input Alpha = 0.07;

    def instPeriod;

    def  smooth = (Price + 2 * Price[1] + 2 * Price[2] + Price[3]) / 6;
    def cycle = if BarNumber() < 7 then (Price - 2 * Price[1] + Price[2]) / 4 
else (1 - 0.5 * Alpha) * (1 - 0.5 * Alpha) * (smooth - 2 * smooth[1] + smooth[2]) + 2 * (1 - Alpha) * cycle[1] - (1 - Alpha) * (1 - Alpha) * cycle[2];

    def q1 = (0.0962 * cycle + 0.5769 * cycle[2] - 0.5769 * cycle[4] - 0.0962 * cycle[6]) * (0.5 + 0.08 * CompoundValue(1, instPeriod[1], 0));

    def i1 = cycle[3];

    def dp = if q1 <> 0 and q1[1] <> 0 then (i1 / q1 - i1[1] / q1[1]) / (1 + i1 * i1[1] / (q1 * q1[1])) else 0;
    def deltaPhase = if dp < 0.1 then 0.1 else if dp > 1.1 then 1.1 else dp;

    def medianDelta = Median(deltaPhase, 5);
    def dc = if medianDelta == 0 then 15 else 6.28318 / medianDelta + 0.5;

    instPeriod = CompoundValue(1, 0.33 * dc + 0.67 * instPeriod[1], 0);
    def p = CompoundValue(1, 0.15 * instPeriod + 0.85 * p[1], 0);

    plot Period = p;
}
script TriMA4 {
    input Data = close;

    plot MA = (Data + 2 * Data[1] + 2 * Data[2] + Data[3]) / 6; 
}
script RviCalc {
    input Length = 8;

    def intradayRng = close - open;
    def dayRng = high - low;

    def value1 = TriMA4(intradayRng);
    def value2 = TriMA4(dayRng);

    def num = fold i = 0 to Length - 1
          with n = 0
          do n + GetValue(value1, i, 100);

    def denom = fold j = 0 to Length - 1
          with d = 0
          do d + GetValue(value2, j, 100);

    plot RVI = if (denom != 0) then num / denom else 0;
    plot Signal = (RVI + 2 * RVI[1] + 2 * RVI[2] + RVI[3]) / 6;
}
script AdaptRviCalc {
    def intradayRng = close - open;
    def dayRng = high - low;

    def value1 = TriMA4(intradayRng);
    def value2 = TriMA4(dayRng);

    def calcLength = Round(CyclePeriod(HL2, 0.07).Period / 2, 0);
    
    #Set min Bounds between 7 and 25
    def length = Min(Max(calcLength, 7), 25);

    def num;
    def denom;
    
    if (length == 7) {
        num = Sum(value1, 7);
        denom = Sum(value2, 7);
    }
    else if (length == 8) {
        num = Sum(value1, 8);
        denom = Sum(value2, 8);
    }
    else if (length == 9) {
        num = Sum(value1, 9);
        denom = Sum(value2, 9);
    }
    else if (length == 10) {
        num = Sum(value1, 10);
        denom = Sum(value2, 10);
    }
    else if (length == 11) {
        num = Sum(value1, 11);
        denom = Sum(value2, 11);
    }
    else if (length == 12) {
        num = Sum(value1, 12);
        denom = Sum(value2, 12);
    }
    else if (length == 13) {
        num = Sum(value1, 13);
        denom = Sum(value2, 13);
    }
    else if (length == 14) {
        num = Sum(value1, 14);
        denom = Sum(value2, 14);
    }
    else if (length == 15) {
        num = Sum(value1, 15);
        denom = Sum(value2, 15);
    }
    else if (length == 16) {
        num = Sum(value1, 16);
        denom = Sum(value2, 16);
    }
    else if (length == 17) {
        num = Sum(value1, 17);
        denom = Sum(value2, 17);
    }
    else if (length == 18) {
        num = Sum(value1, 18);
        denom = Sum(value2, 18);
    }
    else if (length == 19) {
        num = Sum(value1, 19);
        denom = Sum(value2, 19);
    }
    else if (length == 20) {
        num = Sum(value1, 20);
        denom = Sum(value2, 20);
    }
    else if (length == 21) {
        num = Sum(value1, 21);
        denom = Sum(value2, 21);
    }
    else if (length == 22) {
        num = Sum(value1, 22);
        denom = Sum(value2, 22);
    }
    else if (length == 23) {
        num = Sum(value1, 23);
        denom = Sum(value2, 23);
    }
    else if (length == 24) {
        num = Sum(value1, 24);
        denom = Sum(value2, 24);
    }
    else if (length == 25) {
        num = Sum(value1, 25);
        denom = Sum(value2, 25);
    }
    else {
        num = 0;
        denom = 0;
    }

    plot RVI = if (denom != 0) then num / denom else 0;
    plot Signal = (RVI + 2 * RVI[1] + 2 * RVI[2] + RVI[3]) / 6;
}
script StochCalc {
    input Data = close;
    input Length = 8;

    def maxData = Highest(Data, Length);
    def minData = Lowest(Data, Length);

    def output = if 
        maxData <> minData 
        then (Data-minData)/(maxData-minData) 
        else 0;
    plot Stochastic = output;
}
script FisherCalc {
    input Data = close;
    
    plot Fisher = 0.5*Log((1+1.98*(Data-0.5))/(1-1.98*(Data-0.5)));
}

declare lower;

input AdaptiveLength = no;
input Length = 8;

def rvi = if AdaptiveLength == no then RviCalc(Length).RVI else AdaptRviCalc().RVI;
def stochRvi = StochCalc(rvi, Length);
def wmaRvi = WMA(stochRvi, 4);
def fishRvi = FisherCalc(wmaRvi);

plot FisherRVI = if !IsNaN(close) then fishRvi else Double.NaN;

plot Trigger = if !IsNaN(close) then FisherRvi[1] else Double.NaN;
#plot Trigger = TriMA4(fishRvi);

plot Zero = 0;
Zero.SetDefaultColor(GetColor(3));
plot UpTwo = 2;
UpTwo.SetDefaultColor(GetColor(3));
UpTwo.SetStyle(Curve.MEDIUM_DASH);
plot DnTwo = -2;
DnTwo.SetDefaultColor(GetColor(3));
DnTwo.SetStyle(Curve.MEDIUM_DASH);

plot SellSignal = if (FisherRVI[1] >= Trigger[1] and FisherRVI < Trigger) then FisherRVI else Double.NaN;
SellSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
SellSignal.SetDefaultColor(GetColor(3));

plot BuySignal = if (FisherRVI[1] <= Trigger[1] and FisherRVI > Trigger) then FisherRVI else Double.NaN;
BuySignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
BuySignal.SetDefaultColor(GetColor(3));

