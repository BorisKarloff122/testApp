import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  public descriptionsForm = new FormGroup({

  })

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {

  }



}
