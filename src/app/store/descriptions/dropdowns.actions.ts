import { createAction, props } from "@ngrx/store";
import { dropdownActions } from "./dropdowns.actions.enum";

export const getMainDropdownData = createAction(dropdownActions.GET_MAIN_DROPDOWN_DATA);
export const getMainDropdownDataSuccess = createAction(dropdownActions.GET_MAIN_DROPDOWN_DATA_SUCCESS, props<{data: string[]}>())
export const getMainDropdownDataError = createAction(dropdownActions.GET_MAIN_DROPDOWN_DATA_ERROR)
export const getSecondaryDropdownData = createAction(dropdownActions.GET_SECONDARY_DROPDOWN_DATA, props<{selection: string}>());
export const getSecondaryDropdownDataSuccess = createAction(dropdownActions.GET_SECONDARY_DROPDOWN_DATA_SUCCESS, props<{data: string[]}>())
export const getSecondaryDropdownDataError = createAction(dropdownActions.GET_SECONDARY_DROPDOWN_DATA_ERROR)
