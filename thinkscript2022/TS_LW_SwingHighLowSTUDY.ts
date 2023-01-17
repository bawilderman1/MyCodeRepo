declare upper;

DefineGlobalColor("IceBlue", CreateColor(158, 216, 216));

input Amplitude = 1.0;

def lastBar = !IsNaN(close) and IsNaN(close[-1]);

def amplPct = Amplitude/100;

def topCase1FirstBar = Low < Low[-1] and High < High[-1]
        and Low[-1] > Low[-2] and High[-1] > High[-2];
def topCase1MidBar = Low[1] < Low and High[1] < High
        and Low > Low[-1] and High > High[-1];
def topCase1LastBar = Low[2] < Low[1] and High[2] < High[1]
        and Low[1] > Low and High[1] > High;

plot Top1 = 
    #Last Bar Checks
    if lastBar[-1] and topCase1LastBar[0]
        then High[1]
    else if LastBar[0] and topCase1LastBar[0]
        then High[1]  
    else if lastBar[-1] and topCase1MidBar[0]
        then High+(High*amplPct) 
    #Regular Checks
    else 
    if topCase1FirstBar   
        then High[-1]
    else if topCase1MidBar
        then High+(High*amplPct) 
    else if topCase1LastBar
        then High[1] 
    else Double.NaN;
Top1.SetDefaultColor(GlobalColor("IceBlue"));
Top1.SetPaintingStrategy(PaintingStrategy.POINTS);

def btmCase1FirstBar = 
    (Low > Low[-1] and High > High[-1]
     and Low[-1] < Low[-2] and High[-1] < High[-2]);
def btmCase1MidBar = 
    (Low[1] > Low and High[1] > High
     and Low < Low[-1] and High < High[-1]);
def btmCase1LastBar = 
    (Low[2] > Low[1] and High[2] > High[1]
     and Low[1] < Low and High[1] < High);

plot Bottom1 =
    #Last Bar Checks
    if lastBar[-1] and btmCase1LastBar[0]
        then Low[1]
    else if LastBar[0] and btmCase1LastBar[0]
        then Low[1]  
    else
    if lastBar[-1] and btmCase1MidBar[0]
        then Low-(Low*amplPct) 
    #Regular Checks
    else if btmCase1FirstBar
        then Low[-1]
    else if btmCase1MidBar
        then Low-(Low*amplPct) 
    else if btmCase1LastBar
        then Low[1]
    else Double.NaN;     
Bottom1.SetDefaultColor(GlobalColor("IceBlue"));
Bottom1.SetPaintingStrategy(PaintingStrategy.POINTS);

def insideBar = (High[1] >= High and Low[1] < Low) or (High[1] > High and Low[1] <= Low);
def outsideBar = (High[1] <= High and Low[1] > Low) or (High[1] < High and Low[1] >= Low);

def topCase2FirstBar = Low < Min(Low[-1], Low[-2]) and High < MAX(High[-1], High[-2])
        and (insideBar[-2] or outsideBar[-2])
        and Min(Low[-1], Low[-2]) > Low[-3] and MAX(High[-1], High[-2]) > High[-3];
def topCase2MidOBar1 = High > High[1] and Low > Low[1] 
        and insideBar[-1] 
        and High > High[-2] and Low > Low[-2];
def topCase2MidOBar2 = High > High[2] and Low > Low[2] 
        and outsideBar 
        and High > High[-1] and Low > Low[-1];
def topCase2MidIBar1 = High[1] > High[2] and Low[1] > Low[2] 
        and insideBar 
        and Low[1] > Low[-1] and High[1] > High[-1];
def topCase2MidIBar2 = High[-1] > High[1] and Low[-1] > Low[1] 
        and outsideBar[-1] 
        and Low[-1] > Low[-2] and High[-1] > High[-2];
def topCase2LastBar = Low[3] < Min(Low[2], Low[1]) and High[3] < MAX(High[2], High[1])
        and (insideBar[1] or outsideBar[1])
        and Min(Low[1], Low[2]) > Low and MAX(High[1], High[2]) > High;

