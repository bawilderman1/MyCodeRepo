input length = 40;

def zeros = close - close[2];
def filter = reference EhlersSuperSmootherFilter(price = zeros, "cutoff length" = 0.5 * length);
def rms = Sqrt(Average(Sqr(filter), length));
def scaledFilter = filter / rms;
def alpha = 5 * AbsValue(scaledFilter) / length;
def deviationScaledMovAvg = CompoundValue(1, alpha * close + (1 - alpha) * deviationScaledMovAvg[1], close);

plot DSMA = deviationScaledMovAvg;
DSMA.SetDefaultColor(GetColor(1));
