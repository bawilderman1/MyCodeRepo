declare upper;

def ma1 = 0.8 * ((CompoundValue(1, ma1[1], close[1]))) + (0.2 * (close));
def ma2 = 0.8 * ((CompoundValue(1, ma2[1], ma1[1]))) + (0.2 * (ma1));

plot FastMA = ma1;
plot SlowMA = ma2;
