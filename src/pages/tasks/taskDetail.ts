import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'taskDetail.html'
})
export class TaskDetailPage {
  url: string;

  selectedTask: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("populating taskDetail page");
    this.selectedTask = navParams.get('task');
    
  }
}
