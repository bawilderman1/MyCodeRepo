declare lower;

plot Vol = Round((High - Low) / Close, 3) * 100;

plot Avg = Round(EhlersSuperSmootherFilter(Vol, 9), 1);
