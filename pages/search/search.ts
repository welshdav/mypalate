import {NavController} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfilePage} from '../profile/profile';
import {PostDetailPage} from '../post-detail/post-detail';
import {Angular2Apollo} from 'angular2-apollo';
import {Observable} from 'rxjs/Observable';
import gql from 'graphql-tag';
@Component({
    templateUrl: 'search.html',
})
export class SearchPage implements OnInit, OnDestroy {
    public searchQuery;
    public userResults: any[] = [];
    public postResults: any[] = [];
    public users: any[] = [];
    public posts: any[] = [];
    public subscription: any;
    constructor(public apollo: Angular2Apollo, public nav: NavController) {
        this.searchQuery = '';
        this.userResults = [];
        this.postResults = []
    }

    ngOnInit() {
        this.subscription = this.searchUsers();
        this.subscription.subscribe({
            next: ({data}) => {
                console.log(data);
                this.users = data.users;
                this.posts = data.posts;
            }
        });
    }
    ngOnDestroy() {
        // this.subscription.unsubscribe()
    }
    searchUsers(): Observable<any> {
        return this.apollo.watchQuery({
            query: gql`
                query search{
                    users{
                        avatar_url
                        firstName
                        lastName
                        id
                        username
                    }
                    posts{
                        id
                        image_url
                        title
                    }
                }
            `
        });
    }
    initializeResults() {
        this.userResults = [];
        this.postResults = [];
    }

    getResults(searchbar) {
        // Reset items back to all of the items
        this.initializeResults();

        // set q to the value of the searchbar
        let q = searchbar.target.value;
        

        // if the value is an empty string don't filter the items
        if (q && q.trim() == '') {
            this.userResults = [];
            this.postResults = [];
            return;
        }

        this.userResults = this.users.filter((u) => {
            u.fullName = u.firstName + " " + u.lastName;
            console.log(u.username);
            if (u.fullName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                console.log("here");
                return true;
            }
            else if (u.username!=null && u.username.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
        this.postResults = this.posts.filter((p) => {
            if (p.title.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true
            }
            return false
        })
    }

    goToProfile(userId) {
        this.nav.push(ProfilePage, { userId: userId });
    }
    goToPost(postId) {
        this.nav.push(PostDetailPage, { postId: postId });
    }
}
