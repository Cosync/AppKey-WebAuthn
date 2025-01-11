


//
//  Profile.js
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

module.exports = class Profile { 


    /**
     * 
     * @param {*} apiService 
     */
    constructor(apiService) {
        this.apiService = apiService;
    } 

    /**
     * 
     * @returns application user
     */
    getAppUser(){
        return new Promise((resolve, reject) => {  
            try {
                this.apiService.request('GET', '/api/appuser/user').then(result => { 

                    if(result.code) reject(result);
                    else{  
                        resolve(result);
                    } 

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
            
        })
    }

     

     /**
     * 
     * @param {locale:string} data 
     * @returns 
     */
     setLocale(data){
        return new Promise((resolve, reject) => {   
            try {
                let valid = data.locale;
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }

                this.apiService.request('POST', '/api/appuser/setLocale', data).then(result => { 
                    if(result == true) resolve(result);
                    else reject(result);
                }).catch((error) => reject(error)); 
            } catch (error) {
                resolve(error)   
            }
        })
    }

  

    /**
     * 
     * @param {displayName:string} data 
     * @returns  
     */
    updateProfile(data){
        return new Promise((resolve, reject) => {  
            try {
                let valid = data.displayName;
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }

            
                this.apiService.request('POST', '/api/appuser/updateProfile', data).then(result => { 
                    if(result.code) resolve(result);
                    else reject(result);
                }).catch((error) => reject(error)); 
            } catch (error) {
                    
            }
        })
    }

    /**
     * 
     * @param {userName:string} data 
     * @returns  
     */
    setUserName(data){
        return new Promise((resolve, reject) => {  
            try {
               
                if(!data.userName){
                    reject({message:"invalid data"});
                    return
                } 

                data.userName = data.userName.toLowerCase(); 

                this.apiService.request('POST', '/api/appuser/setUserName', data).then(result => { 
                    if(result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
        })
    }



    /**
     * 
     * @param {userName:string} data 
     * @returns  
     */
    userNameAvailable(data){
        return new Promise((resolve, reject) => {  
            try {
                
                if(!data.userName){
                    reject({message:"invalid data"});
                    return
                } 

                data.userName = data.userName.toLowerCase(); 
                
                this.apiService.request('GET', `/api/appuser/userNameAvailable?userName=${data.userName}`).then(result => { 
                    if(result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        })
    }

    
    /**
     * 
     * 
     * @returns  
     */
    deleteAccount(){
        return new Promise((resolve, reject) => {  
            try { 
            
                this.apiService.request('POST', '/api/appuser/deleteAccount', {}).then(result => { 
                    if(result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)        
            }
        })
    }

    
 
}
 
       