DefineGlobalColor("mediumBlue", CreateColor(114, 158, 206));
DefineGlobalColor("mediumYellow", CreateColor(255,221,113));

declare lower;
declare hide_on_intraday;

input Length = 21;
input Symbol = "SPX";
input VolSymbol = "VIX";
input ExtremeLvl = 2.3;
input NormalLvl = 1.0;

def impVol = (GetValue(Close(VolSymbol), 0) / Sqrt(252)) * Sqrt(Length);

def prev = if !IsNaN(Close(Symbol)) 
    then GetValue(Close(Symbol), 1) 
    else Double.NaN;
def curr = GetValue(Close(Symbol), 0);

def logChg = Log(curr / prev);

def stDevC = StDev(logChg, Length);

def monthlyVol = stDevC * Sqrt(Length * Length / (Length - 1)) * 100;

plot Ratio = Round(impVol / monthlyVol, 4);
Ratio.DefineColor("Extreme", GlobalColor("mediumYellow"));
Ratio.DefineColor("Elevated", GetColor(3));
Ratio.DefineColor("Normal", GlobalColor("mediumBlue"));
Ratio.AssignValueColor(
    if Ratio >= ExtremeLvl then Ratio.Color("Extreme") 
    else if Ratio <= NormalLvl then Ratio.Color("Normal") 
    else Ratio.Color("Elevated")
);

plot Extreme = ExtremeLvl;
Extreme.SetDefaultColor(GetColor(3));

plot Normal = NormalLvl;
Normal.SetDefaultColor(GetColor(3));
