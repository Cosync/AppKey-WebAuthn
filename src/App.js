
//
//  App.js
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

let _application = null;

module.exports = class App {

    /**
     * 
     * @param {*} apiService 
     */
    constructor(apiService) {
        this.apiService = apiService;  
    } 

    /**
     * 
     * @returns application object
     */
    getApp(){
        return new Promise((resolve, reject) => {  
            try { 
                this.apiService.request("GET", '/api/appuser/app').then(result => {
                    if(result.code) reject(result);
                    else{
                        _application = result;
                        resolve(result);
                    } 
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        })
    }

     /**
     * 
     * @returns application object
     */
    get application(){
        return _application;
    }

 

}
 
       