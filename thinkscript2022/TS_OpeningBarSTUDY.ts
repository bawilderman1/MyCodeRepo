declare upper;
declare hide_on_daily;

DefineGlobalColor("cloudBlue", CreateColor(51, 153, 255));

input ShowCloud = yes;

def openBarHigh = if SecondsTillTime(0930) == 0 then High else openBarHigh[1];
def openBarLow = if SecondsTillTime(0930) == 0 then Low else openBarLow [1];

def obh = if ShowCloud then openBarHigh else Double.NaN;
def obl = if ShowCloud then openBarLow else Double.NaN;

AddCloud(obh, obl, GlobalColor("cloudBlue"), GlobalColor("cloudBlue")); 
