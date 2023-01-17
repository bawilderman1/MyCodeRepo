declare lower;

input Price = hl2;
input Period = 20;
input Delta = 0.50;
input Fraction = 0.10;

def beta = Cos(360/Period);
def gamma = 1/Cos(720*Delta/Period);
def alpha = gamma - Sqrt(gamma*gamma-1);
def bp = 0.5*(1-alpha)*(Price-Price[2])+ 
         beta*(1+alpha)*bp[1]-alpha*bp[2];
def peak = if (bp[1] > bp and bp[1] > bp[2]) then bp[1]
        else CompoundValue(1, peak[1], 0);
def valley = if (bp[1] < bp and bp[1] < bp[2]) then bp[1]
        else CompoundValue(1, valley[1], 0);

plot Mean = Average(bp, 2*Period);
plot AvgPeak = Average(peak, 50)*Fraction;
plot AvgValley = Average(valley, 50)*Fraction;

