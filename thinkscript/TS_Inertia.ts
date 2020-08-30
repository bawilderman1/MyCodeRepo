declare upper;
declare once_per_bar;

input length = 5;
input displace = 1;
input showUpper = yes;
input showLower = no;
input showExtension = yes;
input showAngleLabel = yes;

def lastBar = !IsNaN(close) && IsNaN(close[-1]);

def _inertiaLow = InertiaAll(low[displace], length)[-displace];
def _inertiaHigh = InertiaAll(high[displace], length)[-displace];

plot InertiaLow = if showLower then _inertiaLow else Double.NaN;
InertiaLow.DefineColor("IL", Color.CYAN);
InertiaLow.AssignValueColor(InertiaLow.Color("IL"));
InertiaLow.SetStyle(Curve.SHORT_DASH);

plot InertiaHigh = if showUpper  then _inertiaHigh else Double.NaN;
InertiaHigh.DefineColor("IH", Color.CYAN);
InertiaHigh.AssignValueColor(InertiaHigh.Color("IH"));
InertiaHigh.SetStyle(Curve.SHORT_DASH);

def _extLow = 
    if !IsNaN(_inertiaLow[0]) && IsNaN(_inertiaLow[-1]) then _inertiaLow 
    else if !IsNaN(_inertiaLow[1]) && IsNaN(_inertiaLow[0]) then _inertiaLow[1] + (_inertiaLow[1]-_inertiaLow[2]) 
    else if !IsNaN(_inertiaLow[2]) && IsNaN(_inertiaLow[1]) then _inertiaLow[2] + 2*(_inertiaLow[2]-_inertiaLow[3])
    else Double.NaN;

plot extraLow = if showLower && showExtension then _extLow else Double.NaN;
extraLow.SetDefaultColor(Color.ORANGE);

def _extHigh = 
    if !IsNaN(_inertiaHigh[0]) && IsNaN(_inertiaHigh[-1]) then _inertiaHigh
    else if !IsNaN(_inertiaHigh[1]) && IsNaN(_inertiaHigh[0]) then _inertiaHigh[1] + (_inertiaHigh[1]-_inertiaHigh[2]) 
    else if !IsNaN(_inertiaHigh[2]) && IsNaN(_inertiaHigh[1]) then _inertiaHigh[2] + 2*(_inertiaHigh[2]-_inertiaHigh[3])
    else Double.NaN;

plot extraHigh = if showUpper && showExtension then _extHigh else Double.NaN;
extraHigh.SetDefaultColor(Color.ORANGE);


def HighAngle = (ATan((InertiaHigh[displace] - GetValue(InertiaHigh, displace +1)) / 1) * 180) / Double.Pi;
def LowAngle = (ATan((InertiaLow[displace] - GetValue(InertiaLow, displace +1)) / 1) * 180) / Double.Pi;

AddLabel(showAngleLabel && !IsNaN(HighAngle), "H: " + Round(HighAngle,1) + "°", InertiaHigh.Color("IH"));
AddLabel(showAngleLabel && !IsNaN(LowAngle), "L: " + Round(LowAngle, 1) + "°", InertiaLow.Color("IL"));