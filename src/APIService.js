
//
//  APIService.js
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


let _user = {};

module.exports  = class APIService {
    
    /**
     * 
     * @param {*} config 
     * {
     *  apiUrl,  
     *  appToken,
     *  accessToken
     * }
     */
    constructor(config) {

        if(!config || !config.appToken) {
            throw('ApiRequest: Invalid Config...');
        }

        this.appkeyConfig = config;

        
    } 

    set user (user){
        _user = user
    }

    get user (){
        return _user
    }
 

    /**
     * 
     * @param {*} endpoint 
     * @param {*} data 
     * @returns 
     */
    request(method, endpoint, data) {
        return new Promise((resolve, reject) => {  
            try { 
           
                method = method ? method : "POST"
                let option = {
                    method: method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    }
                };
        
                if(method != "GET" && data) option.body = JSON.stringify(data);  
        
                if(_user && _user['access-token']) option.headers['access-token'] = _user['access-token'];
                else if (data && data.signupToken) option.headers['signup-token'] = data.signupToken;
                else option.headers['app-token'] = this.appkeyConfig.appToken; 
        
                fetch(`${this.appkeyConfig.apiUrl}${endpoint}`, option)
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((error) => reject(error)); 
            
            } catch (error) {
                reject(error)   
            }
        })
    } 


}