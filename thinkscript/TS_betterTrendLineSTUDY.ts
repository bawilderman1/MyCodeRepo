
###############################
#### Trend Line Plot       ####
###############################
input TrendLineLength1 = 50;
input TrendLineLength2 = 30;
input TrendLineLength3 = 10;

def Inertia1 = InertiaAll(close, TrendLineLength1);
def Inertia2 = InertiaAll(close, TrendLineLength2);
def Inertia3 = InertiaAll(close, TrendLineLength3);

def TL_Bull1 = Inertia1 - (HighestAll(AbsValue(Inertia1 - close)) * 0.8);
def TL_Bear1 = Inertia1 + (HighestAll(AbsValue(Inertia1 - close)) * 0.8);
def slope1a = TL_Bull1 > TL_Bull1[1];
def slope1b = TL_Bear1 > TL_Bear1[1];

def TL_Bull2 = Inertia2 - (HighestAll(AbsValue(Inertia2 - close)) * 0.8);
def TL_Bear2 = Inertia2 + (HighestAll(AbsValue(Inertia2 - close)) * 0.8);
def slope2a = TL_Bull2 > TL_Bull2[1];
def slope2b = TL_Bear2 > TL_Bear2[1];

def TL_Bull3 = Inertia3 - (HighestAll(AbsValue(Inertia3 - close)) * 0.8);
def TL_Bear3 = Inertia3 + (HighestAll(AbsValue(Inertia3 - close)) * 0.8);
def slope3a = TL_Bull3 > TL_Bull3[1];
def slope3b = TL_Bear3 > TL_Bear3[1];

#### Long length ####
plot TrendLine1a = if slope1a > 0 then TL_Bull1 else TL_Bear1;
TrendLine1a.SetStyle(curve.long_dash);
TrendLine1a.SetLineWeight(1);
TrendLine1a.assignvaluecolor(if slope1a and IsAscending(close, 10) then color.BLACK else if slope1a then color.BLACK else if !IsAscending(close, 10)then color.BLACK else color.BLACK);

plot TrendLine1b = if slope1b > 0 then TL_Bear1 else TL_Bull1;
TrendLine1b.SetStyle(curve.long_dash);
TrendLine1b.SetLineWeight(1);
TrendLine1b.assignvaluecolor(if slope1b and IsAscending(close, 10) then color.BLACK else if slope1b then color.BLACK else if !IsAscending(close, 10)then color.BLACK else color.BLACK);

#### Medium length ####
plot TrendLine2a = if slope2a > 0 then TL_Bull2 else TL_Bear2;
TrendLine2a.SetStyle(curve.medium_dash);
TrendLine2a.SetLineWeight(2);
TrendLine2a.assignvaluecolor(if slope2a and IsAscending(close, 10) then color.LIGHT_GREEN else if slope2a then color.DARK_GREEN else if !IsAscending(close, 10)then color.LIGHT_RED else color.DARK_RED);

plot TrendLine2b = if slope2b > 0 then TL_Bear2 else TL_Bull2;
TrendLine2b.SetStyle(curve.medium_dash);
TrendLine2b.SetLineWeight(2);
TrendLine2b.assignvaluecolor(if slope2b and IsAscending(close, 10) then color.LIGHT_GREEN else if slope2b then color.DARK_GREEN else if !IsAscending(close, 10)then color.LIGHT_RED else color.DARK_RED);

#### Short length ####
plot TrendLine3a = if slope3a > 0 then TL_Bull3 else TL_Bear3;
TrendLine3a.SetStyle(curve.short_dash);
TrendLine3a.SetLineWeight(3);
TrendLine3a.assignvaluecolor(if slope3a and IsAscending(close, 10) then color.LIGHT_GREEN else if slope3a then color.DARK_GREEN else if !IsAscending(close, 10)then color.LIGHT_RED else color.DARK_RED);

plot TrendLine3b = if slope3b > 0 then TL_Bear3 else TL_Bull3;
TrendLine3b.SetStyle(curve.short_dash);
TrendLine3b.SetLineWeight(3);
TrendLine3b.assignvaluecolor(if slope3b and IsAscending(close, 10) then color.LIGHT_GREEN else if slope3b then color.DARK_GREEN else if !IsAscending(close, 10)then color.LIGHT_RED else color.DARK_RED);