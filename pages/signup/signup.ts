import {NavController} from 'ionic-angular';
import {Component} from '@angular/core'
import {TabsPage} from '../tabs/tabs';
import {LoginPage} from '../login/login';
import {FeathersService} from '../../services/feathers.service';

@Component({
  templateUrl: 'signup.html',
})
export class SignupPage {
  public credentials = {};
  constructor(public nav: NavController, public feathers: FeathersService) {
    this.nav = nav;
  }
  goToTabsPage() {
    this.nav.push(TabsPage);
  }
  signUp() {
    this.feathers.signUp(this.credentials).then(() => this.nav.push(LoginPage));
  }
  signUpWithFacebook() {
    this.feathers.signUpWithFacebook().then(() => this.nav.push(LoginPage));
  }
}
