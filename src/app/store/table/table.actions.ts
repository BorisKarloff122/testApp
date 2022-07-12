import { createAction, props } from "@ngrx/store";
import { gridActions } from "./table.actions.enum";
import { IGridDataResults } from '../../models/gridDataResults';


export const getGridData = createAction(
  gridActions.GET_GRID_DATA,
  props<{ groupDescription: string, measurementDescription: string }>()
);
export const getGridDataSuccess = createAction(gridActions.GET_GRID_DATA_SUCCESS, props<{data: IGridDataResults[]}>())
export const getGridDataError = createAction(gridActions.GET_GRID_DATA_ERROR)
