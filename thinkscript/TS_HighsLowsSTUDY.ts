#written for intraday use
#def h3 = high > Highest(high[-3], 3);
#def highLevel = if GetDay() != GetDay()[1] then high else if h3 and high > highLevel[1] #then high else highLevel[1];

#def l3 = low < Lowest(low[-3], 3);
#def lowLevel = if GetDay() != GetDay()[1] then low else if l3 and low < lowLevel[1] then #low else lowLevel[1];

def h3 = high > Highest(high[-3], 3);
def highLevel = if GetMonth() != GetMonth()[1] then high else if h3 and high > highLevel[1] then high else highLevel[1];

def l3 = low < Lowest(low[-3], 3);
def lowLevel = if GetMonth() != GetMonth()[1] then low else if l3 and low < lowLevel[1] then low else lowLevel[1];

plot HL = highLevel;
     HL.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
     HL.SetDefaultColor(Color.UPTICK);
plot LL = lowLevel;
     LL.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
     LL.SetDefaultColor(Color.DOWNTICK);

