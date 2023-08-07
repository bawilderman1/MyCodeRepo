declare upper;

input Price = close;
input Length = 10;
input Displace = 0;
input Step = 1;

Assert (Step >= 1, "Step must be greater then or equal to 1");

def base = Power(
    fold n = 0 to Length 
        with s = 1 
        do s * Log(GetValue(Price, (n * Step) - Displace)), 
    1/Length);

plot MA = Exp(base);
