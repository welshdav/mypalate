import {NavController} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Angular2Apollo} from 'angular2-apollo';
import {Observable} from 'rxjs/Observable';
import gql from 'graphql-tag';
/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit {
  settings: any = {};
  newPassword = "";
  newUsername = "";
  subscription: any;
  constructor(public nav: NavController, public apollo: Angular2Apollo) { }
  ngOnInit() {
    this.subscription = this.getSettings().subscribe({
      next: ({data}) => {
        this.settings = data.currentUser.settings;
      }
    })
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  getSettings(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
          query userSettings {
            currentUser {
              id
              settings {
                commentNotifications,
                followerNotifications,
                ratingNotifications
              }
            }
          }
      `
    });
  }
  updateSettings(settings) {
    return this.apollo.mutate({
      mutation: gql`
          mutation changeNotifications($commentNotifications: Boolean,
                                       $ratingNotifications: Boolean, 
                                       $followerNotifications: Boolean){
                                    
            updateSettings(commentNotifications: $commentNotifications, 
                           ratingNotifications: $ratingNotifications,
                           followerNotifications: $followerNotifications){
                             id
                             settings {
                               commentNotifications,
                               followerNotifications,
                               ratingNotifications
                             }
                           }
          }
      `,
      variables: {
        commentNotifications: settings.commentNotifications,
        ratingNotifications: settings.ratingNotifications,
        followerNotifications: settings.followerNotifications
      }
    }).subscribe(({data}) => {
    }, (errors) => {
      console.log(errors);
    })
  }
  changePassword() {
    this.apollo.mutate({
      mutation: gql`
          mutation changePassword($newPassword: String!){
            changePassword(newPassword: $newPassword){
              id
            }
          }
      `,
      variables: {
        newPassword: this.newPassword
      }
    }).subscribe(({data}) => {
      this.newPassword = "";
    }, (errors) => {
      console.log(errors);
    })
    
  }
  changeUsername() {
    this.apollo.mutate({
      mutation: gql`
          mutation changeUsername($newUsername: String!){
            changeUsername(newUsername: $newUsername){
              id
            }
          }
      `,
      variables: {
        newUsername: this.newUsername
      }
    }).subscribe(({data}) => {
      this.newUsername = "";
    }, (errors) => {
      console.log(errors);
    })
  }
  toggleComments() {
    this.updateSettings({
      commentNotifications: !this.settings.commentNotifications,
      ratingNotifications: this.settings.ratingNotifications,
      followerNotifications: this.settings.followerNotifications
    });
    this.subscription.refetch()
  }
  toggleRatings() {
    this.updateSettings({
      commentNotifications: this.settings.commentNotifications,
      ratingNotifications: !this.settings.ratingNotifications,
      followerNotifications: this.settings.followerNotifications
    });
    this.subscription.refetch()
  }
  toggleFollowers() {
    this.updateSettings({
      commentNotifications: this.settings.commentNotifications,
      ratingNotifications: this.settings.ratingNotifications,
      followerNotifications: !this.settings.followerNotifications
    });
    this.subscription.refetch()
  }
}
