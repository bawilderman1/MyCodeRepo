input length = 21;

plot upperBand = Highest(high[1], length);
plot lowerBand = Lowest(low[1], length);
plot middleBand = (upperBand + lowerBand) / 2;

upperBand.SetDefaultColor(Color.dark_orange);
lowerBand.SetDefaultColor(Color.dark_orange);
middleBand.SetDefaultColor(Color.magenta);