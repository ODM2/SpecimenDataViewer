import {Component, OnInit, Inject} from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-summary-statistics',
  templateUrl: './summary-statistics.component.html',
  styleUrls: ['./summary-statistics.component.css']
})
export class SummaryStatisticsComponent implements OnInit {


  constructor(public dialogRef: MdDialogRef<SummaryStatisticsComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

}
