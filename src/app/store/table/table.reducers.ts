import {IGridDataResults} from '../../models/gridDataResults';
import {createReducer, on} from '@ngrx/store';
import {getGridDataError, getGridDataSuccess} from './table.actions';

export interface TableState {
  rowsData: IGridDataResults[],
  hasValue: boolean
}

const initialState: TableState = {
  rowsData: [],
  hasValue: false
}

export const tableReducer = createReducer(
  initialState,
  on(getGridDataSuccess, (state, action) => ({...state, rowsData: action.data, hasValue: true})),
  on(getGridDataError, (state, action) => ({...state, rowsData: [], hasValue: false}))
)
