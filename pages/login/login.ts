import {NavController, ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {TabsPage} from '../tabs/tabs'
import {SignupPage} from '../signup/signup';
import {FeathersService} from '../../services/feathers.service';
/*
  Generated class for the AccountPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'login.html',
})
export class LoginPage {
  public credentials: any = {
    email: "",
    password: ""
  }
  constructor(public nav: NavController, public feathers: FeathersService, public toastCtrl: ToastController) {
    this.nav = nav;
  }

  logIn() {
    this.feathers.login(this.credentials).then((result) => {
      location.reload();
      this.nav.setRoot(TabsPage);
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: "You might be using the wrong email or password!",
        duration: 5000
      });
      toast.present();
      console.error(err);
    });
  }
  loginWithFacebook() {
    this.feathers.loginWithFacebook().then((result) => {
      location.reload();
      this.nav.setRoot(TabsPage);
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: "There was an error logging you in! Have you created an account?",
        duration: 5000
      });
      toast.present();
      console.error(err);
    })
  }

  goToSignupPage() {
    this.nav.push(SignupPage);
  }
}

