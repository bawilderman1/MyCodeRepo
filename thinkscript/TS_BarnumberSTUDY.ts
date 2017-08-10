declare upper;
plot Bar_number = barnumber();
Bar_Number.setPaintingStrategy(paintingStrategy.VALUES_BELOW);

#plot Bar_number = barnumber();
#Bar_Number.setPaintingStrategy(paintingStrategy.VALUES_BELOW);

#plot Get_StartYear = if getyear() <> getyear()[1] then barnumber() else double.nan;
#Get_StartYear.setPaintingStrategy(paintingStrategy.VALUES_BELOW);
#plot Get_StYrClose = if getyear() <> getyear()[1] then close else double.nan;
#Get_StYrClose.setPaintingStrategy(paintingStrategy.VALUES_BELOW);
#plot Get_Current = if isnan(close[-1]) then barnumber() else double.NaN;
#Get_Current.setPaintingStrategy(paintingStrategy.VALUES_BELOW);
#plot Get_First = if barnumber() == 2 then close else double.NaN;
#Get_First.setPaintingStrategy(paintingStrategy.VALUES_BELOW);