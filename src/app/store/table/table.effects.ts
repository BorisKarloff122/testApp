import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';
import { DataService } from '../../services/data.service';
import { getGridData, getGridDataError, getGridDataSuccess } from './table.actions';

@Injectable()

export class TableEffects {

  getGridData$ = createEffect(() => this.actions$.pipe(
      ofType(getGridData),
      switchMap((params) => this.dataService.getManagementInfo(params).pipe(
          map((res) => getGridDataSuccess({data: res})),
          catchError(() => of(getGridDataError()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService
  ) {
  }
}
