import {NavController} from 'ionic-angular';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Angular2Apollo} from 'angular2-apollo';
import {AlertFormatPipe} from '../../pipes/alert-format.pipe';
import {PostDetailPage} from '../post-detail/post-detail';
import {LoginPage} from '../login/login';
import {ProfilePage} from '../profile/profile';
import {Observable} from 'rxjs/Observable'
import gql from 'graphql-tag';
@Component({
    templateUrl: 'alert.html'
})
export class AlertPage implements OnInit, OnDestroy {
    public alerts = [];
    subscription: any;
    constructor(public apollo: Angular2Apollo, public nav: NavController) {
    }

    ngOnInit() {
        this.subscription = this.getAlerts().subscribe({
            next: ({data}) => {
                if (data) {
                    this.alerts = data.alerts;
                }
            }
        })
    }
    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }
    getAlerts(): Observable<any> {
        return this.apollo.watchQuery({
            query: gql`
                    query alert {
                        alerts {
                            category
                            from {
                                id
                                username
                                firstName
                                lastName
                                avatar_url
                            }
                            content {
                            __typename
                            ... on Post{
                                id
                            }
                            ... on User {
                                id
                            }
                            }
                        }
                    }
                `,
            forceFetch: true
        })
    }

    goToContent(alert) {
        if (alert.content.__typename === "User") {
            this.nav.push(ProfilePage, { userId: alert.content.id });
        } else {
            this.nav.push(PostDetailPage, { postId: alert.content.id });
        }
    }

    refresh(refresher) {
        this.subscription.refetch();
        setTimeout(() => refresher.complete(), 500);
    }


}
