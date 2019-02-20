import {NavController} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {StarRatingComponent} from '../../components/star-rating.component';
import {PostInfoComponent} from '../../components/post-info.component';
import {PostComponent} from '../../components/post.component';
import {PostDetailPage} from '../post-detail/post-detail';
import {ProfilePage} from '../profile/profile';
import {LoginPage} from '../login/login';
import {DateFormatPipe} from '../../pipes/date-format.pipe';
import {Angular2Apollo} from 'angular2-apollo';
import {FeathersService} from '../../services/feathers.service';
import gql from 'graphql-tag';
@Component({
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit, OnDestroy {
  posts: any[] = [];
  postsSubscription: any;
  firstPostSubscription: any;
  loaded: any = false;
  constructor(public nav: NavController, public apollo: Angular2Apollo, public feathers: FeathersService) {
  }
  ngOnInit() {
    this.firstPostSubscription = this.getFirstPost().subscribe({
      next: ({data, errors}) => {
        if(data){
          this.loaded = true;
        }
        if (data && data.posts && data.posts[0]) {
          this.posts = [data.posts[0]];
        }
        if (errors) {
          this.nav.push(LoginPage);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.postsSubscription = this.getPosts();

    this.postsSubscription.subscribe({
      next: ({data, errors}) => {
        if (data) {
          this.posts = data.posts
        }
        if (errors) {
          this.nav.push(LoginPage);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
  ngOnDestroy() {
    // this.postsSubscription.unsubscribe();
    // this.firstPostSubscription.unsubscribe();
  }
  getPosts(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
                query dashboard {
                      posts {
                        id
                        title
                        user {
                          id
                          username
                          firstName
                          lastName
                          avatar_url
                        }
                        createdAt
                        image_url
                        rating
                        user_rating
                        description
                        comment_count
                      }
                    }
            `,
      forceFetch: true
    })
  }
  getFirstPost(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
                query dashboard {
                      posts(limit: 1) {
                        id
                        title
                        user {
                          id
                          username
                          firstName
                          lastName
                          avatar_url
                        }
                        createdAt
                        image_url
                        rating
                        user_rating
                        description
                        comment_count
                      }
                    }
            `,
      forceFetch: true
    })
  }

  refresh(refresher) {
    this.postsSubscription.refetch();
    setTimeout(() => refresher.complete(), 500);
  }
  deletePost(post) {
    this.apollo.mutate({
      mutation: gql`
                mutation deletePost($postId: Int!){
                    deletePost(postId: $postId){
                        id
                    }
                }
            `,
      variables: {
        postId: post.id
      }
    }).subscribe(({data}) => {
      if (data) {
        this.posts = this.posts.filter(p => p.id !== post.id)
        this.postsSubscription.refetch();
      }
    }, (errors) => {
      console.log(errors);
    })
  }
  viewDetails(post) {
    this.nav.push(PostDetailPage, { postId: post.id });
  }

  goToProfile(userId) {
    this.nav.push(ProfilePage, { userId: userId });
  }
  updateRating({postId, rating}) {

    this.apollo.mutate({
      mutation: gql`
          mutation rate($postId: Int!, $rating: Int!){
                        ratePost(postId: $postId, rating: $rating){
                        id
                        user_rating
                        }
                  }`,
      variables: {
        postId,
        rating
      }
    }).subscribe((response: any) => {
      if (response.data) {
        let newRating = response.data.ratePost.user_rating;
        this.posts.forEach((post) => {
          if (post.id == postId) {
            post.user_rating = newRating;
          }
        })
      }

    }, (errors) => {
      console.log('got some GraphQL execution errors', errors);
    });
  }
}
