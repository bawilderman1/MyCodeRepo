declare on_volume;
declare hide_on_intraday;

input Length = 26;
input HighThreshold = 1.20;
input LowThreshold = 0.80;

def avgVol = ExpAverage(volume, Length);
def relVolume = Round(volume / avgVol, 2);

plot RelativeVolume = Volume;
RelativeVolume.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
RelativeVolume.SetLineWeight(2);
RelativeVolume.DefineColor("Elevated", Color.UPTICK);
RelativeVolume.DefineColor("Depressed", Color.DOWNTICK);
RelativeVolume.DefineColor("Normal", Color.WHITE);
RelativeVolume.AssignValueColor(if (!IsNaN(RelativeVolume) and relVolume > HighThreshold) then RelativeVolume.Color("Elevated") else if (!IsNaN(RelativeVolume) and relVolume < LowThreshold) then RelativeVolume.Color("Depressed") else RelativeVolume.Color("Normal"));
