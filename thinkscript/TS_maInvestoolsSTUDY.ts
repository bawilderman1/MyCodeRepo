input price = close;
input length = 30;
input displace = 0;
input hideBuffer = no;

plot SMA = Average(price[-displace], length);
SMA.SetDefaultColor(color.dark_red);
sma.SetLineWeight(2);

plot arrowup = if price crosses above sma then (low - (price * .02)) else double.NaN;
plot ArrowDown = if price crosses below sma then (high + (price * .02)) else double.NaN;
ArrowUp.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ArrowDown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
arrowup.SetDefaultColor(color.dark_green);
arrowdown.setdefaultColor(color.red);

def upPct = sma * 1.1; 
def dnPct = sma * 0.9;
plot tenPctUp = if (price > upPct) then upPct else double.nan;
tenPctUp.setpaintingStrategy(paintingStrategy.DASHES);
tenPctUp.setdefaultColor(color.CYAN);
tenPctUp.SetLineWeight(2);
plot tenPctDn = if (price < dnPct) then dnPct else double.nan;
tenPctDn.setpaintingStrategy(paintingStrategy.DASHES);
tenPctDn.SetLineWeight(2);
tenPctDn.setdefaultColor(color.CYAN);

rec placeVal = if close crosses below sma then close * 0.97 else placeVal[1] ;
#rec placeVal = if close crosses below sma then close * 0.97 else placeVal[1] ;

plot buffer = if close < sma then placeVal else double.nan;
buffer.setdefaultColor(color.black);
buffer.setStyle(curve.short_DASH);
buffer.sethiding(hideBuffer);