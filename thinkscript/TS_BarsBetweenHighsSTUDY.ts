#hint: <b>Bar Count Between Highs</b>\n Counts the number of bars between each high in the specified length, default 20.

#hint Length: Length used in looking for new Highs. <b>(Default is 20)</b>
#hint gap_length: If there is a large gap between new highs, this gap_length is used to find the previous highest high and it subtracts the current high bar number from the previous high barnumber. <b>\n(Default is 200)</b>

#wizard input: length
#wizard text: length:
#wizard input: gap_length
#wizard text: gap_length:
#wizard input: Show_bar_number
#wizard text: Show_Bar_number:


def barnumber = barnumber();
input length = 20;
input gap_length = 200;
input show_Bar_number = NO;

def numberold1 = if highest(high, length)[1] then barnumber else double.nan;

def signal = if highest(high, length) > highest(high, length)[1] then barnumber() else 0;

def signal1 = if signal > 0 then (signal - highest(signal, length)[1]) else 0;

plot signal2 = if signal1 > 0 and signal1 != barnumber() then signal1 else if signal1 == barnumber() then (signal1 - highest(signal[1], gap_length)) else double.nan;

signal2.SetPaintingStrategy(PaintingStrategy.VALUES_ABOVE);

plot Bar_number = if show_Bar_number == yes then barnumber() else double.nan;
Bar_Number.setPaintingStrategy(paintingStrategy.VALUES_BELOW);
