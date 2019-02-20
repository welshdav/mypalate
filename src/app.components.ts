import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar, Push } from 'ionic-native';
import { FeathersService } from '../services/feathers.service';

import {SettingsPage} from '../pages/settings/settings';
import {SavedDishesPage} from '../pages/saved-dishes/saved-dishes';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyPalate {
  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public menu: MenuController,
              private feathers: FeathersService) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: TabsPage },
      { title: 'Saved Dishes', component: SavedDishesPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Login', component: LoginPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      let push = Push.init({
        android: {
          senderID: "267247394402"
        },
        ios: {
          alert: "true",
          badge: true,
          sound: "false"
        },
        windows: {}
      });
      push.on('registration', (data) => {
        window.localStorage.setItem("registration", data.registrationId.toString());
      });
      push.on('notification', (data) => {
      });
      push.on('error', (e) => {
        console.log(e.message);
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut() {
    this.feathers.logOut();
    this.nav.push(LoginPage);
    this.menu.close();
  }

}
