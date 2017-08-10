declare upper;

input atrLength = {"4", default "14", "21"};
input averageType = AverageType.WILDERS;
input rndToTick = yes;
def length;

switch (atrLength) {
case "4":
    length = 4;
case "14":
    length = 14;
case "21":
    length = 21;
}
;

def ATR = MovingAverage(averageType, TrueRange(high, close, low), length);
def roundTo = 1 / TickSize();
def roundWhole = RoundDown(ATR, 0);
def roundFraction = round((ATR-roundWhole)*roundTo,0);
def roundedATR = Round(ATR * roundTo, 0) / roundTo;

#addlabel(1,concat("ATR(",concat(atrLength,concat("): ",(if rndToTick == no then ATR else roundedATR)))),color.blue);
AddLabel(1
    , "ATR(" + atrLength + "): " + 
        (
            if (rndToTick == no) 
                then AsText(ATR) 
            else if (GetSymbol() == "/ZB" or GetSymbol() == "/ZF" or GetSymbol() == "/ZN" or GetSymbol() == "/ZT")
                then roundWhole + "'" + roundFraction
            else AsText(roundedATR)
        )
    , Color.BLUE
);

AddLabel(0, "TickSize: " + TickSize(), Color.BLUE);
AddLabel(0, "TickSize: 1/" + 1 / TickSize(), Color.BLUE);
AddLabel(0, "TickValue: " + AsDollars(TickValue()), Color.BLUE);