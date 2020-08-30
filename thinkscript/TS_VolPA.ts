declare once_per_bar;
declare on_volume;

DefineGlobalColor("aBlue", CreateColor(39,122,231)); #Alpha: 127
DefineGlobalColor("aOrange", CreateColor(248,207,137)); #Alpha: 219
DefineGlobalColor("aWhite", CreateColor(255,255,255)); #Alpha: 50 

input mdnLength = 15;
input numOfStdDev = 0.8;
input validationType = {default _StdDev, _Median};

#Volume
def _vol = volume;
def mdnVol = Median(_vol, mdnLength);
def volStdDev = StDev(data = _vol, length = mdnLength);
def volLowerBand = mdnVol - (numOfStdDev * volStdDev);
def volUpperBand = mdnVol + (numOfStdDev * volStdDev);

#True Range
def _tRng = TrueRange(high, close, low);
def mdnTR = Median(_tRng, mdnLength);
def trStdDev = StDev(data = _tRng, length = mdnLength);
def trLowerBand = mdnTR - (numOfStdDev * trStdDev);
def trUpperBand = mdnTR + (numOfStdDev * trStdDev);

#Plot Squeeze Indicator
def ZeroLine = 0;

#Determine if an Outlier based on Validation Type
def _outlier;
switch (validationType) {
case _StdDev:
    _outlier = (_tRng >= trUpperBand AND _vol <= volLowerBand)
                  OR (_tRng <= trLowerBand AND _vol >= volUpperBand);
case _Median:
    _outlier = (_tRng >= mdnTR AND _vol <= mdnVol)
                  OR (_tRng <= mdnTR AND _vol >= mdnVol);
}

plot _divergence = if (_outlier) then _vol else Double.NaN;
_divergence.setpaintingStrategy(paintingStrategy.SQUARED_HISTOGRAM);
_divergence.setdefaultColor(GlobalColor("aWhite"));
_divergence.SetLineWeight(2);