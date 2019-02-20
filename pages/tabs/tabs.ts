import {Component} from '@angular/core'
import {DashboardPage} from '../dashboard/dashboard';
import {ProfilePage} from '../profile/profile';
import {PostPage} from '../post/post';
import {SearchPage} from '../search/search';
import {AlertPage} from '../alert/alert';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = DashboardPage;
  tab2Root: any = ProfilePage;
  tab3Root: any = PostPage;
  tab4Root: any = SearchPage;
  tab5Root: any = AlertPage;
}
