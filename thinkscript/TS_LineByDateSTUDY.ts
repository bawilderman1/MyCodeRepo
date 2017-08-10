#hint: <b>Plot a line on a date</b>\nPlots a horizontal line on a specified date. 

#hint Date: Set the date you want see.<b>\n(Enter in YYYYMMDD)</b>
#hint show_line: Show a horizontal line at this price<b>(Default is Yes)</b>

#wizard input: Date
#wizard text: Inputs: Date:
#wizard input: show_line
#wizard text: show_line:

declare hide_on_intraday;

input Date = 20140721;
input price = CLOSE;
input show_line = Yes;

def timeTest = getYyyyMmDd() == date;
def data = if timetest then price  else double.nan;

plot Line = if show_line then highestall(data) else double.nan;
line.assignValueColor((if price == close then color.cyan else if price == open then color.pink else if price == low then color.yellow else if price == high then color.green else color.red));

def monthday = if timetest then getdayOfMonth(date) else double.nan;
def month = if timetest then getmonth() else double.nan;

#AddChartBubble(timetest, price, concat(concat(concat("Date: ",Concat(month, "/")), monthday),  concat((if price == close then "   Close: $" else if price == open then "   Open: $" else if price == low then "   Low: $" else if price == high then "  High: $" else "   Value:  "), price)),  (if price == close then color.cyan else if price == open then color.pink else if price == low then color.yellow else if price == high then color.green else color.red), yes);
