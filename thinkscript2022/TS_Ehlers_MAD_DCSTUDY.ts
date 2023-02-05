declare lower;

input FastLength = 8;
input Price = close;
input BpPeriod = 20;
input BpBandwidth = 0.7;

def alpha2 = (Cos(0.25 * BpBandwidth * 2 * Double.Pi / BpPeriod) +
             Sin(0.25 * BpBandwidth * 2 * Double.Pi / BpPeriod) - 1) /
             Cos(0.25 * BpBandwidth * 2 * Double.Pi / BpPeriod);
def hp = CompoundValue(1, (1 + alpha2 / 2) * (Price - Price[1]) + (1 - alpha2) * hp[1], 0);
def beta1 = Cos(2 * Double.Pi / BpPeriod);
def gamma1 = 1 / Cos(Double.Pi * BpBandwidth / BpPeriod);
def alpha1 = gamma1 - Sqrt(gamma1 * gamma1 - 1);
def bp = CompoundValue(2, 0.5*(1-alpha1)*(hp-hp[2]) + beta1*(1+alpha1)*bp[1] - alpha1*bp[2], 0); 
def peak = CompoundValue(1, if AbsValue(bp) > (0.991*peak[1]) then AbsValue(bp) else 0.991*peak[1], 0);
def real = if peak <> 0 then bp/peak else 0;
def cross = real crosses above 0 or real crosses below 0;
def counter = CompoundValue(1, if cross[1] then 1 else counter[1] + 1, 0);
def _dc = CompoundValue(
    1, 
    if cross then Max(
        6, 
        Max(
            0.8*_dc[1], 
            Min(
                1.25*_dc[1], 
                2*counter))) 
    else if IsNaN(_dc[1]) then 6 
    else _dc[1], 
    6);
def DC = if IsNaN(_dc) and !IsNaN(close) then 6 else ROUND(_dc, 0);

plot Zero = 0;
Zero.SetDefaultColor(GetColor(3));

plot MADDC = if DC > 30 then MADH(FastLength, 30)
    else if DC == 29 or DC == 28 then MADH(FastLength, 28)
    else if DC == 27 or DC == 26 then MADH(FastLength, 26)
    else if DC == 25 or DC == 24 then MADH(FastLength, 24)
    else if DC == 23 or DC == 22 then MADH(FastLength, 22)
    else if DC == 21 or DC == 20 then MADH(FastLength, 20)
    else if DC == 19 or DC == 18 then MADH(FastLength, 18)
    else if DC == 17 or DC == 16 then MADH(FastLength, 16)
    else if DC == 15 or DC == 14 then MADH(FastLength, 14)
    else if DC == 13 or DC == 12 then MADH(FastLength, 12)
    else MADH(FastLength, 10);
MADDC.SetDefaultColor(GetColor(1));

plot MADH = MADH(8, 27);
MADH.SetDefaultColor(GetColor(2));
