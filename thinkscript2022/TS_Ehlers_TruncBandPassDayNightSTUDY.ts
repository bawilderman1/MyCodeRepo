script TruncatedBP {
    input Period = 20;
    input Bandwidth = 0.1;
    input Length = 10;
    input Price = Close;

    def L1 = Cos(2 * Double.Pi / (Period));
    def G1 = Cos(bandwidth * 2 * Double.Pi / (Period));
    def S1 = 1 / G1 - Sqrt(1 / Sqr(G1) - 1);

    def len = Length;
    def p = Price;

    def t24 = if len > 22 then .5*(1-S1)*(p[23]-p[25]) +L1*(1+S1)*0                           -S1*0                           else Double.NaN;
    def t23 = if len > 21 then .5*(1-S1)*(p[22]-p[24]) +L1*(1+S1)*(if len>23 then t24 else 0) -S1*0                           else Double.NaN;
    def t22 = if len > 20 then .5*(1-S1)*(p[21]-p[23]) +L1*(1+S1)*(if len>22 then t23 else 0) -S1*(if len>23 then t24 else 0) else Double.NaN;
    def t21 = if len > 19 then .5*(1-S1)*(p[20]-p[22]) +L1*(1+S1)*(if len>21 then t22 else 0) -S1*(if len>22 then t23 else 0) else Double.NaN;
    def t20 = if len > 18 then .5*(1-S1)*(p[19]-p[21]) +L1*(1+S1)*(if len>20 then t21 else 0) -S1*(if len>21 then t22 else 0) else Double.NaN;
    def t19 = if len > 17 then .5*(1-S1)*(p[18]-p[20]) +L1*(1+S1)*(if len>19 then t20 else 0) -S1*(if len>20 then t21 else 0) else Double.NaN;
    def t18 = if len > 16 then .5*(1-S1)*(p[17]-p[19]) +L1*(1+S1)*(if len>18 then t19 else 0) -S1*(if len>19 then t20 else 0) else Double.NaN;
    def t17 = if len > 15 then .5*(1-S1)*(p[16]-p[18]) +L1*(1+S1)*(if len>17 then t18 else 0) -S1*(if len>18 then t19 else 0) else Double.NaN;
    def t16 = if len > 14 then .5*(1-S1)*(p[15]-p[17]) +L1*(1+S1)*(if len>16 then t17 else 0) -S1*(if len>17 then t18 else 0) else Double.NaN;
    def t15 = if len > 13 then .5*(1-S1)*(p[14]-p[16]) +L1*(1+S1)*(if len>15 then t16 else 0) -S1*(if len>16 then t17 else 0) else Double.NaN;
    def t14 = if len > 12 then .5*(1-S1)*(p[13]-p[15]) +L1*(1+S1)*(if len>14 then t15 else 0) -S1*(if len>15 then t16 else 0) else Double.NaN;
    def t13 = if len > 11 then .5*(1-S1)*(p[12]-p[14]) +L1*(1+S1)*(if len>13 then t14 else 0) -S1*(if len>14 then t15 else 0) else Double.NaN;
    def t12 = if len > 10 then .5*(1-S1)*(p[11]-p[13]) +L1*(1+S1)*(if len>12 then t13 else 0) -S1*(if len>13 then t14 else 0) else Double.NaN;
    def t11 = if len >  9 then .5*(1-S1)*(p[10]-p[12]) +L1*(1+S1)*(if len>11 then t12 else 0) -S1*(if len>12 then t13 else 0) else Double.NaN;
    def t10 = if len >  8 then .5*(1-S1)*(p[9]-p[11])  +L1*(1+S1)*(if len>10 then t11 else 0) -S1*(if len>11 then t12 else 0) else Double.NaN;
    def t9 =  if len >  7 then .5*(1-S1)*(p[8]-p[10])  +L1*(1+S1)*(if len>9 then t10 else 0)  -S1*(if len>10 then t11 else 0) else Double.NaN;
    def t8 =  if len >  6 then .5*(1-S1)*(p[7]-p[9])   +L1*(1+S1)*(if len>8 then t9 else 0)   -S1*(if len>9 then t10 else 0)  else Double.NaN;
    def t7 =  if len >  5 then .5*(1-S1)*(p[6]-p[8])   +L1*(1+S1)*(if len>7 then t8 else 0)   -S1*(if len>8 then t9 else 0)   else Double.NaN;
    def t6 =                   .5*(1-S1)*(p[5]-p[7])   +L1*(1+S1)*(if len>6 then t7 else 0)   -S1*(if len>7 then t8 else 0);
    def t5 =                   .5*(1-S1)*(p[4]-p[6])   +L1*(1+S1)*(if len>5 then t6 else 0)   -S1*(if len>6 then t7 else 0);
    def t4 =                   .5*(1-S1)*(p[3]-p[5])   +L1*(1+S1)*t5                          -S1*(if len>5 then t6 else 0);
    def t3 =                   .5*(1-S1)*(p[2]-p[4])   +L1*(1+S1)*t4                          -S1*t5;
    def t2 =                   .5*(1-S1)*(p[1]-p[3])   +L1*(1+S1)*t3                          -S1*t4;
    def t1 =                   .5*(1-S1)*(p[0]-p[2])   +L1*(1+S1)*t2                          -S1*t3;

    plot BPT = t1;
}
script AutoGainCtrl {
    input BpType = { default BP, TruncBP };
    input Period = 20;
    input Bandwidth = 0.1;
    input Length = 10;
    input Price = Close;

    def bpValue;
    switch (BpType) {
        Case TruncBP:
        bpValue = TruncatedBP(Period, Bandwidth, Length, Price).BPT;
        default:
        bpValue = BandPassFilter(Period, Bandwidth, 1).BandPassFilter;
    }

    def peak = CompoundValue(1, if AbsValue(bpValue) > (0.991*peak[1]) then AbsValue(bpValue) else 0.991*peak[1], 0);

    plot Normalized = if peak <> 0 then bpValue/peak else Double.NaN;
}

