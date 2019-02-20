import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyPalate } from './app.component';
import { AlertPage } from '../pages/alert/alert';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { FollowerListPage } from '../pages/follower-list/follower-list';
import { FollowingListPage } from '../pages/following-list/following-list';
import { LoginPage } from '../pages/login/login';
import { PostPage } from '../pages/post/post';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { ProfilePage } from '../pages/profile/profile';
import { ReportPage } from '../pages/report/report';
import { SavedDishesPage } from '../pages/saved-dishes/saved-dishes';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { CommentComponent } from '../components/comment.component';
import { OptionsPopover } from '../components/options.component';
import { PostInfoComponent } from '../components/post-info.component';
import { PostComponent } from '../components/post.component';
import { StarRatingComponent } from '../components/star-rating.component';
import { FeathersService } from '../services/feathers.service';
import { AlertFormatPipe } from '../pipes/alert-format.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { Angular2Apollo, ApolloModule } from 'angular2-apollo';
import {EnvironmentService} from '../services/environment.service';
import { ProfileService } from '../pages/profile/profile.service';
import { PostDetailService } from '../pages/post-detail/post-detail.service';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

let {HOST, GRAPHQL_ENDPOINT} = EnvironmentService.getEnv();

const networkInterface = createNetworkInterface( HOST + GRAPHQL_ENDPOINT);

networkInterface.use([{
  applyMiddleware(req: any, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    req.options.headers.authorization = localStorage.getItem('feathers-jwt') || null;
    req.options.headers.registration = localStorage.getItem('registration') || null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface,
});


export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    MyPalate,
    AlertPage,
    DashboardPage,
    FollowerListPage,
    FollowingListPage,
    LoginPage,
    PostPage,
    PostDetailPage,
    ProfilePage,
    ReportPage,
    SavedDishesPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    CommentComponent,
    OptionsPopover,
    PostInfoComponent,
    PostComponent,
    StarRatingComponent,
    AlertFormatPipe,
    DateFormatPipe
  ],
  imports: [
    IonicModule.forRoot(MyPalate),
    ApolloModule.withClient(provideClient)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyPalate,
    AlertPage,
    DashboardPage,
    FollowerListPage,
    FollowingListPage,
    LoginPage,
    PostPage,
    PostDetailPage,
    ProfilePage,
    ReportPage,
    SavedDishesPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    CommentComponent,
    OptionsPopover,
    PostInfoComponent,
    PostComponent,
    StarRatingComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PostDetailService, ProfileService, FeathersService, Angular2Apollo]
})
export class AppModule { }
