declare upper;

#input timeProfile = 252;
def timeProfile;
input hideStudy = no;
#input aggregationPeriod = AggregationPeriod.DAY;

if GetAggregationPeriod() == AggregationPeriod.DAY {
    timeProfile = 252;
}
else if GetAggregationPeriod() == AggregationPeriod.week {
    timeProfile = 52;
}
else if GetAggregationPeriod() == AggregationPeriod.month {
    timeProfile = 12;
}
else {
    timeProfile = double.nan;
}

    def Hide =  if hideStudy == yes then yes else no;

#close(period = aggregationPeriod)
    def price = close;

    def hightest = Highest(high, timeProfile);
    def lowtest = Lowest(low, timeProfile);

    def range = hightest - lowtest;

    def level1 = (range * 0.2);
    def level2 = (range * 0.4);
    def level3 = (range * 0.6);
    def level4 = (range * 0.8);

    rec L0 = if IsNaN(price) then L0[1] else if !IsNaN(price) && IsNaN(price[-1]) then lowtest 
  else Double.NaN;
    plot base = L0;
    base.SetHiding(Hide);
    base.SetDefaultColor(Color.BLACK);

    rec L1 = if IsNaN(price) then L1[1] else if !IsNaN(close) && IsNaN(price[-1]) then lowtest + level1 
  else Double.NaN;
    plot tier1 = L1;
    tier1.SetDefaultColor(Color.BLACK);
    tier1.SetHiding(Hide);

    rec L2 = if IsNaN(price) then L2[1] else if !IsNaN(price) && IsNaN(price[-1]) then lowtest + level2
  else Double.NaN;
    plot tier2 = L2;
    tier2.SetDefaultColor(Color.BLACK);
    tier2.SetHiding(Hide);

    rec L3 = if IsNaN(price) then L3[1] else if !IsNaN(price) && IsNaN(price[-1]) then lowtest + level3
  else Double.NaN;
    plot tier3 = L3;
    tier3.SetDefaultColor(Color.BLACK);
    tier3.SetHiding(Hide);

    rec L4 = if IsNaN(price) then L4[1] else if !IsNaN(price) && IsNaN(price[-1]) then lowtest + level4
  else Double.NaN;
    plot tier4 = L4;
    tier4.SetDefaultColor(Color.BLACK);
    tier4.SetHiding(Hide);

    rec L5 = if IsNaN(price) then L5[1] else if !IsNaN(price) && IsNaN(price[-1]) then lowtest + range 
  else Double.NaN;
    plot top = L5;
    top.SetDefaultColor(Color.BLACK);
    top.SetPaintingStrategy(PaintingStrategy.LINE);
    top.SetHiding(Hide);

    AddCloud(data1 = (if Hide == no then top else Double.NaN), data2 = (if Hide == no then tier4 else Double.NaN), Color.DARK_RED);
    AddCloud(data1 = (if Hide == no then tier4 else Double.NaN), data2 = (if Hide == no then tier3 else Double.NaN), Color.RED);
    AddCloud(data1 = (if Hide == no then tier3 else Double.NaN), data2 = (if Hide == no then tier2 else Double.NaN), Color.YELLOW);
    AddCloud(data1 = (if Hide == no then tier2 else Double.NaN), data2 = (if Hide == no then tier1 else Double.NaN), Color.GREEN);
    AddCloud(data1 = (if Hide == no then tier1 else Double.NaN), data2 = (if Hide == no then base else Double.NaN), Color.DARK_GREEN);