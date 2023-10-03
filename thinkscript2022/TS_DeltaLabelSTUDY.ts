declare upper;
declare hide_on_daily;

DefineGlobalColor("labelBlue", CreateColor(51, 153, 255));

input ShowLabel = yes;

def _delta = if SecondsTillTime(0930) == 0 then Delta() else _delta[1];

AddLabel(ShowLabel, "Delta: " + Round(_delta, 2), GlobalColor("labelBlue"));
