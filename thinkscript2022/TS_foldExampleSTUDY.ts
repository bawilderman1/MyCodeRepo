#declare lower;

#plot NextHigh = fold i = 0 to 100 with price = Double.NaN while IsNaN(price) do if getValue(high, -i) > 85 then getValue(high, -i) else Double.NaN;

#rec NextHigh = fold i = 0 to 100 with price = Double.NaN while IsNaN(price) do if getValue(high, -i) > 85 then getValue(high, -i) else nexthigh[1];
#plot nh = nexthigh;

#def ave1 = average(close, 10);
#def ave2 = average(close, 20);
#rec NextHigh = fold i = 0 to 100 with price = Double.NaN while IsNaN(price) do if ave1 > ave2 then getValue(high, -i) else nexthigh[1];
#plot nh = if nexthigh > 0 then nexthigh else low;

def ave1 = average(close, 10);
def ave2 = average(close, 20);
rec NextHigh = fold i = 0 to 100 with price = Double.NaN while IsNaN(price) do if ave1 crosses below ave2 then getValue(high, -i) else nexthigh[1];
#plot nh = if nexthigh > 0 then nexthigh else low;
plot nh = nexthigh;
