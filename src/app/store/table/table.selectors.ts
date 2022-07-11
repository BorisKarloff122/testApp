import {createFeatureSelector, createSelector} from '@ngrx/store';
import {TableState} from './table.reducers';

export const tableStateSelector = createFeatureSelector<TableState>('measurementInfo');

export const tableDataSelector = createSelector(tableStateSelector,
  (state) => state.rowsData,
);
