declare on_volume;
declare hide_on_daily;

input Length = 13;
input HighThreshold = 1.20;
input LowThreshold = 0.80;

def active = if SecondsFromTime(0930) >= 0 and SecondsTillTime(1600) > 0 then 1 else 0;

def aggPeriod = GetAggregationPeriod();
def oneMinInMs = 60000;
def prevDayMinutesToAvg = 390;
def endOfDayBars = (oneMinInMs * prevDayMinutesToAvg) / aggPeriod;

def normalizedVolume = if active then volume else CompoundValue(1, Median(normalizedVolume[1], endOfDayBars), volume);
def avgVol = ExpAverage(normalizedVolume, Length);
def relVolume = Round(normalizedVolume / avgVol, 2);

plot RelativeVolume = if (active) then Volume else Double.NaN;
RelativeVolume.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
RelativeVolume.SetLineWeight(2);
RelativeVolume.DefineColor("Elevated", Color.UPTICK);
RelativeVolume.DefineColor("Depressed", Color.DOWNTICK);
RelativeVolume.DefineColor("Normal", Color.WHITE);
RelativeVolume.AssignValueColor(if (!IsNaN(RelativeVolume) and relVolume > HighThreshold) then RelativeVolume.Color("Elevated") else if (!IsNaN(RelativeVolume) and relVolume < LowThreshold) then RelativeVolume.Color("Depressed") else RelativeVolume.Color("Normal"));
