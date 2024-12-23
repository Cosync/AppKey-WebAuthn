


//
//  Authenticator.js
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

let _user = null;


module.exports = class Authenticator { 

    /**
     * 
     * @param {*} apiService 
     */
    constructor(apiService) {
        this.apiService = apiService;
    } 

    /**
     * 
     * @param {handle:string} data : handle start with ANON_ 
     * @returns 
     */
     loginAnonymous(data){
        return new Promise((resolve, reject) => {
            try { 
                if(data.handle.indexOf("ANON_") < 0){
                    let error = {
                        code: 600,
                        message: "invalid anonymous handle. Please start with ANON_[uuid]"
                    }
                    reject(error); 
                    return
                } 

                this.apiService.request('POST', '/api/appuser/loginAnonymous', data).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        resolve(result);
                    } 
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        })
    }


     /**
     * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
     * @param 
     * handle: string,
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
     * @returns 
     */
    loginAnonymousComplete(handle, attestation){
        return new Promise((resolve, reject) => { 
            try { 
                let that = this;
                let valid = handle && 
                            attestation.id && 
                            attestation.rawId && 
                            attestation.response &&
                            attestation.response.clientDataJSON && 
                            attestation.response.attestationObject && 
                            attestation.type;
                if(!valid){
                    reject({message:"invalid attestation"})
                    return
                } 

                if(handle.indexOf("ANON_") < 0){
                    let error = {
                        code: 600,
                        message: "invalid anonymous handle. Please start with ANON_[uuid]"
                    }
                    reject(error); 
                    return
                } 
               

                this.apiService.request('POST', '/api/appuser/loginAnonymousComplete', attestation).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        that.user = result; 
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
     * @param {
     *   handle :string,
     *   displayName :string,
     *   locale? :string
     * }
     * @returns 
     */
    signup(data){
        return new Promise((resolve, reject) => { 
            try { 
                let valid = data.handle && data.displayName
                if(!valid){
                    let error = { 
                        message: "invalid signup data"
                    }
                    reject(error); 
                    return
                }

                data.handle = data.handle.toLowerCase();

                this.apiService.request('POST', '/api/appuser/signup', data).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        resolve(result);
                    } 
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        })
    }



    /**
     * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
     * @param 
     *  handle: string,
     *  {
     * 
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
     * @returns 
     */
    signupConfirm(handle, attestation){
        return new Promise((resolve, reject) => {
            try { 

                let valid = handle && 
                            attestation.id && 
                            attestation.rawId && 
                            attestation.response &&
                            attestation.response.clientDataJSON && 
                            attestation.response.attestationObject && 
                            attestation.type;

                if(!valid){
                    reject({message:"invalid attestation"})
                    return
                }

                attestation.handle = handle.toLowerCase();
                
                this.apiService.request('POST','/api/appuser/signupConfirm', attestation).then(result => {
                    if(result.code) reject(result);
                    else { 
                        this.apiService.signData = result;
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
     * @param { handle:string, code:string} data 
     * @returns 
     */
    signupComplete(data){
        return new Promise((resolve, reject) => {
            try { 
                let that = this;
                let valid = data.code; 
                if(!valid){
                    reject({message:"invalid singup data"})
                    return
                }
                
                this.apiService.request('POST', '/api/appuser/signupComplete', {code:data.code}).then(result => {
                    if(result.code) reject(result);
                    else { 
                        that.user = result;
                        this.apiService.signData = null;
                        
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
     * @param {handle:string} data 
     * 
     * @returns 
     */
    login(data){
        return new Promise((resolve, reject) => { 
            try { 
                let valid = data.handle; 
                if(!valid){
                    reject({message:"invalid login data"})
                    return
                }
                data.handle = data.handle.toLowerCase();
                this.apiService.request('POST', '/api/appuser/login', data).then(result => {
                    if(result.code) reject(result);
                    else{ 
                        resolve(result);
                    } 
                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)  
            }
        })
    }


    /**
     * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
     * @param 
     * handle:string,
     *  {
     *      id: Base64URLString;
     *      rawId: Base64URLString;
     *      response: {
     *          clientDataJSON:Base64URLString,
     *          authenticatorData:Base64URLString,
     *          signature:Base64URLString,
     *          userHandle?: Base64URLString
     *          };
     *      authenticatorAttachment?: string; 
     *      type: string;
     *  } assertion
     *  
     * @returns 
     */
    loginComplete(handle, assertion) {
        return new Promise((resolve, reject) => {
            try { 
                let that = this;
                let valid = handle && 
                assertion.id && 
                assertion.rawId && 
                assertion.response.clientDataJSON && 
                assertion.response.authenticatorData && 
                assertion.response.signature &&
                assertion.type;
                if(!valid){
                    reject({message:"invalid assertion"})
                    return
                }

                assertion.handle = handle.toLowerCase();
                
                this.apiService.request('POST', '/api/appuser/loginComplete', assertion).then(result => {
                    if(result && result['access-token']){  
                        that.user = result;
                        resolve(result);
                    } 
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            } 
        }); 
    }

    /**
     * 
     * @param {token:string, provider:string} data 
     * 
     * @returns 
     */
    socialLogin(data) {
        return new Promise((resolve, reject) => {
            try { 
                let valid = data.token && data.provider;
                
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }

                let that = this;
                this.apiService.request('POST', '/api/appuser/socialLogin', data).then(result => { 

                    if(result && result['access-token']){ 
                         
                        that.user = result;
                        resolve(result);
                    } 
                    else reject(result);

                }) 
            } catch (error) {
                reject(error)
            }
        }); 
    }

     /**
     * 
     * @param {token:string, provider:string, handle:string} data 
     * 
     * @returns 
     */
     socialSignup(data) {
        return new Promise((resolve, reject) => {
            try { 
                let valid = data.token && data.provider && data.handle;
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }
                let that = this;
                this.apiService.request('POST', '/api/appuser/socialSignup', data).then(result => {
                    if(result && result['access-token']){ 
                        
                        that.user = result;
                        resolve(result);
                    } 
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            } 
        }); 
    }


    /**
     * 
     * @param {handle:string} data 
     * 
     * @returns 
     */
    verify(data){
        return new Promise((resolve, reject) => { 
            try { 
                let valid = data.handle;
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }
                data.handle = data.handle.toLowerCase();
                this.apiService.request('POST', '/api/appuser/verify', data).then(result => {
                    if(result.code) reject(result);
                    else{ 
                    
                        resolve(result);
                    } 
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            } 
        })
    }


     /**
     * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
     * @param 
     * handle:string,
     * {  
    *      id: Base64URLString;
    *      rawId: Base64URLString;
    *      response: {
    *          clientDataJSON:Base64URLString,
    *          authenticatorData:Base64URLString,
    *          signature:Base64URLString,
    *          userHandle?: Base64URLString
    *          };
    *      authenticatorAttachment?: string; 
    *      type: string
     * } assertion
     *  
     * @returns 
     */
    verifyComplete(handle, assertion) {
        return new Promise((resolve, reject) => {
            try { 

                let valid = handle && 
                assertion.id && 
                assertion.rawId && 
                assertion.response.clientDataJSON && 
                assertion.response.authenticatorData && 
                assertion.response.signature &&
                assertion.type;
                if(!valid){
                    reject({message:"invalid assertion"})
                    return
                }

                assertion.handle = handle.toLowerCase();
                let that = this;
                this.apiService.request('POST', '/api/appuser/verifyComplete', assertion).then(result => {
                    if(result && result['access-token']){  
                        that.user = result;
                        resolve(result);
                    } 
                    else reject(result);

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        }); 
    }


    /**
     * 
     * @param {token:string, provider:string} data  
     * @returns 
     */
    verifySocialAccount(data) {
        return new Promise((resolve, reject) => {
            try { 

                let valid = data.token && data.provider;
                if(!valid){
                    reject({message:"invalid data"})
                    return
                }
                let that = this;
                this.apiService.request('POST', '/api/appuser/verifySocialAccount', data).then(result => {
                    if(result && result['access-token']){ 
                        that.user = result;
                        resolve(result);
                    } 
                    else reject(result);

                }).catch((error) => reject(error)); 
            } catch (error) {
                reject(error)
            }
        }); 
    }

    
    logout(){
        this.apiService.user = null
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
        this.apiService.user = user;
    }



}
 
       