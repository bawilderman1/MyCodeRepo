declare lower;
declare hide_on_daily;

input Price = FundamentalType.HLC3;
input SnP500 = "SPY";
input Nasdaq = "QQQ";
input Dow = "DIA";
input Russell = "IWM";
input ShowLabels = yes;

def sOpen = Open(SnP500, AggregationPeriod.DAY);
def nOpen = Open(Nasdaq, AggregationPeriod.DAY);
def dOpen = Open(Dow, AggregationPeriod.DAY);
def rOpen = Open(Russell, AggregationPeriod.DAY);

def sClose = Fundamental(Price, SnP500, GetAggregationPeriod());
def nClose = Fundamental(Price, Nasdaq, GetAggregationPeriod());
def dClose = Fundamental(Price, Dow, GetAggregationPeriod());
def rClose = Fundamental(Price, Russell, GetAggregationPeriod());

plot SChg = Round(((sClose-sOpen)/sOpen)*100, 2);
SChg.SetDefaultColor(GetColor(1));

plot NChg = Round(((nClose-nOpen)/nOpen)*100, 2);
NChg.SetDefaultColor(GetColor(2));

plot DChg = Round(((dClose-dOpen)/dOpen)*100, 2);
DChg.SetDefaultColor(GetColor(4));

plot RChg = Round(((rClose-rOpen)/rOpen)*100, 2);
RChg.SetDefaultColor(GetColor(6));

plot Zero = 0;
Zero.SetDefaultColor(Color.WHITE);
Zero.SetStyle(Curve.MEDIUM_DASH);

AddLabel(ShowLabels, "S", GetColor(1));
AddLabel(ShowLabels, "N", GetColor(2));
AddLabel(ShowLabels, "D", GetColor(4));
AddLabel(ShowLabels, "R", GetColor(6));
