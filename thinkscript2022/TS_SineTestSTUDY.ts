declare lower;
input BaseHeight = 10;
input Amplitude = 3;

#for 7+3 the base of Sin will be at 10 and peak at 10+3*0.5=11.5
def yOffset = BaseHeight-Amplitude;
def amplOffset30 = (1*amplitude)/2;
def amplOffset60 = (Sqrt(3*amplitude))/2;

plot blah2 = if GetWeek() == 15 then amplOffset30+yOffset+amplitude*Sin(1*Double.Pi/6) 
            else if GetWeek() == 16 then amplOffset30+yOffset+amplitude*Sin(3*Double.Pi/6)
            else if GetWeek() == 17 then amplOffset30+yOffset+amplitude*Sin(5*Double.Pi/6)
            else Double.NaN;

plot blah3 = if GetWeek() == 10 then -amplOffset30-yOffset-Amplitude*Sin(1*Double.Pi/6) 
            else if GetWeek() == 11 then -amplOffset30-yOffset-Amplitude*Sin(3*Double.Pi/6)
            else if GetWeek() == 12 then -amplOffset30-yOffset-Amplitude*Sin(5*Double.Pi/6)
            else Double.NaN;

plot blah4 = if GetWeek() == 19 then amplOffset60+yOffset+Amplitude*Sin(1*Double.Pi/6) 
            else if GetWeek() == 20 then amplOffset60+yOffset+Amplitude*Sin(2*Double.Pi/6)
            else if GetWeek() == 21 then amplOffset60+yOffset+Amplitude*Sin(4*Double.Pi/6)
            else if GetWeek() == 22 then amplOffset60+yOffset+Amplitude*Sin(5*Double.Pi/6)
            else Double.NaN;

plot blah5 = if GetWeek() == 15 then -amplOffset60-yOffset-Amplitude*Sin(1*Double.Pi/6) 
            else if GetWeek() == 16 then -amplOffset30-yOffset-Amplitude*Sin(3*Double.Pi/6)
            else if GetWeek() == 17 then -amplOffset30-yOffset-Amplitude*Sin(3*Double.Pi/6)
            else if GetWeek() == 18 then -amplOffset60-yOffset-Amplitude*Sin(5*Double.Pi/6)
            else Double.NaN;

