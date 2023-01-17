declare lower;

input Length = 14;

plot PriceDensity = Sum(high - low, Length) / (Highest(high, Length) - Lowest(low, Length));

