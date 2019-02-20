import {NavController, NavParams} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfilePage} from '../profile/profile';
import {Angular2Apollo} from 'angular2-apollo';
import {Observable} from 'rxjs/Observable';
import gql from 'graphql-tag';
/*
  Generated class for the FollowingListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'following-list.html',
})
export class FollowingListPage implements OnInit, OnDestroy {
  public userId;
  public following;
  public subscription;
  constructor(public nav: NavController,
    public apollo: Angular2Apollo,
    public params: NavParams) {
    this.userId = params.get('userId');
  }

  ngOnInit() {
    this.subscription = this.getFollowing().subscribe({
      next: ({data}) => {
        this.following = data.userById.following;
      }
    });
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  getFollowing(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query following($userId: Int!) {
            userById(id: $userId) {
                  id
                  following{
                    id
                    firstName
                    lastName
                    username
                    avatar_url
                  }
             }
          }
      `,
      variables: {
        userId: this.userId
      },
      forceFetch: true
    })
  }
  goToProfile(userId) {
    this.nav.push(ProfilePage, { userId: userId });
  }
  refresh(refresher) {
    this.subscription.refetch();
    setTimeout(() => refresher.complete(), 500);
  }
}
