declare upper;

input Price = HL2;
input Length = 10;
input Offset = 3;

plot SS = EhlersSuperSmootherFilter(Price, Length);
SS.SetDefaultColor(GetColor(0));

plot SSTrig = if !IsNaN(close) then SS[Offset] else Double.NaN;
SSTrig.SetDefaultColor(GetColor(3));

