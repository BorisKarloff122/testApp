import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, of, map, catchError } from "rxjs";
import {
  getMainDropdownData,
  getMainDropdownDataError,
  getMainDropdownDataSuccess,
  getSecondaryDropdownData,
  getSecondaryDropdownDataError,
  getSecondaryDropdownDataSuccess
} from "./dropdowns.actions";
import { DataService } from "../../services/data.service";

@Injectable()
export class DropdownsEffects {

  getMainDropdownData$ = createEffect(() => this.actions$.pipe(
      ofType(getMainDropdownData),
      switchMap(() =>
        this.dataService.getGroupDescriptions().pipe(
          map((res) => getMainDropdownDataSuccess({data: res})),
          catchError(() => of(getMainDropdownDataError()))
        )
      )
    )
  );


  getSecondaryDropdownData$ = createEffect(() => this.actions$.pipe(
      ofType(getSecondaryDropdownData),
      switchMap(({selection}) =>
        this.dataService.getMeasurementDescriptions(selection).pipe(
          map((res) => getSecondaryDropdownDataSuccess({data: res})),
          catchError(() => of(getSecondaryDropdownDataError()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}
}
