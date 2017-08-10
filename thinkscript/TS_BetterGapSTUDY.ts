#http://www.researchtrade.com/forum/read.php?7,2258
# Billy Bob's Better Gap Indicator
input Detect_Gaps_By = {default "percent", "dollars"};
input Min_Gap_Size = 1.0;
input NumberOfGapsToTrack = {default "3", "2", "1"};
input ShowGapIndicatorBubbles = yes;
input show_gap_mid_line = yes;
input show_half_gap_move_up = yes;
input show_half_gap_move_down = yes;
input show_full_gap_move_up = yes;
input show_full_gap_move_down = yes;

# Decide how many simultaneous gaps to track
def show_gap2;
def show_gap3;
switch (numberOfGapsToTrack) {
    case "3":
        show_gap2 = yes;
        show_gap3 = yes;
    case "2":
        show_gap2 = yes;
        show_gap3 = no;
    case "1":
        show_gap2 = no;
        show_gap3 = no;
};

# Declare Global Colors
DefineGlobalColor("gap top", CreateColor(165, 138, 193));
DefineGlobalColor("gap bottom", CreateColor(165, 138, 193));
DefineGlobalColor("gap middle", CreateColor(155, 206, 225));
DefineGlobalColor("gap half up", CreateColor(134, 202, 93));
DefineGlobalColor("gap full up", CreateColor(224, 243, 177));
DefineGlobalColor("gap half down", CreateColor(250, 141, 183));
DefineGlobalColor("gap full down", CreateColor(253, 222, 238));

# Define Candle Body
def bodyTop = Max(open, close);
def bodyBottom = Min(open, close);

# Define Gap Lines
def GapTop = Max(bodyBottom, bodyBottom[1]);
def GapBottom = Min(bodyTop, bodyTop[1]);
def GapMiddle = if show_gap_mid_line then (GapTop + GapBottom) / 2 else Double.NaN;
def GapHalfUp = if show_half_gap_move_up then GapTop + (GapTop - GapBottom) / 2 else Double.NaN;
def GapHalfDown = if show_half_gap_move_down then GapBottom - (GapTop - GapBottom) / 2 else Double.NaN;
def GapFullUp = if show_full_gap_move_up then GapTop + (GapTop - GapBottom) else Double.NaN;
def GapFullDown = if show_full_gap_move_down then GapBottom - (GapTop - GapBottom) else Double.NaN;

# Define a gap and its direction
def MinGapSize;
switch (Detect_Gaps_By) {
    case "percent":
        MinGapSize = Min(close[1] * (Min_Gap_Size/100),5);
    case "dollars":
        MinGapSize = Min_Gap_Size;
};

def GapUp = bodyBottom - bodyTop[1] >= MinGapSize;
def GapDown = bodyTop - bodyBottom[1] <= -MinGapSize;
def isGap = GapUp or GapDown;

AddChartBubble(ShowGapIndicatorBubbles and GapUp[-1], bodyBottom[-1], bodyBottom[-1], GlobalColor("gap half up" ), no);
AddChartBubble(ShowGapIndicatorBubbles and GapUp[-1], bodyTop, bodyTop, GlobalColor("gap half up" ));

AddChartBubble(ShowGapIndicatorBubbles and GapDown[-1], bodyTop[-1], bodyTop[-1], GlobalColor("gap half down" ));
AddChartBubble(ShowGapIndicatorBubbles and GapDown[-1], bodyBottom, bodyBottom, GlobalColor("gap half down" ),no);

# Define recursive variables
# Set variables for the first gap
rec gt1 = if isGap then GapTop else gt1[1];
rec gb1 = if isGap then GapBottom else gb1[1];
rec gm1 = if isGap then GapMiddle else gm1[1];
rec ghu1 = if isGap then GapHalfUp else ghu1[1];
rec ghd1 = if isGap then GapHalfDown else ghd1[1];
rec gfu1 = if isGap then GapFullUp else gfu1[1];
rec gfd1 = if isGap then GapFullDown else gfd1[1];

# Set variables for the second gap
rec gt2 = if isGap and gt2[1] <> gt1[1] then gt1[1] else gt2[1];
rec gb2 = if isGap and gb2[1] <> gb1[1] then gb1[1] else gb2[1];
rec gm2 = if isGap and gm2[1] <> gm1[1] then gm1[1] else gm2[1];
rec ghu2 = if isGap and ghu2[1] <> ghu1[1] then ghu1[1] else ghu2[1];
rec ghd2 = if isGap and ghd2[1] <> ghd1[1] then ghd1[1] else ghd2[1];
rec gfu2 = if isGap and gfu2[1] <> gfu1[1] then gfu1[1] else gfu2[1];
rec gfd2 = if isGap and gfd2[1] <> gfd1[1] then gfd1[1] else gfd2[1];

# Set variables for the third gap
rec gt3 = if isGap and gt3[1] <> gt2[1] then gt2[1] else gt3[1];
rec gb3 = if isGap and gb3[1] <> gb2[1] then gb2[1] else gb3[1];
rec gm3 = if isGap and gm3[1] <> gm2[1] then gm2[1] else gm3[1];
rec ghu3 = if isGap and ghu3[1] <> ghu2[1] then ghu2[1] else ghu3[1];
rec ghd3 = if isGap and ghd3[1] <> ghd2[1] then ghd2[1] else ghd3[1];
rec gfu3 = if isGap and gfu3[1] <> gfu2[1] then gfu2[1] else gfu3[1];
rec gfd3 = if isGap and gfd3[1] <> gfd2[1] then gfd2[1] else gfd3[1];

