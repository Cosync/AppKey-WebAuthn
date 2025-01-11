


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

let _apiService = null;

module.exports = class Passkey { 


    /**
     * 
     * @param {*} apiInstance 
     */
    constructor(apiInstance) {
        _apiService = apiInstance;
    } 

    /**
     * 
     * @returns key challenge
     */
    addPasskey(){
        return new Promise((resolve, reject) => {  
            try {
                _apiService.request('POST', '/api/appuser/addPasskey').then(result => { 

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
                

                _apiService.request('POST', '/api/appuser/addPasskeyComplete', attestation).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        _apiService.user = result; 
                        resolve(result);
                    } 
                }).catch((error) => reject(error)); 

            } catch (error) {
                reject(error) 
            }
        })
    }


     /**
      *  * @param 
     * {
     *  keyId:string,
     *  keyName:string
     * }
     * @returns user object
     */
    updatePasskey(data){
        return new Promise((resolve, reject) => {  
            try {
                let valid = data.keyId && data.keyName
                if(!valid){
                    let error = { 
                        message: "invalid data"
                    }
                    reject(error); 
                    return
                }


                _apiService.request('POST', '/api/appuser/updatePasskey', {keyId:data.keyId, keyName:data.keyName}).then(result => { 

                    if(result.code) reject(result);
                    else{ 
                        _apiService.user = result; 
                        resolve(result);
                    } 

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
            
        })
    }

      /**
      *  * @param 
     * {
     *  keyId:string,
     *   
     * }
     * @returns user object
     */
    removePasskey(data){
        return new Promise((resolve, reject) => {  
            try {

                let valid = data.keyId
                if(!valid){
                    let error = { 
                        message: "invalid data"
                    }
                    reject(error); 
                    return
                }

                _apiService.request('POST', '/api/appuser/removePasskey',{keyId:data.keyId}).then(result => { 

                    if(result.code) reject(result);
                    else{ 
                        _apiService.user = result; 
                        resolve(result);
                    } 

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error);
            }
            
        })
    }

     
     
 
    
 
}
 
       