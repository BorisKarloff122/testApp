import {createAction, props} from "@ngrx/store";
import {gridActions} from "./table.actions.enum";
import {IApiResponse} from "../../models/gridData";

export const getGridData = createAction(gridActions.GET_GRID_DATA);
export const getGridDataSuccess = createAction(gridActions.GET_GRID_DATA_SUCCESS, props<{data: IApiResponse}>())
export const getGridDataError = createAction(gridActions.GET_GRID_DATA_ERROR)
