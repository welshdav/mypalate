import {NavController, NavParams} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfilePage} from '../profile/profile';
import {PostInfoComponent} from '../../components/post-info.component';
import {StarRatingComponent} from '../../components/star-rating.component';
import {CommentComponent} from '../../components/comment.component';
import {DateFormatPipe} from '../../pipes/date-format.pipe';
import {PostDetailService} from './post-detail.service';
import {Angular2Apollo} from 'angular2-apollo';
import gql from 'graphql-tag';
@Component({
  templateUrl: 'post-detail.html'
})
export class PostDetailPage implements OnInit, OnDestroy {
  public post: any = {};
  public alert: any = {};
  public comment = "";
  public postId: Number;
  public subscription;
  constructor(public nav: NavController,
    public params: NavParams,
    public apollo: Angular2Apollo,
    public postDetailService: PostDetailService) {
    this.postId = params.get('postId');
  }
  ngOnInit() {
    this.subscription = this.postDetailService.getPostDetails(this.postId);
    this.subscription.subscribe({
      next: ({data}) => {
        this.post = data.post;
      },
      error: error => console.error(error)
    })
  }
  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }
  refresh(refresher) {
    this.subscription.refetch();
    setTimeout(() => refresher.complete(), 500);
  }
  deletePost(post){
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
            if (data){
              this.subscription.refetch();
            }
        }, (errors) => {
          console.log(errors);
        });
        this.nav.pop();
  }
  deleteComment(comment){
    this.postDetailService.deleteComment(comment).subscribe(({data}) => {
      if (data) {
        this.post.comments = this.post.comments.filter(c => c.id !== comment.id);
        this.subscription.refetch();
      }
    });
  }
  goToProfile(userId) {
    this.nav.push(ProfilePage, { userId: userId });
  }
  createComment() {
    if (!this.comment.trim()) return;
    this.postDetailService.createComment(this.post.id, this.comment).subscribe(({data}) => {
      if (data) {
        this.post.comments.push(data.createComment);
        this.post.comment_count += 1;
      }
    });
    this.comment = "";
  }
  updateRating(rating) {
    this.postDetailService.updateRating(this.post.id, rating).subscribe(({data}) => {
      if (data) {
        this.post.user_rating = data.ratePost.user_rating;
      }
    });
  }
}
