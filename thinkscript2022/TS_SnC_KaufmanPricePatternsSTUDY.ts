declare lower;

input pattern = {default "Key Reversal", "Island Reversal", "Outside Day", "Wide-ranging Day", Compression, "Gap Opening"};
input direction = {default Bullish, Bearish};
input useTrendFilter = no;
input investment = 10000;

def tr = TrueRange(high, close, low);
def atr = WildersAverage(tr, 20);
def hh = Highest(high[1], 3);
def ll = Lowest(low[1], 3);
def avg = Average(close, 80);
def cond;
switch (pattern) {
case "Key Reversal":
    if (direction == direction.Bearish) {
        cond = high > high[1] and close < low[1];
    } else {
        cond = low < low[1] and close > high[1];
    }
case "Island Reversal":
    if (direction == direction.Bearish) {
        cond = low > high[1] and close < open;
    } else {
        cond = high < low[1] and close > open;
    }
case "Outside Day":
    if (direction == direction.Bearish) {
        cond = high > high[1] and low < low[1] and close < 0.25 * (high - low) + low;
    } else {
        cond = high > high[1] and low < low[1] and close > 0.75 * (high - low) + low;
    }
case "Wide-ranging Day":
    if (direction == direction.Bearish) {
        cond = high > high[1] and low < low[1] and close < 0.25 * (high - low) + low and tr > 1.5 * atr;
    } else {
        cond = high > high[1] and low < low[1] and close > 0.75 * (high - low) + low and tr > 1.5 * atr;
    }
case "Compression":
    if (direction == direction.Bearish) {
        cond = tr[1] < tr[4] and tr[2] < tr[4] and tr[3] < tr[4] and close < ll;
    } else {
        cond =  tr[1] < tr[4] and tr[2] < tr[4] and tr[3] < tr[4] and close > hh;
    }
case "Gap Opening":
    if (direction == direction.Bearish) {
        cond = (close[1] - open) > 0.5 * atr[1];
    } else {
        cond = (open - close[1]) > 0.5 * atr[1];
    }
}
def finalCond = cond and Sum(cond[1], 5) == 0 and if !useTrendFilter then yes else if direction == direction.Bearish then avg < avg[1] else avg > avg[1];
def cases = if finalCond then cases[1] + 1 else cases[1];
def size;
switch (direction) {
case "Bearish":
    size = investment / close;
case "Bullish":
    size = -investment / close;
}
def pl1 = if finalCond[1] then pl1[1] + size[1] * (close[1] - close) else pl1[1];
def pl2 = if finalCond[2] then pl2[1] + size[2] * (close[2] - close) else pl2[1];
def pl3 = if finalCond[3] then pl3[1] + size[3] * (close[3] - close) else pl3[1];
def pl4 = if finalCond[4] then pl4[1] + size[4] * (close[4] - close) else pl4[1];
def pl5 = if finalCond[5] then pl5[1] + size[5] * (close[5] - close) else pl5[1];

plot ReturnsDay1 = pl1;
plot ReturnsDay2 = pl2;
plot ReturnsDay3 = pl3;
plot ReturnsDay4 = pl4;
plot ReturnsDay5 = pl5;
plot ZeroLine = 0;

ReturnsDay1.SetDefaultColor(GetColor(0));
ReturnsDay2.SetDefaultColor(GetColor(1));
ReturnsDay3.SetDefaultColor(GetColor(2));
ReturnsDay4.SetDefaultColor(GetColor(3));
ReturnsDay5.SetDefaultColor(GetColor(4));
ZeroLine.SetDefaultColor(GetColor(7));

def lastBar = !IsNaN(close) and IsNaN(close[-1]);

AddChartBubble(lastBar, pl1, "D1", ReturnsDay1.TakeValueColor());
AddChartBubble(lastBar, pl2, "D2", ReturnsDay2.TakeValueColor());
AddChartBubble(lastBar, pl3, "D3", ReturnsDay3.TakeValueColor());
AddChartBubble(lastBar, pl4, "D4", ReturnsDay4.TakeValueColor());
AddChartBubble(lastBar, pl5, "D5", ReturnsDay5.TakeValueColor());

AddLabel(yes, "Pattern: " + pattern, Color.GRAY);
AddLabel(yes, "Direction: " + direction, if direction == direction.Bearish then Color.DOWNTICK else Color.UPTICK);
AddLabel(yes, "Cases: " + cases, Color.GRAY);

