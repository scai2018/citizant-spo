import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProjectsPage } from '../pages/projects/projects';
import { ProjectDetailPage } from '../pages/projects/projectDetail';
import { TasksPage } from '../pages/tasks/tasks';
import { TaskDetailPage } from '../pages/tasks/taskDetail';
import { MSAdal } from '@ionic-native/ms-adal';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProjectsPage,
    ProjectDetailPage,
    TasksPage,
    TaskDetailPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProjectsPage,
    ProjectDetailPage,
    TasksPage,
    TaskDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    MSAdal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
