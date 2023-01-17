declare lower;

input length = 14;
input rAverageLength = 1;

def R = reference CorrelationTrendIndicator(length = length);

plot RSq = Sqr(Average(R, rAverageLength));
RSq.SetDefaultColor(GetColor(8));

plot Trending = 0.42;
Trending.SetDefaultColor(GetColor(1));

plot OverDone = 0.85;
OverDone.SetDefaultColor(GetColor(1));

def trendCloudTop = if (RSq >= Trending and RSq < OverDone) then OverDone
               else Double.NaN;

def trendCloudBtm = if (RSq >= Trending and RSq < OverDone) then Trending
               else Double.NaN;

AddCloud(trendCloudTop, trendCloudBtm, CreateColor(255, 168, 78), Color.WHITE);

def cycleCloudTop = if (RSq < Trending) then Trending
               else Double.NaN;

def cycleCloudBtm = if (RSq < Trending) then 0
               else Double.NaN;

AddCloud(cycleCloudTop, cycleCloudBtm, Color.CYAN, Color.WHITE);

def overdoneCloudTop = if (RSq >= Overdone) then 1
               else Double.NaN;

def overdoneCloudBtm = if (RSq >= OverDone) then OverDone
               else Double.NaN;

AddCloud(overdoneCloudTop, overdoneCloudBtm, CreateColor(255, 255, 100), Color.WHITE);
