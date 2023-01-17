declare upper;
input Length = 10;
input MinLength = 3;
Assert(MinLength between 3 and 24, "MinLength must be between 3 and 24");
Assert(Length between 3 and 24, "Length must be between 3 and 24");
Assert(Length >= MinLength, "Length must be greater than or equal to MinLength");

def _length;
def _hHhL = high > high[1] && low > low[1];
def _lLlH = low < low[1] && high < high[1];
def ssl3 = EhlersSuperSmootherFilter(low, 3);
def ssh3 = EhlersSuperSmootherFilter(high, 3);
def ssl4 = EhlersSuperSmootherFilter(low, 4);
def ssh4 = EhlersSuperSmootherFilter(high, 4);
def ssl5 = EhlersSuperSmootherFilter(low, 5);
def ssh5 = EhlersSuperSmootherFilter(high, 5);
def ssl6 = EhlersSuperSmootherFilter(low, 6);
def ssh6 = EhlersSuperSmootherFilter(high, 6);
def ssl7 = EhlersSuperSmootherFilter(low, 7);
def ssh7 = EhlersSuperSmootherFilter(high, 7);
def ssl8 = EhlersSuperSmootherFilter(low, 8);
def ssh8 = EhlersSuperSmootherFilter(high, 8);
def ssl9 = EhlersSuperSmootherFilter(low, 9);
def ssh9 = EhlersSuperSmootherFilter(high, 9);
def ssl10 = EhlersSuperSmootherFilter(low, 10);
def ssh10 = EhlersSuperSmootherFilter(high, 10);
def ssl11 = EhlersSuperSmootherFilter(low, 11);
def ssh11 = EhlersSuperSmootherFilter(high, 11);
def ssl12 = EhlersSuperSmootherFilter(low, 12);
def ssh12 = EhlersSuperSmootherFilter(high, 12);
def ssl13 = EhlersSuperSmootherFilter(low, 13);
def ssh13 = EhlersSuperSmootherFilter(high, 13);
def ssl14 = EhlersSuperSmootherFilter(low, 14);
def ssh14 = EhlersSuperSmootherFilter(high, 14);
def ssl15 = EhlersSuperSmootherFilter(low, 15);
def ssh15 = EhlersSuperSmootherFilter(high, 15);
def ssl16 = EhlersSuperSmootherFilter(low, 16);
def ssh16 = EhlersSuperSmootherFilter(high, 16);
def ssl17 = EhlersSuperSmootherFilter(low, 17);
def ssh17 = EhlersSuperSmootherFilter(high, 17);
def ssl18 = EhlersSuperSmootherFilter(low, 18);
def ssh18 = EhlersSuperSmootherFilter(high, 18);
def ssl19 = EhlersSuperSmootherFilter(low, 19);
def ssh19 = EhlersSuperSmootherFilter(high, 19);
def ssl20 = EhlersSuperSmootherFilter(low, 20);
def ssh20 = EhlersSuperSmootherFilter(high, 20);
def ssl21 = EhlersSuperSmootherFilter(low, 21);
def ssh21 = EhlersSuperSmootherFilter(high, 21);
def ssl22 = EhlersSuperSmootherFilter(low, 22);
def ssh22 = EhlersSuperSmootherFilter(high, 22);
def ssl23 = EhlersSuperSmootherFilter(low, 23);
def ssh23 = EhlersSuperSmootherFilter(high, 23);
def ssl24 = EhlersSuperSmootherFilter(low, 24);
def ssh24 = EhlersSuperSmootherFilter(high, 24);
def state = {default init, long, short};
def SAR;
switch (state[1]) {
case init:
    state = state.long;
    _length = Length;
case short:
    if (high > SAR[1])
    then {
        state = state.long;
        _length = Length;
    } else {
        state = state.short;
        if (_lLlH && _length[1] > MinLength) { _length = _length[1] - 1; } 
        else { _length = _length[1]; }
    }
case long:
    if (low < SAR[1]) {
        state = state.short;
        _length = Length;
    } else {
        state = state.long;
        if (_hHhL && _length[1] > MinLength) { _length = _length[1] - 1; }
        else { _length = _length[1]; }
    }
}
if (_length == 3) { SAR = if state == state.long then ssl3 else ssh3; }
else if (_length == 4) { SAR = if state == state.long then ssl4 else ssh4; }
else if (_length == 5) { SAR = if state == state.long then ssl5 else ssh5; }
else if (_length == 6) { SAR = if state == state.long then ssl6 else ssh6; }
else if (_length == 7) { SAR = if state == state.long then ssl7 else ssh7; }
else if (_length == 8) { SAR = if state == state.long then ssl8 else ssh8; }
else if (_length == 9) { SAR = if state == state.long then ssl9 else ssh9; }
else if (_length == 10) { SAR = if state == state.long then ssl10 else ssh10; }
else if (_length == 11) { SAR = if state == state.long then ssl11 else ssh11; }
else if (_length == 12) { SAR = if state == state.long then ssl12 else ssh12; }
else if (_length == 13) { SAR = if state == state.long then ssl13 else ssh13; }
else if (_length == 14) { SAR = if state == state.long then ssl14 else ssh14; }
else if (_length == 15) { SAR = if state == state.long then ssl15 else ssh15; }
else if (_length == 16) { SAR = if state == state.long then ssl16 else ssh16; }
else if (_length == 17) { SAR = if state == state.long then ssl17 else ssh17; }
else if (_length == 18) { SAR = if state == state.long then ssl18 else ssh18; }
else if (_length == 19) { SAR = if state == state.long then ssl9 else ssh19; }
else if (_length == 20) { SAR = if state == state.long then ssl20 else ssh20; }
else if (_length == 21) { SAR = if state == state.long then ssl21 else ssh21; }
else if (_length == 22) { SAR = if state == state.long then ssl22 else ssh22; }
else if (_length == 23) { SAR = if state == state.long then ssl23 else ssh23; }
else if (_length == 24) { SAR = if state == state.long then ssl24 else ssh24; }
else { SAR = HL2; }
plot SuperSmootherSAR = SAR;
SuperSmootherSAR.SetPaintingStrategy(PaintingStrategy.POINTS);
SuperSmootherSAR.AssignValueColor(if state == state.long then GetColor(6) else GetColor(5));
