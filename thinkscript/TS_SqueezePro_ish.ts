declare lower;

input price = close;

def lowCompression = !TTM_Squeeze(price=price,length=20,nk=2.0,nbb=2.0,alertline=1.0).SqueezeAlert;
def midCompression = !TTM_Squeeze(price=price,length=20,nk=1.5,nbb=2.0,alertline=1.0).SqueezeAlert;
def highCompression = !TTM_Squeeze(price=price,length=20,nk=1.0,nbb=2.0,alertline=1.0).SqueezeAlert;

plot Histogram = TTM_Squeeze().Histogram;;
Histogram.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Histogram.SetLineWeight(3);
Histogram.DefineColor("Positive and Up", Color.CYAN);
Histogram.DefineColor("Positive and Down", Color.BLUE);
Histogram.DefineColor("Negative and Down", Color.RED);
Histogram.DefineColor("Negative and Up", Color.YELLOW);
Histogram.AssignValueColor(
    if Histogram >= 0 then if Histogram > Histogram[1] then Histogram.Color("Positive and Up") else Histogram.Color("Positive and Down") 
    else if Histogram < Histogram[1] then Histogram.Color("Negative and Down") 
    else Histogram.Color("Negative and Up"));

plot VolComp = if isNaN(close) then Double.NaN else 0;
VolComp.setPaintingStrategy(PaintingStrategy.POINTS);
VolComp.DefineColor("LowComp", Color.Orange);
VolComp.DefineColor("MidComp", Color.RED);
VolComp.DefineColor("HighComp", Color.YELLOW);
VolComp.DefineColor("Normal", Color.GREEN);
VolComp.SetLineWeight(3);
VolComp.AssignValueColor(
    if highCompression then VolComp.Color("HighComp") 
    else if midCompression then VolComp.Color("MidComp")
    else if lowCompression then VolComp.Color("LowComp")
    else VolComp.Color("Normal"));

plot LowComprAlert = lowCompression;
plot MidComprAlert = midCompression;
plot HighComprAlert = highCompression;