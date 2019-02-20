import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'report.html'
})
export class ReportPage{
  report: any;
  constructor(public nav: NavController, public viewCtl: ViewController) {
    this.report = {
      reason: "",
      description: ""
    }
  }
 dismiss(){
   this.viewCtl.dismiss()
 }
 submitReport(){
   this.viewCtl.dismiss(this.report)
 }
}
