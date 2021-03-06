import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {IDescriptionsForm} from "../../models/DescriprionsForm";
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
import {TableState} from "../../store/table/table.reducers";
import {Store} from "@ngrx/store";
import {getGridData} from "../../store/table/table.actions";
import {tableDataSelector} from "../../store/table/table.selectors";
import {IGridData} from 'src/app/models/gridDataResults';
import {mapGridData} from 'src/app/shared/utils';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {
  public descriptionsForm: FormGroup = this.fb.group<IDescriptionsForm>({
    groupDescription: this.fb.control(''),
    measurementDescription: this.fb.control('')
  });
  public tableData$!: Observable<IGridData[]>;
  public runRequestSource = new BehaviorSubject<boolean>(true);
  public runRequest$: Observable<any> = this.runRequestSource.asObservable().pipe(distinctUntilChanged());
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
      map((gridData) => mapGridData(gridData)),
    )
  }

  public ngAfterViewInit(): void {
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

}
