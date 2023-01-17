declare lower;

input setup = 27;
input sumLength = 25;
input trigger = 26.5;

def r = (0.8 * (CompoundValue(1, r[1], high[1] - low[1]))) + (0.2 * (high - low));
def l = (0.8 * (CompoundValue(1, l[1], r[1]))) + (0.2 * r);

plot MassX = sum(r / l, sumLength);
plot SetupLevel = setup;
plot TriggerLevel = trigger;

