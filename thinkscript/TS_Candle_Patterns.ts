declare once_per_bar;
declare upper;
DefineGlobalColor("mediumGreen", CreateColor(103, 191, 92));
DefineGlobalColor("mediumRed", CreateColor(237, 102, 93));
DefineGlobalColor("mediumBlue", CreateColor(114, 158, 206));
DefineGlobalColor("mediumYellow", CreateColor(255,221,113));

#Defining & Setup
def _close = close;
def _high = high;
def _low = low;
def _open = open;

######################################TS_RsiLaguerreFractalEnergy#############################################

#Inputs:
def nFE = 8;#hint nFE: length for Fractal Energy calculation.
def Glength  = 13;
def betaDev =  8;

def w = (2 * Double.Pi / Glength);
def beta = (1 - Cos(w)) / (Power(1.414, 2.0 / betaDev) - 1 );
def alpha = (-beta + Sqrt(beta * beta + 2 * beta));
def Go = Power(alpha, 4) * _open +
             4 * (1 – alpha) * Go[1] – 6 * Power( 1 - alpha, 2 ) * Go[2] +
             4 * Power( 1 - alpha, 3 ) * Go[3] - Power( 1 - alpha, 4 ) * Go[4];
def Gh = Power(alpha, 4) * _high +
             4 * (1 – alpha) * Gh[1] – 6 * Power( 1 - alpha, 2 ) * Gh[2] +
             4 * Power( 1 - alpha, 3 ) * Gh[3] - Power( 1 - alpha, 4 ) * Gh[4];
def Gl = Power(alpha, 4) * _low +
             4 * (1 – alpha) * Gl[1] – 6 * Power( 1 - alpha, 2 ) * Gl[2] +
             4 * Power( 1 - alpha, 3 ) * Gl[3] - Power( 1 - alpha, 4 ) * Gl[4];
def Gc = Power(alpha, 4) * _close +
             4 * (1 – alpha) * Gc[1] – 6 * Power( 1 - alpha, 2 ) * Gc[2] +
             4 * Power( 1 - alpha, 3 ) * Gc[3] - Power( 1 - alpha, 4 ) * Gc[4];

# Variables:
def o;
def h;
def l;
def c;
def CU1;
def CU2;
def CU;
def CD1;
def CD2;
def CD;
def L0;
def L1;
def L2;
def L3;
def RSI;

# Calculations
o = (Go + Gc[1]) / 2;
h = Max(Gh, Gc[1]);
l = Min(Gl, Gc[1]);
c = (o + h + l + Gc) / 4;
def gamma = Log(Sum((Max(Gh, Gc[1]) - Min(Gl, Gc[1])), nFE) /
        (Highest(gh, nFE) - Lowest(Gl, nFE)))
            / Log(nFE);                                            #Fractal Energy


L0 = (1 – gamma) * Gc + gamma * L0[1];
L1 = -gamma * L0 + L0[1] + gamma * L1[1];
L2 = -gamma * L1 + L1[1] + gamma * L2[1];
L3 = -gamma * L2 + L2[1] + gamma * L3[1];
if L0 >= L1
then {
    CU1 = L0 - L1;
    CD1 = 0;
} else {
    CD1 = L1 - L0;
    CU1 = 0;
}
if L1 >= L2
then {
    CU2 = CU1 + L1 - L2;
    CD2 = CD1;
} else {
    CD2 = CD1 + L2 - L1;
    CU2 = CU1;
}
if L2 >= L3
then {
    CU = CU2 + L2 - L3;
    CD = CD2;
} else {
    CU = CU2;
    CD = CD2 + L3 - L2;
}

RSI = if CU + CD <> 0 then CU / (CU + CD) else 0;

######################################End TS_RsiLaguerreFractalEnergy###############################################

#############         New Variables             #########################

def uTrend = gamma < 0.618 && RSI > 0.8;
def dTrend = gamma < 0.618 && RSI < 0.2;

def bearishTurn = RSI > 0.8 or RSI crosses below 0.8; 
def bullishTurn = RSI < 0.2 or RSI crosses above 0.2;

def squeeze = gamma > 0.618;
def exhaustion = gamma < 0.382;
def recentExhaustion = exhaustion within 8 bars;

##############        8 EMA difference          #########################

def ema8 = ExpAverage(_close, 8);
def ema21 = ExpAverage(_close, 21);
def atr14 = Average(TrueRange(_close,_high,_low),14);
def atrFromEma8 = if _low > ema8 then (_low - ema8) / atr14
                  else if _high < ema8 then (_high - ema8) / atr14
                  else 0;

##############        Existing Code             #########################