# Plot Gap Lines
# plot the first gap
plot pgt1 = if gt1 == 0 then double.nan else gt1;
plot pgb1 = if gb1 == 0 then double.nan else gb1;
plot pgm1 = if gm1 == 0 then double.nan else gm1;
plot pghu1 = if ghu1 == 0 then double.nan else ghu1;
plot pghd1 = if ghd1 == 0 then double.nan else ghd1;
plot pgfu1 = if gfu1 == 0 then double.nan else gfu1;
plot pgfd1 = if gfd1 == 0 then double.nan else gfd1;

pgt1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgb1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgm1.SetPaintingStrategy(PaintingStrategy.DASHES);
pghu1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pghd1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgfu1.SetPaintingStrategy(PaintingStrategy.DASHES);
pgfd1.SetPaintingStrategy(PaintingStrategy.DASHES);

pgt1.SetLineWeight(2);
pgb1.SetLineWeight(2);
pghu1.SetLineWeight(2);
pghd1.SetLineWeight(2);

pgt1.AssignValueColor(GlobalColor("gap top" ));
pgb1.AssignValueColor(GlobalColor("gap bottom" ));
pgm1.AssignValueColor(GlobalColor("gap middle" ));
pghu1.AssignValueColor(GlobalColor("gap half up" ));
pghd1.AssignValueColor(GlobalColor("gap half down" ));
pgfu1.AssignValueColor(GlobalColor("gap full up" ));
pgfd1.AssignValueColor(GlobalColor("gap full down" ));

# Plot the second gap
plot pgt2 = if gt2 == 0 then double.nan else gt2;
plot pgb2 = if gb2 == 0 then double.nan else gb2;
plot pgm2 = if gm2 == 0 then double.nan else gm2;
plot pghu2 = if ghu2 == 0 then double.nan else ghu2;
plot pghd2 = if ghd2 == 0 then double.nan else ghd2;
plot pgfu2 = if gfu2 == 0 then double.nan else gfu2;
plot pgfd2 = if gfd2 == 0 then double.nan else gfd2;

pgt2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgb2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgm2.SetPaintingStrategy(PaintingStrategy.DASHES);
pghu2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pghd2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgfu2.SetPaintingStrategy(PaintingStrategy.DASHES);
pgfd2.SetPaintingStrategy(PaintingStrategy.DASHES);

pgt2.SetLineWeight(2);
pgb2.SetLineWeight(2);
pghu2.SetLineWeight(2);
pghd2.SetLineWeight(2);

pgt2.AssignValueColor(GlobalColor("gap top" ));
pgb2.AssignValueColor(GlobalColor("gap bottom" ));
pgm2.AssignValueColor(GlobalColor("gap middle" ));
pghu2.AssignValueColor(GlobalColor("gap half up" ));
pghd2.AssignValueColor(GlobalColor("gap half down" ));
pgfu2.AssignValueColor(GlobalColor("gap full up" ));
pgfd2.AssignValueColor(GlobalColor("gap full down" ));

pgt2.sethiding(if show_gap2 then 0 else 1);
pgb2.sethiding(if show_gap2 then 0 else 1);
pgm2.sethiding(if show_gap2 then 0 else 1);
pghu2.sethiding(if show_gap2 then 0 else 1);
pghd2.sethiding(if show_gap2 then 0 else 1);
pgfu2.sethiding(if show_gap2 then 0 else 1);
pgfd2.sethiding(if show_gap2 then 0 else 1);

# Plot the third gap
plot pgt3 = if gt3 == 0 then double.nan else gt3;
plot pgb3 = if gb3 == 0 then double.nan else gb3;
plot pgm3 = if gm3 == 0 then double.nan else gm3;
plot pghu3 = if ghu3 == 0 then double.nan else ghu3;
plot pghd3 = if ghd3 == 0 then double.nan else ghd3;
plot pgfu3 = if gfu3 == 0 then double.nan else gfu3;
plot pgfd3 = if gfd3 == 0 then double.nan else gfd3;

pgt3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgb3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgm3.SetPaintingStrategy(PaintingStrategy.DASHES);
pghu3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pghd3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
pgfu3.SetPaintingStrategy(PaintingStrategy.DASHES);
pgfd3.SetPaintingStrategy(PaintingStrategy.DASHES);

pgt3.SetLineWeight(3);
pgb3.SetLineWeight(3);
pghu3.SetLineWeight(3);
pghd3.SetLineWeight(3);

pgt3.AssignValueColor(GlobalColor("gap top" ));
pgb3.AssignValueColor(GlobalColor("gap bottom" ));
pgm3.AssignValueColor(GlobalColor("gap middle" ));
pghu3.AssignValueColor(GlobalColor("gap half up" ));
pghd3.AssignValueColor(GlobalColor("gap half down" ));
pgfu3.AssignValueColor(GlobalColor("gap full up" ));
pgfd3.AssignValueColor(GlobalColor("gap full down" ));

pgt3.sethiding(if show_gap3 then 0 else 1);
pgb3.sethiding(if show_gap3 then 0 else 1);
pgm3.sethiding(if show_gap3 then 0 else 1);
pghu3.sethiding(if show_gap3 then 0 else 1);
pghd3.sethiding(if show_gap3 then 0 else 1);
pgfu3.sethiding(if show_gap3 then 0 else 1);
pgfd3.sethiding(if show_gap3 then 0 else 1);