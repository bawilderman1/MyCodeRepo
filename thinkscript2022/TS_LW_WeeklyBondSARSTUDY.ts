script ParSAR {
    input accelerationFactor = 0.02;
    input accelerationLimit = 0.2;
    input Symbol = "/ZB";

    Assert(
        accelerationFactor > 0, 
        "'acceleration factor' must be positive: " + accelerationFactor);
    Assert(
        accelerationLimit >= accelerationFactor, 
        "'acceleration limit' (" + accelerationLimit + ") must be greater than or equal to 'acceleration factor' (" + accelerationFactor + ")");

    def state = {default init, long, short};
    def extreme;
    def SAR;
    def acc;

    switch (state[1]) {
    case init:
        state = state.long;
        acc = accelerationFactor;
        extreme = high(Symbol);
        SAR = low(Symbol);
    case short:
        if (SAR[1] < high(Symbol))
        then {
            state = state.long;
            acc = accelerationFactor;
            extreme = high(Symbol);
            SAR = extreme[1];
        } else {
            state = state.short;
            if (low(Symbol) < extreme[1])
            then {
                acc = Min(acc[1] + accelerationFactor, accelerationLimit);
                extreme = low(Symbol);
            } else {
                acc = acc[1];
                extreme = extreme[1];
            }
            SAR = Max(Max(high(Symbol), high(Symbol)[1]), SAR[1] + acc * (extreme - SAR[1]));
        }
    case long:
        if (SAR[1] > low(Symbol))
        then {
            state = state.short;
            acc = accelerationFactor;
            extreme = low(Symbol);
            SAR = extreme[1];
        } else {
            state = state.long;
            if (high(Symbol) > extreme[1])
            then {
                acc = Min(acc[1] + accelerationFactor, accelerationLimit);
                extreme = high(Symbol);
            } else {
                acc = acc[1];
                extreme = extreme[1];
            }
            SAR = Min(Min(low(Symbol), low(Symbol)[1]), SAR[1] + acc * (extreme - SAR[1]));
        }
}

    plot Value = SAR;
}

declare hide_on_intraday;

declare lower;

input type = ChartType.CANDLE;
input symbol = "/ZB";

DefineGlobalColor( "uptick", Color.UPTICK );
DefineGlobalColor( "downtick", Color.DOWNTICK );
DefineGlobalColor( "neutral", Color.PLUM );

AddChart(high = high(symbol), low  = low(symbol), open = open(symbol), close = close(symbol), type = type , growColor = Color.WHITE, fallColor = Color.WHITE, neutralColor = Color.WHITE);

def _sar = ParSAR(Symbol = symbol).Value;

plot DnSignal =  if 
    _sar[1] <= low(symbol)[1] and _sar >= high(symbol) 
    then _sar else Double.NaN;
DnSignal.SetDefaultColor(GetColor(4));
DnSignal.SetPaintingStrategy(PaintingStrategy.POINTS);

plot UpSignal =  if 
    _sar[1] >= high(symbol)[1] and _sar <= low(symbol)
    then _sar else Double.NaN;
UpSignal.SetDefaultColor(GetColor(1));
UpSignal.SetPaintingStrategy(PaintingStrategy.POINTS);

plot BondParSAR = _sar;
BondParSAR.SetDefaultColor(GetColor(2));
BondParSAR.SetPaintingStrategy(PaintingStrategy.POINTS);


