declare lower;
def upper = no;
input hidecumtick = yes;
input symbol = "$TICK";
input period = 20;
input smooth = 5;
input lookback = 4;
input filter = 300;
def p = period;
def i = barNumber();
def na = double.nan;
#input usetrend = {"No", default "Yes"};
def usetrend = yes;
#rec htick = if IsNaN(high(symbol)) then htick[1] else high("$TICK") ;
#rec ltick = if IsNaN(low(symbol)) then ltick[1] else low("$TICK");

rec htick = if IsNaN(high(symbol)) then htick[1] else high(symbol) ;
rec ltick = if IsNaN(low(symbol)) then ltick[1] else low(symbol);

rec avgh = if i == 1 then htick else Max(filter, avgh[1] + 2 / (p + 1) * (htick - avgh[1]));
rec avgl = if i == 1 then ltick else Min(-filter, avgl[1] + 2 / (p + 1) * (ltick - avgl[1]));


#def hi = high("$TICK");
#def lo = low("$TICK");
def hi = high(symbol);
def lo = low(symbol);

plot Last = if IsNaN(close(symbol)[-1]) then close(symbol) else double.nan;

plot amean = if IsNaN(close) then na else (avgh + avgl) / 2;
def trendmean = if usetrend AND (htick > avgh OR ltick < avgl) then amean else 0;

def bull = if htick > avgh then htick - avgh  else 0;
def bear = if ltick < avgl then ltick - avgl  else 0;

rec ctick = if i == 1 then 0 else if IsNaN(htick) OR IsNaN(ltick) then ctick[1] else ctick[1] + bull + bear + trendmean;  

def ctickavg = ExpAverage(ctick, smooth);
plot cumtick = if IsNaN(close) then na else ctickavg;
plot nettick = if IsNaN(close) then na else ctick;

plot zero = 0;
cumtick.AssignValueColor(if cumtick > cumtick[lookback] then color.green else color.red);
AssignPriceColor(if !upper then color.current else if cumtick > cumtick[lookback] AND ltick < avgl then color.green else if cumtick > cumtick[lookback] then color.gray else if cumtick < cumtick[lookback] AND htick > avgh then color.red else color.gray);
cumtick.SetLineWeight(2);
def hcumtick=if !hidecumtick then cumtick else na;
def hzero=if !hidecumtick then zero else na;
AddCloud(hcumtick, hzero );
plot buy = if cumtick > cumtick[lookback] AND ltick < avgl then low - tickSize() else if cumtick > cumtick[lookback] then na else if cumtick < cumtick[lookback] AND htick > avgh then na else na;
plot sell = if cumtick > cumtick[lookback] AND ltick < avgl then na else if cumtick > cumtick[lookback] then na else if cumtick < cumtick[lookback] AND htick > avgh then high + tickSize() else na;

plot ahi = if IsNaN(close) then na else avgh;
plot alo = if IsNaN(close) then na else avgl;
plot hib = if hi < 0 then hi else na;
plot lob = if lo > 0 then lo else na;
plot phi = hi;
plot plo = lo;

buy.SetDefaultColor(color.green);
buy.SetPaintingStrategy(paintingStrategy.ARROW_UP);
sell.SetDefaultColor(color.red);
sell.SetPaintingStrategy(paintingStrategy.ARROW_DOWN);



#plot zero=0;
#
# Formatting:
#
hib.SetPaintingStrategy(paintingStrategy.HISTOGRAM);
hib.SetDefaultColor(color.black);
hib.SetLineWeight(5);
lob.SetPaintingStrategy(paintingStrategy.HISTOGRAM);
lob.SetDefaultColor(color.black);
lob.SetLineWeight(5);

Last.SetDefaultColor(Color.white);
Last.SetPaintingStrategy(paintingStrategy.DASHES);
phi.SetPaintingStrategy(paintingStrategy.HISTOGRAM);
phi.AssignValueColor(if hi > ahi then color.dark_GREEN else color.gray);
phi.SetLineWeight(5);
plo.SetPaintingStrategy(paintingStrategy.HISTOGRAM);
plo.AssignValueColor(if lo < alo then color.dark_red else color.gray);
plo.SetLineWeight(5);
zero.SetDefaultColor(color.gray);
zero.SetLineWeight(1);
amean.AssignValueColor(if cumtick > cumtick[lookback] then color.green else color.red);
amean.SetLineWeight(5);
amean.SetStyle(curve.POINTS);
ahi.SetDefaultColor(color.green);
ahi.SetStyle(curve.SHORT_DASH);
alo.SetDefaultColor(color.red);
alo.SetStyle(curve.SHORT_DASH);

#Hiding depending on if upper or lower
phi.setHiding(upper);
plo.setHiding(upper);
zero.setHiding(upper);
last.setHiding(upper);
hib.setHiding(upper);
lob.setHiding(upper);

ahi.setHiding(upper);
alo.setHiding(upper);
cumtick.setHiding(hidecumtick);
nettick.setHiding(hidecumtick);
buy.setHiding(!upper);
sell.setHiding(!upper);

amean.setHiding(upper);
