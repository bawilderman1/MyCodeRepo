#hint: <b>Dividend Scalper</b>\nThis study looks at the last dividend posted on the security and takes the previous day's closing price and the opening price on ex-dividend date to give the overnight gap. The price is then placed on the price chart, if it is green then the stock was either up on the open or the dividend covered the price drop on the ex-date; otherwise it will be colored red.\n\nThis study will not work if you have Right-Side Expansion enabled.

def a = getdividend();
def b = highestall(a);
def barnumber = barnumber();
def c = if a == b then barnumber else double.nan;
def d = highestall(c);
def e = if barnumber == d then open(period = aggregationPeriod.DAY) else double.nan;
def f = if barnumber == d then close(period = aggregationPeriod.DAY)[1] else double.NaN;
def g = highestall(e);
def h = highestall(f);
def i = g - h;
def j = if i > 0 then 1 else if -a <= i then 1 else 0;
addChartBubble((barnumber == d), open, concat("Dividend amount: $", a), if j > 0 then color.green else color.red);
addChartBubble((barnumber == d), open, concat("Overnight Gap: $", i), if j > 0 then color.green else color.red);
