import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {
  getMainDropdownData,
  getMainDropdownDataError,
  getMainDropdownDataSuccess
} from "../descriptions/dropdowns.actions";
import {catchError, map, of, switchMap} from "rxjs";
import {DataService} from "../../services/data.service";

@Injectable()

export class GridEffects{

  getGridData$ = createEffect(() => this.actions$.pipe(
      ofType(getMainDropdownData),
      switchMap(() =>
        this.dataService.getGroupDescriptions().pipe(
          map((res) => getMainDropdownDataSuccess({data: res})),
          catchError(() => of(getMainDropdownDataError()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {}
}
