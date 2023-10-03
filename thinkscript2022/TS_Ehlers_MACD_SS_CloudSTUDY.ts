DefineGlobalColor("faintYellow", CreateColor(255, 242, 153));
DefineGlobalColor("rain", CreateColor(110, 196, 219));
#DefineGlobalColor("bluesy", CreateColor(0, 125, 225));
#DefineGlobalColor("sunny", CreateColor(255, 221, 113));
DefineGlobalColor("offgray", CreateColor(108, 108, 108));
DefineGlobalColor("mediumYellow", CreateColor(255,221,113));

declare upper;

input Price = close;
input FastLen = 12;
input SlowLen = 26;
input ShowCloud = yes;

def fast = EhlersSuperSmootherFilter(GetValue(Price, 0), FastLen);
def slow = EhlersSuperSmootherFilter(GetValue(Price, 0), SlowLen);

def MACD = Round(fast - slow, 2);
def signal = GetValue(MACD, 1);

def Zero = 0;

def Rms = Round(Sqrt(EhlersSuperSmootherFilter(Sqr(MACD), SlowLen)), 2);
def "+Rms" = if !IsNaN(MACD) and IsNaN(Rms) then 0 else Rms;
def "-Rms" = if !IsNaN(MACD) and IsNaN(Rms) then 0 else -Rms;

def posTrigger = CompoundValue(
    1,
    if MACD crosses above 0 then 1
    else if MACD[1] crosses below "-Rms"[1] then 0
    else posTrigger[1],
    0);

def negTrigger = CompoundValue(
    1,
    if MACD crosses below 0 then 1
    else if MACD[1] crosses above "+Rms"[1] then 0    
    else negTrigger[1],
    0);

def ZPCross = if MACD crosses above Zero then 1 else 0;
def ZNCross = if MACD crosses below Zero then 1 else 0;
AssignPriceColor(if ZPCross or ZNCross then GlobalColor("faintYellow") else Color.CURRENT);

def PCross = if MACD crosses above "+Rms" and negTrigger then 1 else 0;
AssignPriceColor(if PCross then GlobalColor("mediumYellow") else Color.CURRENT);

def NCross = if MACD crosses below "-Rms" and posTrigger then 1 else 0;
AssignPriceColor(if NCross then GlobalColor("mediumYellow") else Color.CURRENT);

def FlipDn = if MACD crosses below signal and MACD > "+Rms" then 1 else 0;
AssignPriceColor(if FlipDn then GlobalColor("rain") else Color.CURRENT);

def FlipUp = if MACD crosses above signal and MACD < "-Rms" then 1 else 0;
AssignPriceColor(if FlipUp then GlobalColor("rain") else Color.CURRENT);

#Clouds
def _zpch = if ZPCross then high 
    else if ZNCross or PCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _zpch[1];
plot zpch = if ShowCloud then _zpch else Double.NaN;
zpch.SetHiding(yes);zpch.SetDefaultColor(Color.GRAY);
def _zpcl = if ZPCross then low 
    else if ZNCross or PCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _zpcl[1];
plot zpcl = if ShowCloud then _zpcl else Double.NaN;
zpcl.SetHiding(yes);zpcl.SetDefaultColor(Color.GRAY);
AddCloud(zpch, zpcl, GlobalColor("offgray"), GlobalColor("offgray"));

def _znch = if ZNCross then high 
    else if ZPCross or PCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _znch[1];
plot znch = if ShowCloud then _znch else Double.NaN;
znch.SetHiding(yes);znch.SetDefaultColor(Color.GRAY);
def _zncl = if ZNCross then low 
    else if ZPCross or PCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _zncl[1];
plot zncl = if ShowCloud then _zncl else Double.NaN;
zncl.SetHiding(yes);zncl.SetDefaultColor(Color.GRAY);
AddCloud(znch, zncl, GlobalColor("offgray"), GlobalColor("offgray"));

def _pch = if PCross then high 
    else if ZPCross or ZNCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _pch[1];
plot pch = if ShowCloud then _pch else Double.NaN;
pch.SetHiding(yes);pch.SetDefaultColor(Color.GRAY);
def _pcl = if PCross then low 
    else if ZPCross or ZNCross or NCross or FlipDn or FlipUp then Double.NaN 
    else _pcl[1];
plot pcl = if ShowCloud then _pcl else Double.NaN;
pcl.SetHiding(yes);pcl.SetDefaultColor(Color.GRAY);
AddCloud(pch, pcl, GlobalColor("offgray"), GlobalColor("offgray"));

def _nch = if NCross then high 
    else if PCross or ZPCross or ZNCross or FlipDn or FlipUp then Double.NaN 
    else _nch[1];
plot nch = if ShowCloud then _nch else Double.NaN;
nch.SetHiding(yes);nch.SetDefaultColor(Color.GRAY);
def _ncl = if NCross then low 
    else if PCross or ZPCross or ZNCross or FlipDn or FlipUp then Double.NaN 
    else _ncl[1];
plot ncl = if ShowCloud then _ncl else Double.NaN;
ncl.SetHiding(yes);ncl.SetDefaultColor(Color.GRAY);
AddCloud(nch, ncl, GlobalColor("offgray"), GlobalColor("offgray"));

def _fuh = if FlipUp then high 
    else if PCross or NCross or FlipDn or ZPCross or ZNCross then Double.NaN 
    else _fuh[1];
plot fuh = if ShowCloud then _fuh else Double.NaN;
fuh.SetHiding(yes);fuh.SetDefaultColor(Color.GRAY);
def _ful = if FlipUp then low 
    else if PCross or NCross or FlipDn or ZPCross or ZNCross then Double.NaN 
    else _ful[1];
plot ful = if ShowCloud then _ful else Double.NaN;
ful.SetHiding(yes);ful.SetDefaultColor(Color.GRAY);
AddCloud(fuh, ful, GlobalColor("offgray"), GlobalColor("offgray"));

def _fdh = if FlipDn then high 
    else if PCross or NCross or ZPCross or ZNCross or FlipUp then Double.NaN 
    else _fdh[1];
plot fdh = if ShowCloud then _fdh else Double.NaN;
fdh.SetHiding(yes);fdh.SetDefaultColor(Color.GRAY);
def _fdl = if FlipDn then low 
    else if PCross or NCross or ZPCross or ZNCross or FlipUp then Double.NaN 
    else _fdl[1];
plot fdl = if ShowCloud then _fdl else Double.NaN;
fdl.SetHiding(yes);fdl.SetDefaultColor(Color.GRAY);
AddCloud(fdh, fdl, GlobalColor("offgray"), GlobalColor("offgray"));
