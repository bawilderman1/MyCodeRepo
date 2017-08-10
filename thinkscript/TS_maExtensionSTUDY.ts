#########################
# sdi_ma: Small Dog Investor Moving Average
#
#hint: Displays a moving average with some additional signals. In the default configuration, when the MA is trending, as defined by 30 consecutive up/down moves, OR the MA is more than 5% away from the MA 30 bars prior then the MA appears in red. When the moving average is nontrending and within 5% of the value 30 bars prior then the MA appears in orange. When price is more than 10% away from the MA, the MA line is decorated with hot pink triangles. In the right extension we show a straight line projection taken from the last two bars. Version: 1.1
#
# source: smalldoginvestor.blogspot.com
# author: allen everhart 8/4/2011
# revised: 8/21/2011 added price data series selection.
#
# copylefts reserved. This is free software. That means you are free
# to use or modify it for your own usage but not for resale.
# Help me get the word out about my blog by keeping this header
# in place. 

#hint price: Choose data series to average over.
input price = close;
#def price = close;
#hint type: Choose between Simple and Exponential Moving Average.
input type = { default EXP, SMP } ;
#hint length: Number of bars in moving average.
input length = 30 ;
#hint flatPct: Main criteria for color-coded trend changes.
input flatPct = 5.0 ;
#hint compLength: Number of consecutive up/down bars to use as the secondary criteria for color-coded trend changes.
input compLength = 30 ;
#hint hotPct: Criteria for the hot decoration.
input hotPct = 10.0 ;

def ma =
  if type == type.SMP then
    simpleMovingAvg(price, length)
  else
    movAvgExponential(price, length)
;
rec maUpBars =
  if ma > ma[1] then
    maUpBars[1] + 1
  else if ma == ma[1] then
    maUpBars[1]
  else
    0
;
#plot up = maUpBars ; # diagnostics
rec maDnBars =
  if ma < ma[1] then
    maDnBars [1] + 1
  else if ma == ma[1] then
    maDnBars[1]
  else
    0
;
#plot dn = maDnBars ; # diagnostics
plot steep =
 if AbsValue(100 * ((ma / ma[compLength]) - 1)) >= flatPct then
    ma
 else if maUpBars >= compLength then
    ma
 else if maDnBars >= compLength then
    ma
 else
    double.NaN
;
steep.SetDefaultColor( color.RED);
steep.SetLineWeight(2) ;
plot flat =
 if AbsValue(100 * ((ma / ma[compLength]) - 1)) < flatPct then
    ma
 else if maUpBars < compLength then
    ma
 else if maDnBars < compLength then
    ma
 else
    double.NaN
;
flat.SetDefaultColor( color.ORANGE);
flat.SetLineWeight(2) ;

#plot pct =100 * ((ma / ma[compLength]) - 1);
#plot bkma =  ma[compLength] ;
plot hot =
 if AbsValue( 100 * ((price / ma) - 1) ) > hotPct then
    ma
 else
    double.NaN
;
hot.setDefaultColor( color.MAGENTA);
hot.setPaintingStrategy(paintingStrategy.LINE_VS_TRIANGLES);
rec slope =
  if isnaN(close) and !isnaN(close[1]) then
    ma[1]-ma[2]
  else if isnaN(close) and isnaN(close[1]) then
    slope[1]
  else
    double.NaN
;
rec extrec =
  if !isnaN(slope) and isnaN(slope[1]) then
    ma[1]+slope
  else if !isnaN(slope) then
    extrec[1]+ slope
  else
    double.NaN
;
plot ext = extrec ;
ext.setDefaultColor(color.RED);
ext.setStyle( curve.SHORT_DASH);

plot arrowup = if price crosses above ma then (ma - (price * .025)) else double.NaN;
plot ArrowDown = if price crosses below ma then (ma + (price * .025)) else double.NaN;
ArrowUp.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ArrowDown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
arrowup.SetDefaultColor(color.dark_green);
arrowdown.setdefaultColor(color.red);

