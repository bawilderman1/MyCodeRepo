declare upper;

#input Price = close;
input Length = 5;
input Displace = -1;
input Step = 1;

Assert (Step >= 1, "Step must be greater then or equal to 1");

def Price = (close + open) / 2;
def base = Power(
    fold n = 0 to Length 
        with s = 1 
        do s * Log(GetValue(Price, (n * Step) - Displace)), 
    1/Length);

plot MA = Exp(base);
MA.SetDefaultColor(Color.MAGENTA);
