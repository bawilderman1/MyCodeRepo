declare lower;

def strike = GetStrike();
def underlying = Close(GetUnderlyingSymbol());
def extrinsicBase = if IsPut() then
    if underlying >= strike then
        close
        else close - (strike - underlying)
    else if !IsPut() then
        if underlying <= strike then
            close
            else close - (underlying - strike)
    else Double.NaN; 
plot Extrinsic = Round(Max(extrinsicBase, 0), 2);
Extrinsic.SetDefaultColor(GetColor(4));

#plot Zero = if !IsNaN(close) then 0 else Double.NaN;
#Zero.SetDefaultColor(GetColor(4));

AddCloud(Extrinsic, 0, GetColor(4), GetColor(4));
