script RviCalculation {    
    input Length = 8;

    def value1 = ((close - open) + 2 * (close[1] - open[1]) + 2 * (close[2] - open[2]) + (close[3] - open[3])) / 6;
    def value2 = ((high - low) + 2 * (high[1] - low[1]) + 2 * (high[2] - low[2]) + (high[3] - low[3])) / 6;

    def num = fold i = 0 to Length
          with n = 0
          do n + GetValue(value1, i, Length);

    def denom = fold j = 0 to Length
          with d = 0
          do d + GetValue(value2, j, Length);

    plot RVI = if (denom != 0) then num / denom else 0;
    plot Signal = (RVI + 2 * RVI[1] + 2 * RVI[2] + RVI[3]) / 6;
}

declare lower;

input Length = 8;

plot RVI = RviCalculation(Length).RVI;
plot SignalLine = RviCalculation(Length).Signal;

plot SellSignal = if (RVI crosses below SignalLine) then SignalLine else Double.NaN;
SellSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);

plot BuySignal = if (RVI crosses above SignalLine) then SignalLine else Double.NaN;
BuySignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
