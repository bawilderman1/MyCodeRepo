script CyclePeriod {
    input Price = HL2;
    input Alpha = 0.07;

    def instPeriod;

    def smooth = (Price + 2 * Price[1] + 2 * Price[2] + Price[3]) / 6;
    def cycle = if BarNumber() < 7 then (Price - 2 * Price[1] + Price[2]) / 4 
else (1 - 0.5 * Alpha) * (1 - 0.5 * Alpha) * (smooth - 2 * smooth[1] + smooth[2]) + 2 * (1 - Alpha) * cycle[1] - (1 - Alpha) * (1 - Alpha) * cycle[2];

    def q1 = (0.0962 * cycle + 0.5769 * cycle[2] - 0.5769 * cycle[4] - 0.0962 * cycle[6]) * (0.5 + 0.08 * CompoundValue(1, instPeriod[1], 0));

    def i1 = cycle[3];

    def dp = if q1 <> 0 and q1[1] <> 0 then (i1 / q1 - i1[1] / q1[1]) / (1 + i1 * i1[1] / (q1 * q1[1])) else 0;
    def deltaPhase = if dp < 0.1 then 0.1 else if dp > 1.1 then 1.1 else dp;

    def medianDelta = Median(deltaPhase, 5);
    def dc = if medianDelta == 0 then 15 else 6.28318 / medianDelta + 0.5;

    instPeriod = CompoundValue(1, 0.33 * dc + 0.67 * instPeriod[1], 0);
    def p = CompoundValue(1, 0.15 * instPeriod + 0.85 * p[1], 0);

    plot Period = Round(p, 0);
}

declare lower;
declare once_per_bar;

input Price = HL2;
input Alpha = 0.07;

plot Period = CyclePeriod(Price, Alpha).Period;
