#############################
# sdi_rbproj
#hint: RangeBarPROJector projects where the forming range-bar will close to the up and downside. Revision 1.0 http://www.smallDogInvestor.com
# author: allen everhart
# date: 12/31/2011
# Copyleft! This is free software. That means you are free
# to use or modify it for your own usage but not for resale.
# Help me get the word out about my blog by keeping this header
# in place.
input sideline = yes;
#hint sideline: Yes, plots the projections as lines in the right-expansion area, No plots the projections as up/down arrows on top/bottom of the forming bar.
def barSizes = high-low;
def bs=highestAll(barSizes);
rec rbHi =
  if isnaN(close) && sideline then rbHi[1]
  else if !isNaN(close) && isNan(close[-1]) then low+bs 
  else double.NaN;
rec rbLo =
  if isnaN(close) && sideline then rbLo[1]
  else if !isNaN(close) && isNan(close[-1]) then high-bs
  else double.NaN;
plot phi = rbHi;
plot plo = rbLo;
phi.setPaintingStrategy(
  if sideline then PaintingStrategy.LINE
  else PaintingStrategy.ARROW_DOWN
);
plo.setPaintingStrategy(
  if sideline then PaintingStrategy.LINE
  else PaintingStrategy.ARROW_UP
);
phi.setStyle(Curve.MEDIUM_DASH);
plo.setStyle(Curve.MEDIUM_DASH);
phi.setDefaultColor(color.MAGENTA);
plo.setDefaultColor(color.MAGENTA);
###########################################