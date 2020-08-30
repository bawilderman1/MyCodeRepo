input _timeFrame = 15;

DefineGlobalColor("mediumGreen", CreateColor(103, 191, 92));
DefineGlobalColor("mediumRed", CreateColor(237, 102, 93));

def HMA = HullMovingAvg(close, _timeframe, 0);

def sector = 
    if (GetSymbol() == "$SP500#10") then 1 #"Energy"
    else if (GetSymbol() == "$SP500#15") then 2 #"Materials"
    else if (GetSymbol() == "$SP500#20") then 3 #"Industrials"
    else if (GetSymbol() == "$SP500#25") then 4 #"Cons Disc"
    else if (GetSymbol() == "$SP500#30") then 5 #"Cons Staples"
    else if (GetSymbol() == "$SP500#35") then 6 #"Health"
    else if (GetSymbol() == "$SP500#40") then 7 #"Financials"
    else if (GetSymbol() == "$SP500#45") then 8 #"Info Tech"
    else if (GetSymbol() == "$SP500#50") then 9 #"Telecom"
    else if (GetSymbol() == "$SP500#55") then 10 #"Utilities"
    else if (GetSymbol() == "$SP500#60") then 11 #"Real Estate"
    else Double.NaN
;

AddLabel(!IsNaN(sector), 
         if sector == 1 then "Energy"
            else if sector == 2 then "Materials"
            else if sector == 3 then "Industrials"
            else if sector == 4 then "Cons Disc"
            else if sector == 5 then "Cons Staples"
            else if sector == 6 then "Health"
            else if sector == 7 then "Financials"
            else if sector == 8 then "Info Tech"
            else if sector == 9 then "Telecom"
            else if sector == 10 then "Utilities"
            else if sector == 11 then "Real Estate"
            else "N/A", 
         if HMA > HMA[1] 
            then GlobalColor("mediumGreen")
         else GlobalColor("mediumRed"));