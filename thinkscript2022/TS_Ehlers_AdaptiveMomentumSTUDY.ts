declare lower;

input Price = HL2;
input Alpha = 0.07;
input Cutoff = 8;

def instPeriod;

def smooth = MovAvgTriangular(Price, 4);

def cycle = CompoundValue(7, 
    (1 - .5 * Alpha) * (1 - .5 * Alpha) * MovAvgTriangular(smooth, 3) 
    + 2 * (1 - Alpha) * cycle[1]
    - (1 - Alpha) * (1 - Alpha) * cycle[2],
    MovAvgTriangular(Price, 3));

def q1 = (0.0962 * cycle + 0.5769 * cycle[2] - 0.5769 * cycle[4] - 0.0962 * cycle[6]) 
    * (0.5 + 0.08 * CompoundValue(1, instPeriod[1], 0));
def i1 = cycle[3];

def dp = if q1 <> 0 and q1[1] <> 0 then (i1 / q1 - i1[1] / q1[1]) / (1 + i1 * i1[1] / (q1 * q1[1])) else 0;
def deltaPhase = if dp < 0.1 then 0.1 else if dp > 1.1 then 1.1 else dp;

def medianDelta = Median(deltaPhase, 5);
def dc = if medianDelta == 0 then 15 else 6.28318 / medianDelta + 0.5;

instPeriod = CompoundValue(1, 0.33 * dc + 0.67 * instPeriod[1], 0);
def p = CompoundValue(1, 0.15 * instPeriod + 0.85 * p[1], 0); 

def value1 = Price - GetValue(Price, Floor(p-1));

def a1 = Exp(-Double.Pi * Sqrt(2) / Cutoff);
def b1 = 2 * a1 * Cos(Sqrt(2) * Double.Pi / Cutoff);
def c1 = Sqr(a1);
def coef2 = b1 + c1;
def coef3 = -(c1 + b1* c1);
def coef4 = Sqr(c1);
def coef1 = 1 - coef2- coef3 - coef4;

def filt3 = CompoundValue(
    3, 
    coef1*value1 + coef2*filt3[1] + coef3*filt3[2] + coef4*filt3[3],
    value1); 

plot Momo = Round(filt3, 2);
plot Zero = 0;

Momo.SetDefaultColor(GetColor(4));
Zero.SetDefaultColor(GetColor(7));
#Signal.SetDefaultColor(GetColor(1));

def Rms = Round(Sqrt(Average(Sqr(Momo), Cutoff)), 2);
plot "+Rms" = Rms;
plot "-Rms" = -Rms;

"+Rms".SetDefaultColor(GetColor(7));
"-Rms".SetDefaultColor(GetColor(7));

AddVerticalLine(Momo crosses above Rms, "L", GetColor(4), Curve.FIRM);
AddVerticalLine(Momo crosses below -Rms, "S", GetColor(4), Curve.FIRM);

AddVerticalLine(Momo crosses below Rms, "C", GetColor(7), Curve.MEDIUM_DASH);
AddVerticalLine(Momo crosses above -Rms, "C", GetColor(7), Curve.MEDIUM_DASH);
