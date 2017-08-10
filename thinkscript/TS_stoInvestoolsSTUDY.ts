declare lower;
declare all_for_one;

input over_bought = 75;
input over_sold = 25;
input KPeriod = 14;
input DPeriod = 5;
input priceH = high;
input priceL = low;
input priceC = close;
input smoothingType = {default EMA, SMA};
input hideSArrows = no;
input hideWArrows = yes;
input hideMidLine = yes;

def SlowK = reference StochasticFull(over_bought, over_sold, KPeriod, DPeriod, priceH, priceL, priceC, 3, smoothingType).FullK;
#SlowK.SetDefaultColor(GetColor(5));

plot SlowD = reference StochasticFull(over_bought, over_sold, KPeriod, DPeriod, priceH, priceL, priceC, 3, smoothingType).FullD;
SlowD.SetDefaultColor(color.black);

plot OverBought = over_bought;
OverBought.SetDefaultColor(color.black);
OverBought.SetLineWeight(1);

plot OverSold = over_sold;
OverSold.SetDefaultColor(color.black);
OverSold.SetLineWeight(1);

plot midLine = 50;
midLine.SetDefaultColor(color.black);
midLine.SetLineWeight(1);
midLine.setstyle(curve.medium_dash);

assignBackgroundColor(CreateColor(240, 240, 240));
AddCloud(SlowD, OverBought, color.green, color2 = CreateColor(240, 240, 240)); #color1 green
AddCloud(data1 = SlowD, data2 = OverSold, CreateColor(240, 240, 240), color.red); #color2 red

plot sArrowup = if slowd crosses above oversold then 25 else double.NaN;
plot sArrowDown = if slowd crosses below overbought then 75 else double.NaN;
sArrowUp.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
sArrowDown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
sArrowup.SetDefaultColor(color.dark_green);
sArrowdown.SetDefaultColor(color.red);

slowd.SetPaintingStrategy(PaintingStrategy.LINE);
slowd.SetLineWeight(2);
slowd.DefineColor("Positive and Up", CreateColor(62, 193, 7));
slowd.DefineColor("Above Overbought", color.dark_green);
slowd.DefineColor("Negative and Down", Color.RED);
slowd.DefineColor("Below Oversold", CreateColor(203, 2, 2));
slowd.defineColor("default", color.black);
slowd.AssignValueColor(if slowd > oversold and slowd < overbought then if slowd[1] < slowd then slowd.color("Positive and Up") else slowd.color("Negative and down") else if slowd >= overbought then slowd.color("Above overbought") else if slowd <= oversold then slowd.color("Below Oversold") else slowd.color("default"));

plot wArrowup = if slowd crosses above midLine then 49 else double.NaN;
plot wArrowDown = if slowd crosses below midline then 51 else double.NaN;
wArrowUp.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
wArrowDown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
wArrowup.SetDefaultColor(color.yellow);
wArrowdown.SetDefaultColor(color.yellow);

def Hide1 =  if hideSArrows == yes then yes else no;
sArrowup.SetHiding(Hide1);
sArrowdown.SetHiding(Hide1);

def Hide2 =  if hideWArrows == yes then yes else no;
wArrowup.SetHiding(Hide2);
wArrowdown.SetHiding(Hide2);

def Hide3 =  if hideMidLine == yes then yes else no;
midLine.SetHiding(Hide3);


