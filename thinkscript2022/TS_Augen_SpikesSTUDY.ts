DefineGlobalColor("mediumBlue", CreateColor(114, 158, 206));
DefineGlobalColor("mediumYellow", CreateColor(255,221,113));

declare lower;

input Length = 20;
input Threshold = 1.75;
input ShowHL = no;
input ThresholdHL = 1;

AddVerticalLine(
    GetAggregationPeriod() < AggregationPeriod.DAY and GetDay() != GetDay()[1], 
    "", 
    GetColor(7), 
    Curve.SHORT_DASH);

def prev;
if (GetAggregationPeriod() < AggregationPeriod.DAY and GetDay() != GetDay()[1]) {
    prev = GetValue(open, 0);
}
else {
    prev = GetValue(close, 1);
}

def curr = GetValue(close, 0);

def logChg = Round(Log(curr / prev), 4);

def stDevC = Round(StDev(logChg, Length), 4);

plot Spike = Round(logChg / GetValue(stDevC, 2), 3);
Spike.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Spike.DefineColor("UpSpike", GlobalColor("mediumYellow"));
Spike.DefineColor("DownSpike", GlobalColor("mediumYellow"));
Spike.AssignValueColor(if Spike >= Threshold then Spike.Color("UpSpike") else if Spike <= -Threshold then Spike.Color("DownSpike") else GetColor(7));

plot Zero = 0;
Zero.SetDefaultColor(GetColor(7));

def logLow = Round(Log(GetValue(Low, 0) / prev), 4);
def lowSpike = Round(logLow / GetValue(stDevC, 2), 3);
plot SpikeL = if ShowHL and lowSpike < -ThresholdHL then lowSpike else Double.NaN;
SpikeL.SetPaintingStrategy(PaintingStrategy.DASHES);
SpikeL.DefineColor("Enhance", GlobalColor("mediumBlue"));
SpikeL.AssignValueColor(if SpikeL < -ThresholdHL then SpikeL.Color("Enhance") else GetColor(7));

def logHigh = Round(Log(GetValue(High, 0) / prev), 4);
def highSpike = Round(logHigh / GetValue(stDevC, 2), 3);
plot SpikeH = if ShowHL and highSpike > ThresholdHL then highSpike else Double.NaN;
SpikeH.SetPaintingStrategy(PaintingStrategy.DASHES);
SpikeH.DefineColor("Enhance", GlobalColor("mediumBlue"));
SpikeH.AssignValueColor(if SpikeH > ThresholdHL then SpikeH.Color("Enhance") else GetColor(7));