plot Top2 = 
    #Last Bar Checks
    if (lastBar[-2] or lastBar[-1] or lastBar[0]) and topCase2LastBar[0]
        then Max(High[1], High[2])
    else if (lastBar[-2] or lastBar[-1]) and topCase2MidOBar2[0]
        then High+(High*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and topCase2MidIBar1[0]
        then High[1]+(High[1]*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and topCase2MidIBar2[0]
        then High[-1]+(High[-1]*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and topCase2MidOBar1[0]
        then High+(High*amplPct)
    #Regular Checks
    else 
    if topCase2FirstBar   
        then MAX(High[-1], High[-2])
    else if topCase2MidOBar1 or topCase2MidOBar2
        then High+(High*amplPct) 
    else if topCase2MidIBar1
        then High[1] + (High[1]*amplPct)
    else if topCase2MidIBar2
        then High[-1] + (High[-1]*amplPct)
    else if topCase2LastBar
        then Max(High[1], High[2]) 
    else Double.NaN;
Top2.SetDefaultColor(Color.RED);
Top2.SetPaintingStrategy(PaintingStrategy.POINTS);

def btmCase2FirstBar = Low > Min(Low[-1], Low[-2]) and High > Max(High[-1], High[-2])
        and (insideBar[-2] or outsideBar[-2])
        and Min(Low[-1], Low[-2]) < Low[-3] and Max(High[-1], High[-2]) < High[-3];
def btmCase2MidOBar1 = High < High[1] and Low < Low[1] 
        and insideBar[-1] 
        and High < High[-2] and Low < Low[-2];
def btmCase2MidOBar2 = High < High[2] and Low < Low[2] 
        and outsideBar 
        and High < High[-1] and Low < Low[-1];
def btmCase2MidIBar1 = High[1] < High[2] and Low[1] < Low[2] 
        and insideBar 
        and Low[1] < Low[-1] and High[1] < High[-1];
def btmCase2MidIBar2 = High[-1] < High[1] and Low[-1] < Low[1] 
        and outsideBar[-1] 
        and Low[-1] < Low[-2] and High[-1] < High[-2];
def btmCase2LastBar = Low[3] > Min(Low[2], Low[1]) and High[3] > Max(High[2], High[1])
        and (insideBar[1] or outsideBar[1])
        and Min(Low[1], Low[2]) < Low and Max(High[1], High[2]) < High;

plot Bottom2 = 
    #Last Bar Checks
    if (lastBar[-2] or lastBar[-1] or lastBar[0]) and btmCase2LastBar[0]
        then Min(Low[1], Low[2])
    else if (lastBar[-2] or lastBar[-1]) and btmCase2MidOBar2[0]
        then Low-(Low*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and btmCase2MidIBar1[0]
        then Low[1]-(Low[1]*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and btmCase2MidIBar2[0]
        then Low[-1]-(Low[-1]*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and btmCase2MidOBar1[0]
        then Low-(Low*amplPct)
    #Regular Checks
    else 
    if btmCase2FirstBar   
        then Min(Low[-1], Low[-2])
    else if btmCase2MidOBar1 or btmCase2MidOBar2
        then Low-(Low*amplPct) 
    else if btmCase2MidIBar1
        then Low[1] - (Low[1]*amplPct)
    else if btmCase2MidIBar2
        then Low[-1] - (Low[-1]*amplPct)
    else if btmCase2LastBar
        then Min(Low[1], Low[2]) 
    else Double.NaN;
Bottom2.SetDefaultColor(Color.RED);
Bottom2.SetPaintingStrategy(PaintingStrategy.POINTS);

def topCase3FirstBar = Low < Low[-1] and High < High[-1]
        and Low > Low[-2] and High[-1] <= High[-2];
def topCase3MidBar = Low[1] < Low and High[1] < High
        and Low[1] > Low[-1] and High <= High[-1];
def topCase3LastBar = Low[2] < Low[1] and High[2] < High[1]
        and Low[2] > Low and High[1] <= High;


plot Top3 = 
    #Last Bar Checks
    if lastBar[-1] and topCase3LastBar[0]
        then High[1]
    else if LastBar[0] and topCase3LastBar[0]
        then High[1]  
    else if lastBar[-1] and topCase3MidBar[0]
        then High+(High*amplPct) 
    #Regular Checks
    else 
    if topCase3FirstBar   
        then High[-1]
    else if topCase3MidBar
        then High+(High*amplPct) 
    else if topCase3LastBar
        then High[1] 
    else Double.NaN;
Top3.SetDefaultColor(Color.UPTICK);
Top3.SetPaintingStrategy(PaintingStrategy.POINTS);

def btmCase3FirstBar = 
    (Low > Low[-1] and High > High[-1]
     and Low[-1] >= Low[-2] and High < High[-2]);
def btmCase3MidBar = 
    (Low[1] > Low and High[1] > High
     and Low >= Low[-1] and High[1] < High[-1]);
def btmCase3LastBar = 
    (Low[2] > Low[1] and High[2] > High[1]
     and Low[1] >= Low and High[2] < High);

plot Bottom3 =
    #Last Bar Checks
    if lastBar[-1] and btmCase3LastBar[0]
        then Low[1]
    else if LastBar[0] and btmCase3LastBar[0]
        then Low[1]  
    else
    if lastBar[-1] and btmCase3MidBar[0]
        then Low-(Low*amplPct) 
    #Regular Checks
    else if btmCase3FirstBar
        then Low[-1]
    else if btmCase3MidBar
        then Low-(Low*amplPct) 
    else if btmCase3LastBar
        then Low[1]
    else Double.NaN;     
Bottom3.SetDefaultColor(Color.UPTICK);
Bottom3.SetPaintingStrategy(PaintingStrategy.POINTS);

