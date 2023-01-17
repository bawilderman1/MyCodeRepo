declare lower;

input length = 14;
input averageType = AverageType.WILDERS;

def hiDiff = high-high[1];
def loDiff = low[1]-low;
def plusDM = if hiDiff > loDiff and hiDiff > 0 then hiDiff 
             else 0;
def minusDM =  if loDiff > hiDiff and loDiff > 0 then loDiff
               else 0;
def dm = MovingAverage(averageType, plusDM-minusDM, length);

plot DMH = (fold i = 1 to length+1 
            with filter 
            do filter + (1-Cos(2*Double.Pi*i/(length+1)))*
               GetValue(dm, i-1, length-1))/ 
           (fold j = 1 to length+1 
            with sumCoeff 
            do sumCoeff + (1-Cos(2*Double.Pi*j/(length+1))));

plot ZeroLine = 0;

DMH.SetDefaultColor(GetColor(5));
ZeroLine.SetDefaultColor(GetColor(7));
