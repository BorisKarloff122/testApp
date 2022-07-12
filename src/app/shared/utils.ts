import {IGridData, IGridDataNumber, IGridDataResults} from "../models/gridDataResults";

const getPercentColor = (percent: number): string => {
  if (percent >= 0.8) return 'green'
  else if (percent < 0.8 && percent > 0.6) return 'yellow'
  else return 'red'
}


const getAvg = (arr: number[]): IGridDataNumber => {
  const value = +(arr.reduce((curr, el) => (curr + el), 0) / arr.length).toFixed(2);
  return {
    value: parseFloat(value * 100 + '').toFixed(2) + '%',
    color: getPercentColor(value)
  }
}


export const mapGridData = (data: IGridDataResults[]): IGridData[] => {
  return Array.from(new Set(data.map(item => item.kpiTeamName).filter(name => !!name)))
    .map(name => {
      const selectedData = data.filter(item => item.kpiTeamName === name);
      return {
        kpiTeamName: name,
        todayAvg: getAvg(selectedData.filter(el => el.kpiPeriod === 'Today').map(el => el.kpiAchievementPercent)),
        monthAvg: getAvg(selectedData.filter(el => el.kpiPeriod === 'MonthTD').map(el => el.kpiAchievementPercent)),
        yearAvg: getAvg(selectedData.filter(el => el.kpiPeriod === 'YearTD').map(el => el.kpiAchievementPercent))
      };
    });
}
