import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'projectDetail.html'
})
export class ProjectDetailPage {
  projects: Object[];
  url: string;

  selectedProject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("populating projectDetail page");
    this.selectedProject = navParams.get('project');
  }
}
