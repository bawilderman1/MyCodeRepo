declare upper;
declare hide_on_intraday;
declare once_per_bar;

#AddLabel(1, GetAggregationPeriod(), Color.GRAY);
input lookBackOffset = 10;
input showGap1 = yes;
input showGap2 = yes;
input showGap3 = yes;
input showLabel = no;

def Today = if GetDay() == GetLastDay() then 1 else 0;
def _bar = if isNaN(close) then _bar[1] else BarNumber();
def MaxBar = HighestAll(_bar);
AddLabel(showLabel, "MaxBar: "+MaxBar, Color.CYAN);

def inExtension = IsNaN(close);
def inLookBack = if !IsNaN(GetValue(close, -lookBackOffset)) && IsNaN(GetValue(close, -lookBackOffset - 1)) then 1
            else CompoundValue(1, inLookBack[1], 0);
#plot ilb = if inLookBack then BarNumber() - MaxBar else Double.NaN;
#ilb.SetPaintingStrategy(PaintingStrategy.VALUES_ABOVE);
#plot ilb2 = if inLookBack then BarNumber() else Double.NaN;
#ilb2.SetPaintingStrategy(PaintingStrategy.VALUES_BELOW);

def gapUp = open > high[1];
def gapDn = open < low[1];
def gap = gapUp or gapDn;

def recentGapUp = gapUp within 10 bars;
def gapUpLevel = 
    if inExtension then gapUpLevel[1]
    else if gapUp then close[1]
    else if !recentGapUp then Double.NaN
    else CompoundValue(1, gapUpLevel[1], Double.NaN);
#plot gapUpClose = if inLookBack or inExtension then gapUpLevel else Double.NaN;
#gapUpClose.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
#gapUpClose.SetDefaultColor(Color.CYAN);

def g1;
def g1UpDn;
def g1Edge;
def g1Bar;

def g2;
def g2UpDn;
def g2Edge;
def g2Bar;

def g3;
def g3UpDn;
def g3Edge;
def g3Bar;

if (gap) {
    g1 = close[1];
    g1UpDn = if gapUp then 1 else 0;
    g1Edge = if gapUp then high[1] else low[1];
    g1Bar = BarNumber();

    g2 = g1[1];
    g2UpDn = g1UpDn[1];
    g2Edge = g1Edge[1];
    g2Bar = g1Bar[1];

    g3 = g2[1];
    g3UpDn = g2UpDn[1];
    g3Edge = g2Edge[1];
    g3Bar = g2Bar[1];
} else {
    g1 = CompoundValue(1, g1[1], Double.NaN);
    g1UpDn = CompoundValue(1, g1UpDn[1], Double.NaN);
    g1Edge = CompoundValue(1, g1Edge[1], Double.NaN);
    g1Bar = CompoundValue(1, g1Bar[1], Double.NaN);

    g2 = CompoundValue(1, g2[1], Double.NaN);
    g2UpDn = CompoundValue(1, g2UpDn[1], Double.NaN);
    g2Edge = CompoundValue(1, g2Edge[1], Double.NaN);
    g2Bar = CompoundValue(1, g2Bar[1], Double.NaN);

    g3 = CompoundValue(1, g3[1], Double.NaN);
    g3UpDn = CompoundValue(1, g3UpDn[1], Double.NaN);
    g3Edge = CompoundValue(1, g3Edge[1], Double.NaN);
    g3Bar = CompoundValue(1, g3Bar[1], Double.NaN);
}

def forwardOffset = BarNumber() - MaxBar;
#forwardOffset.SetPaintingStrategy(PaintingStrategy.VALUES_ABOVE);

def currG1Bar = GetValue(g1Bar, forwardOffset) -1;
def currG1Start = if (MaxBar - currG1Bar) <= lookBackOffset then GetValue(g1, forwardOffset) else Double.NaN;
def currG1Edge = if (MaxBar - currG1Bar) <= lookBackOffset then GetValue(g1Edge, forwardOffset) else Double.NaN;
def currG1IsGapUp = GetValue(g1UpDn, forwardOffset);

def currG2Bar = GetValue(g2Bar, forwardOffset) -1;
def currG2Start = if (MaxBar - currG2Bar) <= lookBackOffset then GetValue(g2, forwardOffset) else Double.NaN;
def currG2Edge = if (MaxBar - currG2Bar) <= lookBackOffset then GetValue(g2Edge, forwardOffset) else Double.NaN;
def currG2IsGapUp = GetValue(g2UpDn, forwardOffset);

def currG3Bar = GetValue(g3Bar, forwardOffset) -1;
def currG3Start = if (MaxBar - currG3Bar) <= lookBackOffset then GetValue(g3, forwardOffset) else Double.NaN;
def currG3Edge = if (MaxBar - currG3Bar) <= lookBackOffset then GetValue(g3Edge, forwardOffset) else Double.NaN;
def currG3IsGapUp = GetValue(g3UpDn, forwardOffset);

plot Gap1Start = if showGap1 && !isNaN(g1) && BarNumber() >= currG1Bar then currG1Start else Double.NaN;
Gap1Start.SetStyle(Curve.SHORT_DASH);
Gap1Start.SetDefaultColor(Color.CYAN);
plot Gap1Edge = if showGap1 && !isNaN(g1) && BarNumber() >= currG1Bar then currG1Edge else Double.NaN;
Gap1Edge.SetStyle(Curve.SHORT_DASH);
Gap1Edge.AssignValueColor(if currG1IsGapUp then Color.GREEN else Color.RED);
AddCloud(Gap1Start, Gap1Edge, Color.Pink, Color.LIGHT_GREEN);

plot Gap2Start = if showGap2 && !isNaN(g2) && BarNumber() >= currG2Bar then currG2Start else Double.NaN;
Gap2Start.SetStyle(Curve.SHORT_DASH);
Gap2Start.SetDefaultColor(Color.CYAN);
plot Gap2Edge = if showGap2 && !isNaN(g2) && BarNumber() >= currG2Bar then currG2Edge else Double.NaN;
Gap2Edge.SetStyle(Curve.SHORT_DASH);
Gap2Edge.AssignValueColor(if currG2IsGapUp then Color.GREEN else Color.RED);
AddCloud(Gap2Start, Gap2Edge, Color.Pink, Color.LIGHT_GREEN);

plot Gap3Start = if showGap3 && !isNaN(g3) && BarNumber() >= currG3Bar then currG3Start else Double.NaN;
Gap3Start.SetStyle(Curve.SHORT_DASH);
Gap3Start.SetDefaultColor(Color.CYAN);
plot Gap3Edge = if showGap3 && !isNaN(g3) && BarNumber() >= currG3Bar then currG3Edge else Double.NaN;
Gap3Edge.SetStyle(Curve.SHORT_DASH);
Gap3Edge.AssignValueColor(if currG3IsGapUp then Color.GREEN else Color.RED);
AddCloud(Gap3Start, Gap3Edge, Color.Pink, Color.LIGHT_GREEN);

AddLabel(showLabel, "Gap1 Bar: "+g1Bar, Color.Gray);
AddLabel(showLabel, "Gap3 Bar: "+g2Bar, Color.Pink);
AddLabel(showLabel, "Gap3 Bar: "+g3Bar, Color.Lime);
