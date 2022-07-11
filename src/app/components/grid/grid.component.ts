import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  delay, distinct, distinctUntilChanged,
  filter,
  Observable,
  switchMap,
  tap
} from 'rxjs';
import {IGridDataResults} from '../../models/gridDataResults';
import {Store} from '@ngrx/store';
import {getGridData} from '../../store/table/table.actions';
import {TableState} from '../../store/table/table.reducers';
import {tableDataSelector} from '../../store/table/table.selectors';
import {IDescriptionsForm} from '../../models/DescriprionsForm';

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
  public tableData$!: Observable<IGridDataResults[]>;

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
  ) {}

  public ngOnInit(): void {
    this.tableData$ = combineLatest([
      this.groupDesc$,
      this.measurementDesc$,
      this.runRequest$
    ]).pipe(
      filter(([,, runRequest]) => runRequest),
      tap(([groupDescription, measurementDescription]) => {
        this.runRequestSource.next(false);
        this.store.dispatch(getGridData({groupDescription, measurementDescription}))
      }),
      switchMap(() => this.store.select(tableDataSelector))
    )
  }

  public ngAfterViewInit() {
    this.groupDescData$ = this.dataService.getGroupDescriptions().pipe(
      delay(0),
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
