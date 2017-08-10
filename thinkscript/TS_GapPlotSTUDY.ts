#input BeginDate = 20140721; 
#plot Price = if DaysFromDate(BeginDate) >= 0 and DaysFromDate(BeginDate) <= 50 then close else double.NaN;


input DateBeforeGap = 20140724;
input gapType = {default GapUp, GapDown};
def dayPosition = getdayofweek(datebeforegap);
def DateAfterGap = If dayposition != 5 then dateBeforegap + 1 else dateBeforeGap + 3;
input price = high;
input show_line = Yes;
def price1;
switch (gapType) {
case GapUp:
    price1 = high;
case GapDown:
    price1 = low;};


#before gap low or high depending on gap up or down
def timeTest1 = getYyyyMmDd() == dateBeforeGap;
def data1 = if timetest1 then price1  else double.nan;

def LinePriorToGap = if show_line then highestall(data1) else double.nan;
plot PriceLevel1 = if DaysFromDate(DateBeforeGap) >= 0 then LinePriorToGap else Double.NaN;
pricelevel1.setDefaultColor(color.black);

#after gap low line
def timeTest2 = getYyyyMmDd() == dateAfterGap;
def data2 = if timetest2 then low  else double.nan;

def LineAfterGapLow = if show_line then highestall(data2) else double.nan;
plot PriceLevel2 = if DaysFromDate(DateAfterGap) >= 0 then LineAfterGapLow else Double.NaN;
pricelevel2.setDefaultColor(color.black);

#after gap high line
def timeTest3 = getYyyyMmDd() == dateAfterGap;
def data3 = if timetest3 then high  else double.nan;

def LineAfterGapHigh = if show_line then highestall(data3) else double.nan;
plot PriceLevel3 = if DaysFromDate(DateAfterGap) >= 0 then LineAfterGapHigh else Double.NaN;
pricelevel3.setDefaultColor(color.black);