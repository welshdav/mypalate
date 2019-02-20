import { Injectable } from '@angular/core';
import {Angular2Apollo} from 'angular2-apollo';
import {Observable} from 'rxjs/Observable';
import gql from 'graphql-tag';

@Injectable()
export class PostDetailService {

    constructor(public apollo: Angular2Apollo) { }

    getPostDetails(postId): Observable<any> {
        return this.apollo.watchQuery({
            query: gql`
                query postDetail($postId: Int!){
                    post(id: $postId){
                      id
                      title
                      description
                      recipe
                      image_url
                      createdAt
                      comment_count
                      rating
                      user_rating
                      user{
                        id
                        username
                        firstName
                        lastName
                        avatar_url
                      }
                      comments{
                        id
                        content
                        createdAt
                        from{
                          id
                          username
                          avatar_url
                        }
                      }
                    }
                  }
            `,
            variables: {
                postId
            },
            forceFetch: true
        })
    }

    createComment(postId, content): Observable<any> {
        return this.apollo.mutate({
            mutation: gql`mutation comment($postId: Int!, $content: String!){
                            createComment(postId: $postId, content: $content){
                                id
                                post{
                                    id
                                }
                                content
                                createdAt
                                from{
                                    id
                                    username
                                    firstName
                                    lastName
                                    avatar_url
                                }
                            }
                      }`,
            variables: {
                postId,
                content
            }
        })
    }
    deleteComment(comment): Observable<any>{
        return this.apollo.mutate({
            mutation: gql`
                mutation deleteComment($commentId: Int!){
                    deleteComment(commentId: $commentId){
                        id
                    }
                }
            `,
            variables: {
                commentId: comment.id
            }
        })
    }

    updateRating(postId, rating): Observable<any> {
        return this.apollo.mutate({
            mutation: gql`mutation rate($postId: Int!, $rating: Int!){
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

}
