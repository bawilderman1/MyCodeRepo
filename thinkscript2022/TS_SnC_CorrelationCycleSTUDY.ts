declare lower;

input length = 14;
input ShowCorrelation = yes;
input ShowState = yes;
input ShowPhasor = no;

#Correlate price with cosine wave having a fixed period 
def sx = Sum(close, length);
def sxx = Sum(Sqr(close), length);
def sy1 = fold i1 = 0 to length 
          with s1 
          do (s1+Cos(2*Double.Pi*i1/length));
def sxy1 = fold i2 = 0 to length 
           with s2 
           do (s2+GetValue(close,i2)*
               Cos(2*Double.Pi*i2/length));
def syy1 = fold i3 = 0 to length 
           with s3 
           do (s3+Sqr(Cos(2*Double.Pi*i3/length)));

def corrCosine = (length*sxy1-sx*sy1)/
                  Sqrt((length*sxx-Sqr(sx))*
                  (length*syy1-Sqr(sy1)));

plot CorrelationWithCosine = if (ShowCorrelation) then corrCosine else Double.NaN;
CorrelationWithCosine.SetDefaultColor(GetColor(5));

#Correlate with a negative sine wave having a fixed period 
def sy2 = fold j1 = 0 to length 
          with t1 
          do (t1-Sin(2*Double.Pi*t1/length));
def sxy2 = fold j2 = 0 to length 
           with t2 
           do (t2-GetValue(close,j2)*
               Sin(2*Double.Pi*j2/length));
def syy2 = fold j3 = 0 to length 
           with t3 
           do (t3+Sqr(Sin(2*Double.Pi*j3/length)));

def corrNegSine = (length*sxy2-sx*sy2)/
                   Sqrt((length*sxx-Sqr(sx))*
                   (length*syy2-Sqr(sy2)));


plot CorrealtionWithNegativeSine = if (ShowCorrelation) then corrNegSine else Double.NaN;
CorrealtionWithNegativeSine.SetDefaultColor(GetColor(6));

#Compute the angle as an arctangent function and resolve ambiguity 
def a1 = if (corrNegSine <> 0) 
            then 90+ATan(corrCosine/corrNegSine)*180/Double.Pi 
         else 0;
def a2 = if corrNegSine > 0 then a1-180 else a1;
def a3 = if (a2[1]-a2 < 270 and a2<a2[1]) then a2[1] else a2;
plot Phasor = if (ShowPhasor) then a3 else Double.NaN;

#Compute and plot market state 
#1 = PosTrend, -1 = NegTrend, 0 = Cycling
def aS = if (AbsValue(a3-a3[1]) < 9 and a3 < 0)
             then -1
         else if(AbsValue(a3-a3[1]) < 9 and a3 >= 0)
             then 1
         else 0;
plot State = if (ShowState) then aS else Double.NaN;

# Extras
plot Zero = 0;
Zero.SetDefaultColor(GetColor(4));

AddCloud(State, Zero, GetColor(4), GetColor(4));

plot ReversionSell = if (CorrealtionWithNegativeSine crosses below 0 and ShowCorrelation) 
                         then CorrelationWithCosine*0.5 
                     else Double.NaN;
ReversionSell.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
ReversionSell.SetDefaultColor(Color.YELLOW);

plot ReversionBuy = if (CorrealtionWithNegativeSine crosses above 0 and ShowCorrelation) 
                        then CorrelationWithCosine*0.5 
                    else Double.NaN;
ReversionBuy.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
ReversionBuy.SetDefaultColor(Color.CYAN);

