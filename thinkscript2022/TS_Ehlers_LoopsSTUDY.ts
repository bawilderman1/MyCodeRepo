script NormRoofingCalc {
    input Data = hl2;
    input SuperSmootherPeriod = 20;
    input RoofingPeriod = 125;
    
    #Apply HighPass Filter then Super Smoother Filter
    def roof = EhlersRoofingFilter(
        Data,
        SuperSmootherPeriod,
        RoofingPeriod
        ).RoofingFilter;

    #Normalize to Standard Deviations
    def roofMS = CompoundValue(
        1, 
        0.0242 * Sqr(roof) + 0.9758 * roofMS[1], 
        Sqr(roof));    

    def roofRMS = if roofMS == 0 then 0 else roof / Sqrt(roofMS);

    plot Value = roofRMS;
}

declare lower;

DefineGlobalColor("Comp", Color.LIGHT_GRAY);

input LPPeriod = 20;
input HPPeriod = 125;
input Price = FundamentalType.CLOSE;
input Symbol1 = "/ZN";
#input Symbol2= "QQQ";

def s1Data = Fundamental(Price, Symbol1, GetAggregationPeriod());
def s2Data = Fundamental(Price, GetSymbol(), GetAggregationPeriod());

plot Symb1Loop = NormRoofingCalc(s1Data, LPPeriod, HPPeriod);
Symb1Loop.SetDefaultColor(GlobalColor("Comp"));

plot Symb2Loop = NormRoofingCalc(s2Data, LPPeriod, HPPeriod);
Symb2Loop.SetDefaultColor(GetColor(2));

plot Zero = 0;
Zero.SetDefaultColor(Color.WHITE);
Zero.SetStyle(Curve.MEDIUM_DASH);

AddCloud(Symb1Loop, Zero, GlobalColor("Comp"), GlobalColor("Comp"));