def length = 14;                                    #Number of Days
def midBody = MidBodyVal();                         #Mid Price
def bodySize = BodyHeight();                        #Bar Height
def avgBodySize = Average(bodySize, length);        #Average Bar Height
def stDevBody = StDev(avgBodySize, length) * 0.8;   #80% of 1 Standard Deviation
def bodyType = if (bodySize > avgBodySize + stDevBody) then 2 
               else if (bodySize between avgBodySize - stDevBody and avgBodySize + stDevBody) then 1
               else 0;                #2 = Long; 1 = Average; 0 = Short

def direction = if (_close > _open) then 1         #Up Day
                else if (_open == _close) then 0    #Doji
                else -1;                            #Down Day

def candleSize = _high - _low;
def bodyHigh = Max(_close, _open);
def bodyLow = Min(_close, _open);
def uWick = _high - bodyHigh;    #Upper Wick
def lWick = bodyLow - _low;       #Lower Wick

def hammerCandle = lWick / candleSize >= 0.60;
def invHammerCandle = uWick / candleSize >= 0.60;

#Candle Analysis
def _marubozuBear = bodyType[1] >= 1 AND bodyType >= 1 AND       #Both are at least Average Candles
                  direction[1] == 1 AND direction == -1 AND           #Up Day then Down Day
                  ((_open[1] == _low[1] AND _open == _high)            #Open 1 is Low & Open 2 is High
                        OR                                               #OR
                   (_close[1] == _high[1] AND _close == _low)) AND     #Close 1 is High & Close 2 is Low
                  _open > _high[1] - (candleSize[1] * 0.2) AND       #Open > upper 80% of Day 1
                  _close < _low[1] + (candleSize[1] * 0.2);           #Close < lower 80% of Day 1

def _marubozuBull = bodyType[1] >= 1 AND bodyType >= 1 AND       #Both are at least Average Candles
                  direction[1] == -1 AND direction == 1 AND           #Down Day then Up Day
                  ((_open[1] == _high[1] AND _open == _low)            #Open 1 is High & Open 2 is Low
                        OR                                               #OR
                   (_close[1] == _low[1] AND _close == _high)) AND     #Close 1 is Low & Close 2 is High
                  _open < _low[1] + (candleSize[1] * 0.2) AND        #Open < lower 80% of Day 1
                  _close > _high[1] - (candleSize[1] * 0.2);          #Close > upper 80% of Day 1

def _engulfingUp = direction[1] <= 0 
                   AND _open <= _close[1] 
                   AND _close > _open[1]
                   AND bodyType == 2;

def _engulfingDn = direction[1] >= 0
                   AND _open >= _close[1]
                   AND _close < _open[1]
                   AND bodyType == 2;

def _engulfingBull = _engulfingUp
                   AND (dTrend OR dTrend[1])            
                   AND recentExhaustion;

def _engulfingBear = _engulfingDn
                   AND (uTrend OR uTrend[1])
                   AND recentExhaustion;

def _engulfingUpTop = _engulfingUp 
                     AND (uTrend OR uTrend[1])
                     AND atrFromEma8 > 0.5
                     AND recentExhaustion;

def _engulfingUpCont = _engulfingUp
                     AND (uTrend OR uTrend[1])
                     AND (atrFromEma8 Between 0 AND 0.33)
                     AND !recentExhaustion;

def _engulfingDnBtm = _engulfingDn
                      AND (dTrend OR dTrend[1])
                      AND atrFromEma8 < -0.5
                      AND recentExhaustion;

def _engulfingDnCont = _engulfingDn
                     AND (dTrend OR dTrend[1])
                     AND (atrFromEma8 Between -0.33 AND 0)
                     AND !recentExhaustion;

def _hammerSignal = dTrend AND atrFromEma8 < -0.66 AND hammerCandle;# AND bullishTurn;

def _hangingMan = uTrend AND atrFromEma8 > 0.66 AND hammerCandle;# AND bearishTurn;

def _invHammerSignal = dTrend AND atrFromEma8 < -0.66 AND invHammerCandle;# AND bullishTurn;

def _shootingStar = uTrend AND atrFromEma8 > 0.66 AND invHammerCandle;# AND bearishTurn;

def _piercing = direction[1] == -1
                AND bodyType[1] == 2
                AND _open < _close[1]
                AND _close > midBody[1]
                AND (dTrend OR (recentExhaustion AND !uTrend));

def _darkCloud = direction[1] == 1
                 AND bodyType[1] == 2
                 AND _open > _close[1]
                 AND _close < midBody[1]
                 AND (uTrend OR (recentExhaustion AND !dTrend));

def _haramiBull = direction[1] == -1
                  AND direction == 1
                  AND bodyType[1] >= 1
                  AND _open > _close[1]
                  AND _close < _open[1]
                  AND _close > _close[1]
                  AND (dTrend OR recentExhaustion);

