declare lower;

input length = 252;
input length2 = 126;
input index = "spx";
input hideSecondLine = yes;

def baseLine = (close(index) - close(index)[length]) / close(index)[length];
def topLine = (close - close[length]) / close[length];

def baseLine2 = (close(index) - close(index)[length2]) / close(index)[length2];
def topLine2 = (close - close[length2]) / close[length2];

plot zeroLine = 0;
plot data = (topLine / baseLine) - 1;
plot data2 = (topLine2 / baseLine2) - 1;

zeroLine.SetPaintingStrategy(PaintingStrategy.LINE);
zeroLine.SetDefaultColor(Color.black);
zeroLine.SetLineWeight(1);

data.SetPaintingStrategy(PaintingStrategy.LINE);
data.SetDefaultColor(Color.blue);
data.SetLineWeight(1);

data2.SetPaintingStrategy(PaintingStrategy.LINE);
data2.SetDefaultColor(Color.plum);
data2.SetLineWeight(1);
def Hide1 =  if hideSecondLine == yes then yes else no;
data2.SetHiding(Hide1);