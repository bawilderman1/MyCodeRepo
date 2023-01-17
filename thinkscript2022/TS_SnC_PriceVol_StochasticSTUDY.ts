declare Lower;

plot fifty = 50;
fifty.SetDefaultColor(Color.LIGHT_GRAY);

def volatility = ATR(length = 1, averageType = AverageType.WILDERS);

def priceStoch = StochasticFull(
    over_bought = 80, 
    over_sold = 20,
    KPeriod = 25,
    DPeriod = 2,
    priceH = high,
    priceL = low,
    priceC = close,
    slowing_period = 1
).FullD;

def volStoch = StochasticFull(
    over_bought = 80, 
    over_sold = 20,
    KPeriod = 25,
    DPeriod = 5,
    priceH = volatility,
    priceL = volatility,
    priceC = volatility,
    slowing_period = 1
).FullD;

plot PriceData = priceStoch;
PriceData.SetDefaultColor(Color.VIOLET);

plot VolatilityData = volStoch;
VolatilityData.SetDefaultColor(Color.LIGHT_RED);
