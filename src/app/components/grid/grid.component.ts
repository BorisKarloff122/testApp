import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { AbstractControl, FormBuilder } from "@angular/forms";
import { IDescriptionsForm } from "../../models/DescriprionsForm";
import {
  asyncScheduler,
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable, observeOn,
  switchMap,
  tap
} from "rxjs";
import { TableState } from "../../store/table/table.reducers";
import { Store } from "@ngrx/store";
import { getGridData } from "../../store/table/table.actions";
import { tableDataSelector } from "../../store/table/table.selectors";
import {IGridData, IGridDataNumber, IGridDataResults} from 'src/app/models/gridDataResults';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
  public descriptionsForm = this.fb.group<IDescriptionsForm>({
    groupDescription: this.fb.control(''),
    measurementDescription: this.fb.control('')
  });
  public tableData$!: Observable<IGridData[]>;

  public runRequestSource = new BehaviorSubject<boolean>(true);
  public runRequest$ = this.runRequestSource.asObservable().pipe(distinctUntilChanged());

  public groupDescData$!: Observable<string[]>;
  public measurementDescData$: Observable<string[]> = this.groupDesc$.pipe(
    filter(Boolean),
    switchMap((option) => this.dataService.getMeasurementDescriptions(option as string)),
    tap((payload) => this.measurementDescControl?.setValue(payload[0]))
  );

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private store: Store<TableState>
  ) {
  }

  public ngOnInit(): void {
    this.tableData$ = combineLatest([
      this.groupDesc$,
      this.measurementDesc$,
      this.runRequest$
    ]).pipe(
      filter(([, , runRequest]) => runRequest),
      tap(([groupDescription, measurementDescription]) => {
        this.runRequestSource.next(false);
        this.store.dispatch(getGridData({groupDescription, measurementDescription}))
      }),
      switchMap(() => this.store.select(tableDataSelector)),
      map((gridData) => {
        console.log(this.mapGridData(gridData));
        return this.mapGridData(gridData);
      }),
    )
  }

  public ngAfterViewInit() {
    this.groupDescData$ = this.dataService.getGroupDescriptions().pipe(
      observeOn(asyncScheduler),
      tap((payload) => this.groupDescControl?.setValue(payload[0], {emitEvent: true}))
    );
  }

  public onRun(): void {
    this.runRequestSource.next(true);
  }

  private get groupDescControl(): AbstractControl<string> {
    return this.descriptionsForm.get('groupDescription') as AbstractControl;
  }

  private get measurementDescControl(): AbstractControl<string> {
    return this.descriptionsForm.get('measurementDescription') as AbstractControl;
  }

  private get groupDesc$(): Observable<string> {
    return this.groupDescControl?.valueChanges;
  }

  private get measurementDesc$(): Observable<string> {
    return this.measurementDescControl?.valueChanges;
  }


  private mapGridData(data: IGridDataResults[]): IGridData[] {
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

    function getAvg(arr: number[]): IGridDataNumber {
      const value = +(arr.reduce((curr, el) => (curr + el), 0) / arr.length).toFixed(2);
      return {
        value: parseFloat(value * 100 + '').toFixed(2) + '%',
        color: getPercentColor(value)
      }
    }

    function getPercentColor(percent: number): string {
      if (percent >= 0.8) return 'green'
      else if (percent < 0.8 && percent > 0.6) return 'yellow'
      else return 'red'
    }
  }
}
