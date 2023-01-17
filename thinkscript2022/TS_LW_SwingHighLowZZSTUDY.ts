declare upper;

DefineGlobalColor("IceBlue", CreateColor(158, 216, 216));

#input Amplitude = 1.0;

def lastBar = !IsNaN(close) and IsNaN(close[-1]);

#def amplPct = Amplitude/100;

def topCase1MidBar = Low[1] < Low and High[1] < High
        and Low > Low[-1] and High > High[-1];

plot Top1 = 
    #Last Bar Checks
    if lastBar[-1] and topCase1MidBar[0]
        then High#+(High*amplPct) 
    #Regular Checks
    else if topCase1MidBar
        then High#+(High*amplPct) 
    else Double.NaN;
Top1.SetDefaultColor(GlobalColor("IceBlue"));
Top1.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);

def btmCase1MidBar = 
    (Low[1] > Low and High[1] > High
     and Low < Low[-1] and High < High[-1]);

plot Bottom1 =
    #Last Bar Checks
    if lastBar[-1] and btmCase1MidBar[0]
        then Low#-(Low*amplPct) 
    #Regular Checks
    else if btmCase1MidBar
        then Low#-(Low*amplPct) 
    else Double.NaN;     
Bottom1.SetDefaultColor(GlobalColor("IceBlue"));
Bottom1.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_DOWN);

def insideBar = (High[1] >= High and Low[1] < Low) or (High[1] > High and Low[1] <= Low);
def outsideBar = (High[1] <= High and Low[1] > Low) or (High[1] < High and Low[1] >= Low);

def topCase2MidOBar1 = High > High[1] and Low > Low[1] 
        and insideBar[-1] 
        and High > High[-2] and Low > Low[-2];
def topCase2MidOBar2 = High > High[2] and Low > Low[2] 
        and outsideBar 
        and High > High[-1] and Low > Low[-1];

plot Top2 = 
    #Last Bar Checks
    if (lastBar[-2] or lastBar[-1]) and topCase2MidOBar2[0]
        then High#+(High*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and topCase2MidOBar1[0]
        then High#+(High*amplPct)
    #Regular Checks
    else if topCase2MidOBar1 or topCase2MidOBar2
        then High#+(High*amplPct) 
    else Double.NaN;
Top2.SetDefaultColor(GlobalColor("IceBlue"));
Top2.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);

def btmCase2MidOBar1 = High < High[1] and Low < Low[1] 
        and insideBar[-1] 
        and High < High[-2] and Low < Low[-2];
def btmCase2MidOBar2 = High < High[2] and Low < Low[2] 
        and outsideBar 
        and High < High[-1] and Low < Low[-1];

plot Bottom2 = 
    #Last Bar Checks
    if (lastBar[-2] or lastBar[-1]) and btmCase2MidOBar2[0]
        then Low#-(Low*amplPct)
    else if (lastBar[-2] or lastBar[-1]) and btmCase2MidOBar1[0]
        then Low#-(Low*amplPct)
    #Regular Checks
    else if btmCase2MidOBar1 or btmCase2MidOBar2
        then Low#-(Low*amplPct) 
    else Double.NaN;
Bottom2.SetDefaultColor(GlobalColor("IceBlue"));
Bottom2.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_DOWN);

def topCase3LastBar = Low[2] < Low[1] and High[2] < High[1]
        and Low[2] > Low and High[1] <= High;

plot Top3 = 
    #Last Bar Checks
    if lastBar[-1] and topCase3LastBar[0]
        then High#[1]
    else if LastBar[0] and topCase3LastBar[0]
        then High#[1]  
    #Regular Checks
    else if topCase3LastBar
        then High#[1] 
    else Double.NaN;
Top3.SetDefaultColor(GlobalColor("IceBlue"));
Top3.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);

def btmCase3LastBar = 
    (Low[2] > Low[1] and High[2] > High[1]
     and Low[1] >= Low and High[2] < High);

plot Bottom3 =
    #Last Bar Checks
    if lastBar[-1] and btmCase3LastBar[0]
        then Low#[1]
    else if LastBar[0] and btmCase3LastBar[0]
        then Low#[1]  
    #Regular Checks
    else if btmCase3LastBar
        then Low#[1]
    else Double.NaN;     
Bottom3.SetDefaultColor(GlobalColor("IceBlue"));
Bottom3.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_DOWN);

def topCase4 = btmCase3LastBar && close <= low[1];
plot Top4 =
    #Last Bar Checks
    if lastBar[-1] and topCase4[0]
        then High#[1]
    else if LastBar[0] and topCase4[0]
        then High#[1]  
    #Regular Checks
    else if topCase4
        then High#[1] 
    else Double.NaN;
Top4.SetDefaultColor(GetColor(4));
Top4.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);

def btmCase4 = topCase3LastBar && close >= high[1];
plot Bottom4 =
    #Last Bar Checks
    if lastBar[-1] and btmCase4[0]
        then Low#[1]
    else if LastBar[0] and btmCase4[0]
        then Low#[1]  
    #Regular Checks
    else if btmCase4
        then Low#[1]
    else Double.NaN;     
Bottom4.SetDefaultColor(GetColor(4));
Bottom4.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_DOWN);
