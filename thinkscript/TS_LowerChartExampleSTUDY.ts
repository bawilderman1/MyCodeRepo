declare lower;
input type = ChartType.CANDLE;
input symbol = "$VOLSPD";
input zeroLineRange = 25;

def hideZero;
if (close(symbol) between (-1*zeroLineRange*1000000) and (zeroLineRange*1000000))
     then {hideZero = no;} 
else {hideZero = yes;}

AddChart(high = high(symbol), low  = low(symbol), open = open(symbol), close = close(symbol), type = type , growColor = Color.BLUE, fallColor = color.downtick, neutralColor = Color.GRAY);

plot zeroLine = 0;
zeroLine.setpaintingStrategy(paintingStrategy.LINE);
zeroLine.setdefaultColor(color.black);
zeroLine.sethiding(hideZero);

plot avg = MovingAverage(averageType.EXPONENTIAL, close(symbol), 15);
avg.setdefaultColor(color.dark_orange);

addLabel(no,close(symbol),color.blue);
addLabel(no,(-1*zeroLineRange*1000000),color.blue);
addLabel(no,(zeroLineRange*1000000),color.blue);
addLabel(no,hideZero,color.blue);