declare upper;
DefineGlobalColor("bold", CreateColor(255, 126, 0));

#def condHi = if close(symbol) between -1250 and 1250 then high(symbol) else Double.NaN;
#def condLo = if close(symbol) between -1250 and 1250 then low(symbol) else Double.NaN;
#AddChart(high = condHi, low  = condLo, open = Double.NaN, close = Double.NaN, type = type , Color.CYAN);

def isUp = close > high[1];
def UpClose = if isUp 
    and (if !IsNaN(close[-1]) then !isUp[-1] else 1) 
    and (if !IsNaN(close[-2]) then !isUp[-2] else 1) 
    and (if !IsNaN(close[-3]) then !isUp[-3] else 1) 
    then close else Double.NaN;
#Up.SetPaintingStrategy(PaintingStrategy.POINTS);
#Up.SetDefaultColor(GlobalColor("bold"));

def UpHigh = if isUp 
    and (if !IsNaN(close[-1]) then !isUp[-1] else 1) 
    and (if !IsNaN(close[-2]) then !isUp[-2] else 1) 
    and (if !IsNaN(close[-3]) then !isUp[-3] else 1) 
    then Max(high[1], low) else Double.NaN;

AddChart(high = UpClose, low  = UpHigh, open = UpClose, close = UpClose, type = ChartType.BAR , GlobalColor("bold"));

def isDn = close < low[1];
def DownClose = if isDn 
    and (if !IsNaN(close[-1]) then !isDn[-1] else 1) 
    and (if !IsNaN(close[-2]) then !isDn[-2] else 1) 
    and (if !IsNaN(close[-3]) then !isDn[-3] else 1) 
    then close else Double.NaN;
#Down.SetPaintingStrategy(PaintingStrategy.POINTS);
#Down.SetDefaultColor(GlobalColor("bold"));

def DownLow = if isDn 
    and (if !IsNaN(close[-1]) then !isDn[-1] else 1) 
    and (if !IsNaN(close[-2]) then !isDn[-2] else 1) 
    and (if !IsNaN(close[-3]) then !isDn[-3] else 1) 
    then Min(low[1], high) else Double.NaN;

AddChart(high = DownLow, low  = DownClose, open = DownClose, close = DownClose, type = ChartType.BAR , GlobalColor("bold"));