declare lower;

input Period = 20;
input Bandwidth = 0.1;
input Length = 10;
input Normalize = no;

Assert(Length >= 5, "Length minimum is 5");
Assert(Length <= 24, "Length maximum is 24");
Assert(Period >= 10, "Period minimum is 10");
Assert(Period <= 48, "Period maximum is 48");

def _day = CompoundValue(1, _day[1] + (close - open) , 0);
def _night = CompoundValue(1, _night[1] + (open - close[1]) , 0);

def _bpt1 = TruncatedBP(Period, Bandwidth, Length, _day).BPT;
plot BPT1 = if Normalize then AutoGainCtrl(1, Period, Bandwidth, Length, _day).Normalized else _bpt1;
BPT1.SetDefaultColor(Color.ORANGE);
AddVerticalLine(BPT1[1] <= BPT1[2] && BPT1 > BPT1[1], "BPT1U", Color.ORANGE, Curve.Firm);
AddVerticalLine(BPT1[1] >= BPT1[2] && BPT1 < BPT1[1], "BPT1D", Color.ORANGE, Curve.FIRM);

AddLabel(1, "Day", Color.ORANGE);

def _bpt2 = TruncatedBP(Period, Bandwidth, Length, _night).BPT;
plot BPT2 = if Normalize then AutoGainCtrl(1, Period, Bandwidth, Length, _night).Normalized else _bpt2;
BPT2.SetDefaultColor(GetColor(1));
AddVerticalLine(BPT2[1] <= BPT2[2] && BPT2 > BPT2[1], "BPT2U", GetColor(1), Curve.MEDIUM_DASH);
AddVerticalLine(BPT2[1] >= BPT2[2] && BPT2 < BPT2[1], "BPT2D", GetColor(1), Curve.MEDIUM_DASH);

AddLabel(1, "Night", GetColor(1));

plot Zero = 0;
Zero.SetDefaultColor(GetColor(3));

plot PO = if (normalize) then 1 else Double.NaN;
PO.SetDefaultColor(GetColor(3));
PO.SetStyle(Curve.SHORT_DASH);

plot MO = if (normalize) then -1 else Double.NaN;
MO.SetDefaultColor(GetColor(3));
MO.SetStyle(Curve.SHORT_DASH);
