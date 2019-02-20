import * as feathers from 'feathers/client';
import * as hooks from 'feathers-hooks';
import * as rest from 'feathers-rest/client';
import * as authentication from 'feathers-authentication-client';
import * as superagent from 'superagent';
import { Injectable } from '@angular/core';
import {Facebook} from 'ionic-native';
import 'rxjs/Rx';
import 'isomorphic-fetch';
import {EnvironmentService} from './environment.service';
@Injectable()
export class FeathersService {
    private app: any;
    constructor() {
        let {HOST} = EnvironmentService.getEnv();
        this.app = feathers() // Initialize feathers
            .configure(rest(HOST).superagent(superagent)) // Fire up rest
            .configure(hooks()) // Configure feathers-hooks
            .configure(authentication({ storage: window.localStorage }));
    }
    login(credentials) {
        return this.app.authenticate({
            strategy: "local",
            email: credentials.email,
            password: credentials.password
        }).then((result) => {
            window.localStorage.setItem('currentUserId', result.data.id);
            return result;
        })
        // return this.app.service('auth/local').create({
        //     email: credentials.email,
        //     password: credentials.password
        // }).then((result) => {
        //     window.localStorage.setItem('currentUserId', result.data.id);
        //     window.localStorage.setItem('feathers-jwt', result.token);
        //     console.log(result.data);
        // })
    }
    loginWithFacebook() {
        return Facebook.login(["public_profile", "email"]).then(() => {
            return this.getFacebookProfile().then((profileData) => {
                console.log('login profile data', profileData);
                return this.app.service('facebook').get("login", {
                    query: {
                        email: profileData.email,
                        facebookId: profileData.id
                    }
                }).then((result) => {
                    window.localStorage.setItem('currentUserId', result.data.id);
                    window.localStorage.setItem('feathers-jwt', result.token);
                    return result;
                });
            });
        });
    }
    signUp(credentials) {
        return this.app.service('users').create({
            email: credentials.email,
            first_name: credentials.firstName || "",
            last_name: credentials.lastName || "",
            password: credentials.password,
            username: credentials.username || credentials.first_name || ""
        });
    }
    signUpWithFacebook() {
        return Facebook.login(["public_profile", "email"]).then((status) => {
            console.log('facebook login status', status);
            return this.getFacebookProfile().then((profileData) => {
                console.log('profile data', profileData);
                return this.app.service('users').create({
                    email: profileData.email,
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    username: profileData.first_name,
                    facebookId: profileData.id
                });
            });
        });
    }
    logOut() {
        window.localStorage.setItem('currentUserId', null);
        return this.app.logout();
    }
    getUser() {
        return window.localStorage.getItem('currentUserId');
    }
    getFacebookProfile() {
        return Facebook.api('me?fields=email,first_name,last_name', null)
    }
    service(name: string) {
        return this.app.service(name);
    }
}
