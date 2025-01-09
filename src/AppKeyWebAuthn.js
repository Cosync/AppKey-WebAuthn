
//
//  AppKeyWebAuthn.js
//  AppKeyWebAuthn
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  Created by Tola Voeung.
//  Copyright © 2024 cosync. All rights reserved.
// 


 
'use strict';
const App = require('./App'); 
const Profile = require("./Profile"); 
const Authenticator = require("./Authenticator"); 
const APIService = require("./APIService"); 
const Passkey = require("./Passkey"); 
let _profile, _passkey, _app, _auth, _config, _apiService; 
let _user;

class AppKeyWebAuthn {

    constructor(data) {
        this.config = data;
    } 

    

    /**
     * 
     * @param {*} config
     * {
     *  apiUrl,  appToken
     * }
     */
    set config(conf){ 
       
        if(!conf || !conf.appToken) {
            throw('AppKeyAuth: Invalid App Token...');
        }

        if(!conf.apiUrl || conf.apiUrl == '' ) conf.apiUrl = 'https://api.appkey.io'; 
        _config = conf;

        _apiService = new APIService(conf); 
        _app = new App(_apiService);
        _auth = new Authenticator(_apiService); 
        _profile = new Profile(_apiService);
        _passkey = new Passkey(_apiService)
        
    }

    get apiService () {
        return _apiService;
    } 


    get config () {
        return _config;
    } 

    /**
     * 
     * @returns app class
     */
    get app(){
        return _app;
    }


    /**
     * 
     * @returns authenticator class
     */
    get auth(){
        return _auth;
    }


    /**
     * 
     * @returns profile class
     */
    get profile(){
        return _profile;
    } 


    /**
     * 
     * @returns passkey class
     */
    get passkey(){
        return _passkey;
    } 
    
 
    /**
     * 
     * @returns user object
     */
    get user(){
        return _user;
    }


     /**
     * @param {object} user  
     *   
     */
    set user(user){
        _user = user; 
    }
 
  
}



class Singleton {

    constructor(data) {
        if (!Singleton.instance) {
            Singleton.instance = new AppKeyWebAuthn(data);
        }
    }
  
    getInstance() {
        return Singleton.instance;
    }
  
} 
exports = module.exports = Singleton;
 