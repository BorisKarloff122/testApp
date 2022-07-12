export interface IGridDataResults{
  externalMiId: number;
  kpiGroupType: string;
  kpiGroupDescription: string;
  kpiMeasurementDescription: string;
  kpiTeamName: string;
  kpiUserName: string;
  kpiPeriod: KpiPeriod;
  kpiAchievementPercent: number;
  kpiAchievementAmount: number;
  kpiRating: string;
  kpiColor: string;
}

export type KpiPeriod = 'Today' | 'MonthTD' | 'YearTD';

export interface IGridDataNumber{
  value: string;
  color: string;
}

export interface IGridData {
  kpiTeamName: string;
  todayAvg: IGridDataNumber;
  monthAvg: IGridDataNumber;
  yearAvg: IGridDataNumber;
}
