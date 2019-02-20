import {ActionSheetController, NavController, NavParams, Platform} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Camera, ImagePicker} from 'ionic-native';
import {PostDetailPage} from '../post-detail/post-detail';
import {PostInfoComponent} from '../../components/post-info.component';
import {PostComponent} from '../../components/post.component';
import {LoginPage} from '../login/login';
import {FollowerListPage} from '../follower-list/follower-list';
import {FollowingListPage} from '../following-list/following-list';
import {ProfileService} from './profile.service';

import {DateFormatPipe} from '../../pipes/date-format.pipe';

@Component({
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit, OnDestroy {
  public profile: any = {};
  public profileId: any;
  public currentUserId: any;
  public profileSubscription: any;
  public postSubscription: any;
  constructor(public platform: Platform,
    public nav: NavController,
    public params: NavParams,
    public profileService: ProfileService,
    public actionSheetCtrl: ActionSheetController) {
    this.profileId = params.get('userId');
    this.currentUserId = Number(this.profileService.getCurrentUser());
    this.profileId = params.get('userId') || this.currentUserId;
  }

  ngOnInit() {
    this.profileSubscription = this.getProfile()
    this.profileSubscription.subscribe({
      next: ({data}) => {
        this.profile = data.userById;
      }
    });
    this.postSubscription = this.getPosts()
    this.postSubscription.subscribe({
      next: ({data}) => {
        console.log("Posts,", data.userById.posts);
        this.profile.posts = data.userById.posts;
      }
    })
  }

  ngOnDestroy() {
    // this.profileSubscription.unsubscribe();
    // this.postSubscription.unsubscribe();
  }

  getProfile(): Observable<any> {
    return this.profileService.getProfile(this.profileId || this.currentUserId);
  }

  getPosts(): Observable<any> {
    return this.profileService.getPosts(this.profileId || this.currentUserId);
  }


  get canFollow() {
    if (!this.profile) return false;
    if (!this.currentUserId) return false;
    if (!this.profile.followers) return false;
    let followerIds = this.profile.followers.map(follower => follower.id);
    if (this.profileId == this.currentUserId) return false;
    if (followerIds.indexOf(this.currentUserId) > -1) return false;
    return true;
  }

  get isFollowing() {
    if (!this.profile) return false;
    if (!this.currentUserId) return false;
    if (!this.profile.followers) return false;
    let followerIds = this.profile.followers.map(follower => follower.id);
    if (this.profileId == this.currentUserId) return false;
    if (followerIds.indexOf(this.currentUserId) > -1) return true;
    return false;
  }

  get isUser() {
    return !this.canFollow && !this.isFollowing;
  }

  viewDetails(post) {
    this.nav.push(PostDetailPage, { postId: post.id });
  }

  refresh(refresher) {
    this.profileSubscription.refetch();
    this.postSubscription.refetch();
    setTimeout(() => refresher.complete(), 500);
  }

  editProfilePic() {
    if (!this.isUser) return;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit your Profile Picture',
      buttons: [
        {
          text: 'Choose from Gallery',
          icon: !this.platform.is('ios') ? 'photos' : null,
          handler: () => {
            this.getImage(false).then((image) => {
              this.profile.avatar_url = image
            }
            );
          }
        },
        {
          text: 'Take New Picture',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.getImage(true).then((image) => {
              this.profile.avatar_url = image
            }
            );
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => { }
        }
      ]
    });

    actionSheet.present();
  }
  getImage(camera) {
    let options = {
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true,
      destinationType: 0,
      sourceType: camera ? 1 : 0
    };
    return Camera.getPicture(options).then((ImageData) => {
      let base64Image = "data:image/jpeg;base64," + ImageData;
      let image = base64Image;
      return this.profileService.updateProfilePic(image).subscribe((response: any) => {
        if (response.data) {
          return response.data.updateProfilePic.avatar_url
        }
      })
    });
  }
  updateRating({postId, rating}) {
    this.profileService.updateRating(postId, rating).subscribe((response: any) => {
      if (response.data) {
        let newRating = response.data.ratePost.user_rating;
        this.profile.posts.forEach((post) => {
          if (post.id == postId) {
            post.user_rating = newRating;
          }
        })
      }
    })
  }

  followUser(userId) {
    this.profileService.followUser(userId).subscribe(({ data }) => {
      if (data) {
        this.profileSubscription.refetch();
      }
    })
  }

  unFollowUser(userId) {
    this.profileService.unFollowUser(userId).subscribe(({data}) => {
      if (data) {
        this.profileSubscription.refetch();
      }
    })
  }

  viewFollowers(userId) {
    this.nav.push(FollowerListPage, { userId });
  }

  viewFollowing(userId) {
    this.nav.push(FollowingListPage, { userId });
  }
}
