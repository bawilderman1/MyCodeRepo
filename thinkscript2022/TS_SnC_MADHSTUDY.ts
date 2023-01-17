script HannWindow {
    input Length = 8;
    input Price = close;

    plot Value = (fold i = 1 to Length+1 
                 with filter 
                 do filter + (1-Cos(2*Double.Pi*i/
                   (Length+1)))*
                    GetValue(Price,i-1,Length-1))/
                   (fold j = 1 to Length+1 
                    with sumCoeff 
                    do sumCoeff + (1-Cos(2*Double.Pi*j/
                      (Length+1 ))));
}

declare lower;

input FastLength = 8;
input DominantCycle = 27;

def slowLength = Floor(FastLength+DominantCycle/2);

def fastHann = HannWindow(FastLength, close);
def slowHann = HannWindow(slowLength, close);

plot MADH = if slowHann != 0 
               then (100*(fastHann-slowHann)/slowHann)
            else 0;
plot ZeroLine = 0;

MADH.SetDefaultColor(GetColor(4));
ZeroLine.SetDefaultColor(GetColor(7));
