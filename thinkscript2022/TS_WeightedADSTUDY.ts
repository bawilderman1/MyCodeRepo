script ChangeFromOpen {
    input Symbol = "SPY";

    def sOpen = open(
        symbol = Symbol, 
        period = AggregationPeriod.DAY);
    def sClose = close(
        symbol = Symbol,
        period = GetAggregationPeriod());

    plot Change = sClose-sOpen;
}

declare lower;
declare hide_on_daily;

input EnergyWt = 0.048;
input MaterialsWt = 0.028;
input IndustrialsWt = 0.078;
input DiscretionaryWt = 0.109;
input StaplesWt = 0.065;
input HealthWt = 0.144;
input FinanceWt = 0.112;
input TechWt = 0.271;
input CommunicationsWt = 0.088;
input UtilitiesWt = 0.03;
input RealEstateWt = 0.028;

#def equalWt = 0.0909;

def securities = close("$ADVSP")+close("$DECLSP");
plot AdLine = close("$ADVSP")-close("$DECLSP");
AdLine.SetDefaultColor(GetColor(2));

def energyChg = ChangeFromOpen("$SP500#10").Change;
def materialsChg = ChangeFromOpen("$SP500#15").Change;
def industrialsChg = ChangeFromOpen("$SP500#20").Change;
def discretionaryChg = ChangeFromOpen("$SP500#25").Change;
def staplesChg = ChangeFromOpen("$SP500#30").Change;
def healthChg = ChangeFromOpen("$SP500#35").Change;
def financeChg = ChangeFromOpen("$SP500#40").Change;
def techChg = ChangeFromOpen("$SP500#45").Change;
def communicationsChg = ChangeFromOpen("$SP500#50").Change;
def utilitiesChg = ChangeFromOpen("$SP500#55").Change;
def realEstateChg = ChangeFromOpen("$SP500#60").Change;

def weightedAdv = (
    (if energyChg > 0 then EnergyWt else 0) +
    (if materialsChg > 0 then MaterialsWt else 0) +
    (if industrialsChg > 0 then IndustrialsWt else 0) +
    (if discretionaryChg > 0 then DiscretionaryWt else 0) +
    (if staplesChg > 0 then StaplesWt else 0) +
    (if healthChg > 0 then HealthWt else 0) +
    (if financeChg > 0 then FinanceWt else 0) +
    (if techChg > 0 then TechWt else 0) +
    (if communicationsChg > 0 then CommunicationsWt else 0) +
    (if utilitiesChg > 0 then UtilitiesWt else 0) +
    (if realEstateChg > 0 then RealEstateWt else 0)
    ) * securities;

def weightedDecl = (
    (if energyChg < 0 then EnergyWt else 0) +
    (if materialsChg < 0 then MaterialsWt else 0) +
    (if industrialsChg < 0 then IndustrialsWt else 0) +
    (if discretionaryChg < 0 then DiscretionaryWt else 0) +
    (if staplesChg < 0 then StaplesWt else 0) +
    (if healthChg < 0 then HealthWt else 0) +
    (if financeChg < 0 then FinanceWt else 0) +
    (if techChg < 0 then TechWt else 0) +
    (if communicationsChg < 0 then CommunicationsWt else 0) +
    (if utilitiesChg < 0 then UtilitiesWt else 0) +
    (if realEstateChg < 0 then RealEstateWt else 0)
    ) * securities;

plot WeightedAd = weightedAdv - weightedDecl;
WeightedAd.SetDefaultColor(GetColor(3));
WeightedAd.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
#plot test = weightedAdv + weightedDecl;
#plot testadv = weightedAdv;
#plot testdec = weightedDecl;

#plot SectorWeighted = 
#    (energyChg * EnergyWt) +
#    (materialsChg * MaterialsWt) +
#    (industrialsChg * IndustrialsWt) +
#    (discretionaryChg * DiscretionaryWt) +
#    (staplesChg * StaplesWt) +
#    (healthChg * HealthWt) +
#    (financeChg * FinanceWt) +
#    (techChg * TechWt) +
#    (communicationsChg * CommunicationsWt) +
#    (utilitiesChg * UtilitiesWt) +
#    (realEstateChg * RealEstateWt);
#SectorWeighted.SetDefaultColor(GetColor(1));
#SectorWeighted.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);

#plot EqualWeighted = 
#    (energyChg * equalWt) +
#    (materialsChg * equalWt) +
#    (industrialsChg * equalWt) +
#    (discretionaryChg * equalWt) +
#    (staplesChg * equalWt) +
#    (healthChg * equalWt) +
#    (financeChg * equalWt) +
#    (techChg * equalWt) +
#    (communicationsChg * equalWt) +
#    (utilitiesChg * equalWt) +
#    (realEstateChg * equalWt);
#EqualWeighted.SetDefaultColor(GetColor(2));