def _haramiBear = direction[1] == 1
                  AND direction == -1
                  AND bodyType[1] >= 1
                  AND _open < _close[1]
                  AND _close > _open[1]
                  AND _close < _close[1]
                  AND (uTrend OR recentExhaustion);


def _kickerBull = direction[1] == -1
                  AND direction == 1
                  AND bodyType >= 1
                  AND _open >= _open[1];

def _kickerBear = direction[1] == 1
                  AND direction == -1
                  AND bodyType >= 1
                  AND _open <= _open[1];

def _mStar = direction[2] == -1
             AND bodyType[2] >= bodyType[1]
             AND bodyType[1] <= 1
             AND bodyHigh[1] < ((bodyHigh[2] - bodyLow[2]) * 0.25) + bodyLow[2]         
             AND _high[1] < _high[2] AND _high[1] < _high
             AND _low[1] < _low
             AND direction == 1
             AND _close >= midBody[2];

def _mStarBtm = _mstar
                AND (dTrend OR (recentExhaustion AND !uTrend))
                AND bodyType[2] >= 1
                AND bodyType[1] == 0;

def _mStarCont = _mstar
                 AND (uTrend AND !recentExhaustion)
                 AND bodyLow[1] > ema21
                 AND _close > ema8;

def _eStar = direction[2] == 1
               AND bodyType[2] >= bodyType[1]
               AND bodyType[1] <= 1
               AND bodyLow[1] > ((bodyHigh[2] - bodyLow[2]) * 0.75) + bodyLow[2]
               AND _low[1] > _low[2] AND _low[1] > _low
               AND _high[1] > _high
               AND direction == -1
               AND _close <= midBody[2];

def _eStarTop = _eStar
                AND (uTrend OR (recentExhaustion AND !dTrend))
                AND bodyType[2] >= 1
                AND bodyType[1] == 0;

def _eStarCont = _eStar
                 AND (dTrend AND !recentExhaustion)
                 AND bodyHigh[1] < ema21
                 AND _close < ema8;

plot warning = _engulfingUpTop OR _engulfingDnBtm;

AssignPriceColor(
        if (_engulfingUpTop OR _engulfingDnBtm 
           ) then GlobalColor("mediumYellow")
        else if (_marubozuBull 
                 OR _engulfingBull
                 OR _engulfingUpCont
                 OR _hammerSignal 
                 OR _invHammerSignal
                 OR _piercing
                 OR _haramiBull
                 OR _kickerBull
                 OR _mStarBtm
                 OR _mStarCont 
                ) then GlobalColor("mediumGreen")
        else if (_marubozuBear 
                 OR _engulfingBear
                 OR _engulfingDnCont
                 OR _hangingMan 
                 OR _shootingStar
                 OR _darkCloud
                 OR _haramiBear
                 OR _kickerBear
                 OR _eStarTop
                 OR _eStarCont
                ) then GlobalColor("mediumRed")
        else color.CURRENT);

AssignPriceColor(
    if (_engulfingUpTop[-1] 
        OR _engulfingDnBtm[-1]
       ) then GlobalColor("mediumYellow")
    else if (_marubozuBull[-1] 
             OR _engulfingBull[-1]
             OR _engulfingUpCont[-1]
             OR _piercing[-1]
             OR _haramiBull[-1] 
             OR _kickerBull[-1] 
             OR _mStarBtm[-1]
             OR _mStarCont[-1]
            ) then GlobalColor("mediumGreen")
    else if (_marubozuBear[-1]
             OR _engulfingBear[-1]
             OR _engulfingDnCont[-1]
             OR _darkCloud[-1]
             OR _haramiBear[-1]
             OR _kickerBear[-1] 
             OR _eStarTop[-1]
             OR _eStarCont[-1]
            ) then GlobalColor("mediumRed")
    else color.CURRENT);

AssignPriceColor(
    if (_mStarBtm[-2] OR _mStarCont[-2]) then GlobalColor("mediumGreen")
    else if (_eStarTop[-2] OR _eStarCont[-2]) then GlobalColor("mediumRed")
    else color.CURRENT);

plot bullish = _marubozuBull 
                 OR _engulfingBull
                 OR _engulfingUpCont
                 OR _hammerSignal 
                 OR _invHammerSignal
                 OR _piercing
                 OR _haramiBull
                 OR _kickerBull
                 OR _mStarBtm
                 OR _mStarCont;

plot bearish = _marubozuBear 
                 OR _engulfingBear
                 OR _engulfingDnCont
                 OR _hangingMan 
                 OR _shootingStar
                 OR _darkCloud
                 OR _haramiBear
                 OR _kickerBear
                 OR _eStarTop
                 OR _eStarCont;