import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Observable } from 'rxjs/Observable';
import { FeathersService } from '../../services/feathers.service';
import {Angular2Apollo} from 'angular2-apollo';
@Injectable()
export class ProfileService {

  constructor(private apollo: Angular2Apollo, private feathers: FeathersService) { }

  getProfile(userId): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query profile($userId: Int!) {
            userById(id: $userId) {
                  id
                  username
                  firstName
                  lastName
                  avatar_url
                  rank
                  post_count
                  follower_count
                  followers{
                    id
                  }
                  following_count
              }
        }
      `,
      variables: {
        userId
      },
      forceFetch: true
    })
  }


  getPosts(userId): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query profile($userId: Int!) {
            userById(id: $userId) {
                  posts{
                    id
                    createdAt
                    image_url
                  }
              }
        }
      `,
      variables: {
        userId: userId
      },
      forceFetch: true
    })
  }

  getCurrentUser() {
    return this.feathers.getUser();
  }

  updateRating(postId, rating): Observable<any> {
    return this.apollo.mutate({
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
    })
  }
  followUser(userId): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation follow($userId: Int!){
          followUser(userId: $userId){
            category
          }
        }
      `,
      variables: {
        userId
      }
    })
  }
  unFollowUser(userId) {
    return this.apollo.mutate({
      mutation: gql`
        mutation unfollow($userId: Int!){
          unFollowUser(userId: $userId){
            id
          }
        }
      `,
      variables: {
        userId
      }
    })
  }
  updateProfilePic(image) {
    return this.apollo.mutate({
      mutation: gql`
        mutation changePicture($image: String!){
          updateProfilePic(image: $image){
            id
            avatar_url
          }
        }
      `,
      variables: {
        image
      }
    })
  }
}
