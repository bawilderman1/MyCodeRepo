declare lower;
AssignBackgroundColor(createColor(223,223,223));

input aveLength = 20;

plot vol = volume;
vol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
vol.SetLineWeight(4);

plot aveVol = Average(vol, aveLength);
aveVol.SetPaintingStrategy(PaintingStrategy.LINE);
aveVol.SetDefaultColor(Color.BLUE);
aveVol.SetLineWeight(2);

#Heikin Ashi
def haClose = ((open[0] + high[0] + low[0] + close[0]) / 4);
rec haOpen = if !IsNaN(haOpen[1]) then ((haOpen[1] + haClose[1]) / 2) else open + close / 2;
def haHigh = if high > haOpen && high > haClose then high
    else if haOpen > high && haOpen > haClose then haOpen
    else haClose;
def haLow = if low < haOpen && low < haClose then low
    else if haOpen < low && haOpen < haClose then haOpen
    else haClose;

#SLM Ribbons
def SLMsuperFastMA = ExpAverage(haClose, 8);
def SLMfastMA = ExpAverage(haClose, 13);
def SLMslowMA = ExpAverage(haClose, 21);

vol.AssignValueColor(if SLMsuperFastMA > SLMfastMA && SLMfastMA > SLMslowMA then Color.UPTICK
    else if SLMsuperFastMA < SLMfastMA && SLMfastMA < SLMslowMA then color.downtick
    else Color.GRAY);

#color the volume bars
plot zeroLine = if !IsNaN(close) then 0 else double.nan;
    zeroLine.setDefaultColor(color.black);

###########################################
#above 1.5 ave volume
def upPct = aveVol * 1.5;

plot tenPctUp = if (vol > upPct) then upPct else Double.NaN;
tenPctUp.SetPaintingStrategy(PaintingStrategy.TRIANGLES);
tenPctUp.SetDefaultColor(Color.CYAN);
tenPctUp.SetLineWeight(2);