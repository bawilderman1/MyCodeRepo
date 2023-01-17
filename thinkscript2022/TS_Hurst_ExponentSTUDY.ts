declare lower;

input Length = 30;
input Price = close;

Assert(Length % 2 == 0, "Length must be even number");

#SuperSmoother
def cutoffLength = 20;
def a1 = Exp(-Double.Pi * Sqrt(2) / cutoffLength);
def c2 = 2 * a1 * Cos(Sqrt(2) * Double.Pi / cutoffLength);
def c3 = - Sqr(a1);
def c1 = 1 - c2 - c3;

def hh3 = Highest(Price, Length);#hh3.SetDefaultColor(GetColor(3));
def ll3 = Lowest(Price, Length);#ll3.SetDefaultColor(GetColor(3));
def n3 = (hh3 - ll3)/Length;

def hh1 = Highest(Price, Length/2);#hh1.SetDefaultColor(GetColor(1));hh1.SetPaintingStrategy(PaintingStrategy.POINTS);
def ll1 = Lowest(Price, Length/2);#ll1.SetDefaultColor(GetColor(1));ll1.SetPaintingStrategy(PaintingStrategy.POINTS);
def n1 = (hh1-ll1)/(Length/2);

def hh2 = Highest(Price, Length/2)[Length/2];#hh2.SetDefaultColor(GetColor(2));hh2.SetPaintingStrategy(PaintingStrategy.POINTS);
def ll2 = Lowest(Price, Length/2)[Length/2];#ll2.SetDefaultColor(GetColor(2));ll2.SetPaintingStrategy(PaintingStrategy.POINTS);
def n2 = (hh2-ll2)/(Length/2);

def dimen = if !IsNaN(n1) && !IsNaN(n2) && !IsNaN(n3)
    then 0.5*((Log(n1+n2)-Log(n3))/Log(2)+dimen[1]) 
    else Double.NaN;

def hurst = CompoundValue(1, 2-dimen, 0);
def smoothHurst = CompoundValue(1, c1*(hurst+hurst[1])/2 + c2*smoothHurst[1] + c3*smoothHurst[2], 0);

plot h = smoothHurst;
h.SetDefaultColor(GetColor(2));

plot Mid = .5;
Mid.SetDefaultColor(GetColor(3));

def triggerH = h[1];

def upSignal = h[1] <= triggerH[1] && h > triggerH;
AddVerticalLine(
    upSignal, 
    "U", 
    GetColor(2), 
    Curve.MEDIUM_DASH);

def downSignal = h[1] >= triggerH[1] && h < triggerH;
AddVerticalLine(
    downSignal, 
    "D", 
    GetColor(2), 
    Curve.MEDIUM_DASH);
