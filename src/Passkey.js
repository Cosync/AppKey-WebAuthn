


//
//  Passkey.js
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
//  Copyright © 2025 cosync. All rights reserved.
// 

'use strict'; 

module.exports = class Passkey { 


    /**
     * 
     * @param {*} apiService 
     */
    constructor(apiService) {
        this.apiService = apiService;
    } 

    /**
     * 
     * @returns key challenge
     */
    addPasskey(){
        return new Promise((resolve, reject) => {  
            try {
                this.apiService.request('POST', '/api/appuser/addPasskey').then(result => { 

                    if(result.code) reject(result);
                    else{ 
                        this.apiService.user = result;
                        resolve(result);
                    } 

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
            
        })
    }

     
    
     /**
     * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
     * @param 
     * 
     * {
     *  id: Base64URLString;
     *  rawId: Base64URLString;
     *  response: {
     *      clientDataJSON: Base64URLString;
     *      attestationObject: Base64URLString;
     *      authenticatorData?: Base64URLString; 
     *    };
     *  authenticatorAttachment?: string; 
     *  type: string;
     * } attestation 
     * @returns user object
     */
    addPasskeyComplete(attestation){
        return new Promise((resolve, reject) => { 
            try { 
                let that = this;
                let valid = attestation.id && 
                            attestation.rawId && 
                            attestation.response &&
                            attestation.response.clientDataJSON && 
                            attestation.response.attestationObject && 
                            attestation.type;
                if(!valid){
                    reject({message:"invalid attestation"})
                    return
                }  
                

                this.apiService.request('POST', '/api/appuser/addPasskeyComplete', attestation).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        this.apiService.user = result; 
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
     * @returns user object
     */
    updatePasskey(keyId, keyName){
        return new Promise((resolve, reject) => {  
            try {
                let valid = keyId && keyName
                if(!valid){
                    let error = { 
                        message: "invalid data"
                    }
                    reject(error); 
                    return
                }


                this.apiService.request('POST', '/api/appuser/updatePasskey', {keyId:keyId, keyName:keyName}).then(result => { 

                    if(result.code) reject(result);
                    else{ 
                        this.apiService.user = result;
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
     * @returns user object
     */
    removePasskey(keyId){
        return new Promise((resolve, reject) => {  
            try {

                let valid = keyId
                if(!valid){
                    let error = { 
                        message: "invalid data"
                    }
                    reject(error); 
                    return
                }

                this.apiService.request('POST', '/api/appuser/removePasskey',{keyId:keyId}).then(result => { 

                    if(result.code) reject(result);
                    else{ 
                        this.apiService.user = result;
                        resolve(result);
                    } 

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
            
        })
    }

     
     
 
    
 
}
 
       