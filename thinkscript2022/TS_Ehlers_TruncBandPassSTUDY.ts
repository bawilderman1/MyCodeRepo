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
input Price = Close;
input ShowBP = yes;
input ShowBPT = yes;
input Normalize = no;
input Predictive = yes;

Assert(Length >= 5, "Length minimum is 5");
Assert(Length <= 24, "Length maximum is 24");
Assert(Period >= 10, "Period minimum is 10");
Assert(Period <= 48, "Period maximum is 48");

def alpha2 = (Cos(1.5*Bandwidth*2*Double.Pi/Period) + Sin(1.5*Bandwidth*2*Double.Pi/Period)-1) / Cos(1.5*Bandwidth*2*Double.Pi/Period);

def _bp = if !IsNaN(close) then BandPassFilter(Period, Bandwidth, 1).BandPassFilter else Double.NaN;
plot BP = if ShowBP then 
    (if Normalize and !IsNaN(close) then AutoGainCtrl(0, Period, Bandwidth, Length, Price).Normalized else _bp)
    else Double.NaN;
BP.SetDefaultColor(GetColor(1));
AddVerticalLine(BP[1] <= BP[2] && BP > BP[1], "BPU", GetColor(1), Curve.Firm);
AddVerticalLine(BP[1] >= BP[2] && BP < BP[1], "BPD", GetColor(1), Curve.FIRM);

def _bpPredictive = (1 + alpha2 / 2)*(BP - BP[1]) + (1 - alpha2) * _bpPredictive[1];
plot BPPred = if Predictive then _bpPredictive else Double.NaN;
BPPred.SetDefaultColor(GetColor(1));
BPPred.SetStyle(Curve.MEDIUM_DASH);
AddVerticalLine(BPPred[1] <= BPPred[2] && BPPred > BPPred[1], "BPPU", GetColor(1), Curve.MEDIUM_DASH);
AddVerticalLine(BPPred[1] >= BPPred[2] && BPPred < BPPred[1], "BPPD", GetColor(1), Curve.MEDIUM_DASH);

def _bpt = TruncatedBP(Period, Bandwidth, Length, Price).BPT;
plot BPT = if ShowBPT then 
    (if Normalize then AutoGainCtrl(1, Period, Bandwidth, Length, Price).Normalized else _bpt)
    else Double.NaN;
BPT.SetDefaultColor(GetColor(2));
AddVerticalLine(BPT[1] <= BPT[2] && BPT > BPT[1], "BPTU", GetColor(2), Curve.Firm);
AddVerticalLine(BPT[1] >= BPT[2] && BPT < BPT[1], "BPTD", GetColor(2), Curve.FIRM);

############################################################
def BptRms = Sqrt(Average(Sqr(BPT), Length));
plot "+BptRms" = BptRms;
plot "-BptRms" = -BptRms;

"+BptRms".SetDefaultColor(GetColor(4));
"-BptRms".SetDefaultColor(GetColor(4));
############################################################

def _bptPredictive = (1 + alpha2 / 2)*(BPT - BPT[1]) + (1 - alpha2) * _bptPredictive[1];
plot BPTPred = if Predictive then _bptPredictive else Double.NaN;
BPTPred.SetDefaultColor(GetColor(2));
BPTPred.SetStyle(Curve.MEDIUM_DASH);
AddVerticalLine(BPTPred[1] <= BPTPred[2] && BPTPred > BPTPred[1], "BPTPU", GetColor(2), Curve.MEDIUM_DASH);
AddVerticalLine(BPTPred[1] >= BPTPred[2] && BPTPred < BPTPred[1], "BPTPD", GetColor(2), Curve.MEDIUM_DASH);

plot Zero = 0;
Zero.SetDefaultColor(GetColor(3));

plot PO = if (normalize) then 1 else Double.NaN;
PO.SetDefaultColor(GetColor(3));
PO.SetStyle(Curve.SHORT_DASH);

plot MO = if (normalize) then -1 else Double.NaN;
MO.SetDefaultColor(GetColor(3));
MO.SetStyle(Curve.SHORT_DASH);
