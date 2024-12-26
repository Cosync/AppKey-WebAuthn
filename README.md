# AppKey-WebAuthn 

The AppKey-WebAuthn node module is used to add functional bindings between a nodejs/react application and the AppKey service. To install this module into a NodeJS/React application do the following

---

# NPM Install

1. Open terminal and go to root project folder where package.json is

2. npm i appkey-webauthn  


## configure

The * AppKeyWebAuthn()* function call is used to the AppKeyWebAuthn to operate with a REST API that implements the AppKey api service. This function should be called once at the time the application starts up.

```
import AppKeyWebAuthn from "appkey-webauthn"

const appKeyAuth = new AppKeyWebAuthn({appToken: APP_TOKEN, apiUrl: REST_API }).getInstance();


 
```

### Parameters

**APP_TOKEN** : String - this contains the application token for AppKey (usually retrieved from the Keys section of the AppKey Portal. 

**REST_API** : String - this optional parameter contains the HTTPS REST API address for the AppKey service. The default is ' https://api.appkey.io ' if not specified.

For self-hosted versions of the AppKey server, the **REST_API** is the HTTPS REST API address of the AppKey server.


### Example

```
   
let application = await appKeyAuth.app.getApp();

let result = await appKeyAuth.auth.login({handle:'user_email@appkey.io'});

```

---

### Parameters

**none**

## getApp

The *getApp()* function is used by the client application to get information about the application within AppKey. The *getApp()* function will save user information inside member variables of the **AppKeyAPIManager.shared** object. These member variables include the following information:

* **application** : application object

The Application object contains the following fields  

* **appId** : String - unique 128 bit application id
* **displayAppId** : String - unique display application id
* **name** : String - name of application
* **userId** : String - AppKey user id who owns application
* **status** : String - 'active', 'inactive', 'migrated'
* **handleType** : String - 'email', 'phone'
* **emailExtension** : Bool - email extensions supported
* **appPublicKey** : String - app raw public key
* **appToken** : String - app token
* **smsExtension** : Bool - Twilio sms extensions supported
* **signup** : String - app signup 'open' or 'invite'
* **anonymousLoginEnabled** : Bool - anonymous login enabled
* **userNamesEnabled** : Bool - user names enabled
* **appleLoginEnabled** : Bool - Apple login function enabled
* **googleLoginEnabled** : Bool - Google login function enabled
* **appleBundleId** : String - Apple application bundle id and Application Web Service Id
* **googleClientId** : String - Google Client ID for iOS and Google Client ID for Web
* **relyPartyId** : String - domain url for Passkey WebAuthn
* **userJWTExpiration** : Int - JWT token expirations in hours
* **locales** : [String] - list of locales support by application

```
    let application = await appKeyAuth.app.getApp();
```

### Parameters

None

### Example

```
    try {
	let application = await appKeyAuth.app.getApp();

    } catch (error) {
	console.error("getApp error ", error.message)
    }
```
 

## signup

The *signup()* function is used to signup a user with a AppKey application. The signup process is spread accross three functions, which have to be called within the right order:

* **signup**
* **signupConfirm**
* **signupComplete**

The *signup()* function is responsible for registering a new user handle (email or phone) with the application. This handle must be unique to the user and not already assigned to another account. The client must also provide a display name (first and last) and can optionally include a locale (default is ‘EN’ if unspecified). The *signup()* function returns an *SignupChallenge* object, which contains a challenge to be signed by the private key generated on the client side. 

 

```
    await appKeyAuth.auth.signup(data)
```

If an error occurs in the call to the function, a AppKeyError exceptions will be thrown.

### Parameters
An object contains:
**handle** : String - this contains the user's handle (email or phone). 

**displayName** : String - this contains the user's display name.

**locale** : (Optional) String - 2 letter **locale** for the user

### Example

```
    try {
	let result = await appKeyAuth.auth.signup({handle:'user_email@appkey.io', displayName:'Demo User'})

    } catch (error) {
	console.error("signup error ", error.message)
    }
```

## signupConfirm

The *signupConfirm()* function is the second step in registering a user with an AppKey application. It’s called after the user’s biometric data has been validated on the client device and the passkey has been stored in the keychain. Since biometric verification ensures user authenticity, there’s no need for CAPTCHAs to distinguish between a human and a bot. This process prevents automated bot signups on the AppKey server. The attestation object passed to this function should be generate from your browser or other libary, and the function returns an *Signup Data* object.

```
    await appKeyAuth.auth.signupConfirm('user_email@appkey.io', atttestationObject) 
```

If an error occurs in the call to the function, a error exceptions will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 

**atttestationObject** : Attestation - this contains the user's attestation object
``` 
Atttestation Object Properties: 
    {

      id: Base64URLString;
      rawId: Base64URLString;
      response: {
          clientDataJSON: Base64URLString;
          attestationObject: Base64URLString;
          authenticatorData?: Base64URLString; 
        };
      authenticatorAttachment?: string; 
      type: string;
    }
```

To create attestation object please see a SimpleWebAuthn Library at https://github.com/MasterKale/SimpleWebAuthn 
or see our demo react website and react app projects code at https://github.com/Cosync/AppKey-WebReactDemo, https://github.com/Cosync/AppKey-ReactNativeDemo, https://github.com/Cosync/AppKey-ReactExpoDemo


### Example

```
    try {
        let signupData = await appKeyAuth.auth.signupConfirm('user_email@appkey.io', atttestationObject);

    } catch (error) {
        console.error("signup error ", error.message) 
    }
```

## signupComplete

The *signupComplete()* function is the final step in registering a user with an AppKey application, called after *signupConfirm()*. It takes the six-digit code sent to the user’s handle (email or phone) to verify ownership. AppKey uses two-factor verification: first, the user’s biometric data, and second, the code sent to their handle. If the verification is successful, the function returns a user object - ensuring the user both owns the handle and passes biometric checks.


The passed in *signup_token* is retrieved from the * signupData* object returned by the called to the *signupConfirm()* function. 
The signupComplete will automatically include the signup token in request header.



```
    await appKeyAuth.auth.signupComplete({code:six-digit-code}) 
```

If an error occurs in the call to the function, an error exceptions will be thrown.

### Parameters 

**code** : String - six-digit code sent to user's handle


### Example

```
    try {
        let result = await appKeyAuth.auth.signupComplete({code:345543})
    } catch (error) {
         
    }
```

## login

The *login()* function is used to login into a user's account. The login process is spread accross two functions, which have to be called within the right order:

* **login**
* **loginComplete**

The *login()* function initiates the passkey login process for a user handle (email or phone) that has already been registered with the application. The handle must correspond to a user that’s signed up and stored on the server. This function returns an *Login Challenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s identity is verified securely.

```
    await appKeyAuth.auth.login({handle: String}) 
	
```

If an error occurs in the call to the function, an error exceptions will be thrown.


### Parameters
	{
		handle: String - this contains the user's user name or email. 
	}

### Example

```
    try {
        let challenge = await appKeyAuth.auth.login({handle: email})

    } catch(error) {
        
    }
```

## loginComplete

The *loginComplete()* function is the second step in registering a user with an AppKey application, called after *login()*. It takes the the user’s handle (email or phone) and an Assertion object to verify the login. The assertion object passed to this function should be generate from your browser or other libary.

If the *loginComplete()* is successful it will return to the caller, the login credentials will be saved in member variable of the **appKeyAuth.auth.user** shared object:

* **user** : Object - application user object


The AppUser object contains the following fields

* **appUserId** : String - unique 128 bit user id
* **displayName** : String - user display name
* **handle** : String - user handle (email or phone)
* **status** : String - user status 'pending', 'active', 'suspended'
* **appId** : String - unique 128 bit application id
* **accessToken** : String? - JWT REST access token for logged in user
* **signUpToken** : String? - JWT REST sign up token
* **jwt** : String? - JWT login token
* **userName** : String? - unique user name (alphanumeric)
* **locale** : String? - current user locale
* **loginProvider** :  String - login type
* **lastLogin** :  String? - date stamp of last login

```
	await appKeyAuth.auth.loginComplete(handle: String, assertion: AssertionObject)
     
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Object - this contains the Assertion object


```
    Assertion Object Properties:
    {
        id: Base64URLString;
        rawId: Base64URLString;
        response: {
            clientDataJSON:Base64URLString,
            authenticatorData:Base64URLString,
            signature:Base64URLString,
            userHandle?: Base64URLString
        };
        authenticatorAttachment?: string; 
        type: string;
    }

```
To create assertion object please see a SimpleWebAuthn Library at https://github.com/MasterKale/SimpleWebAuthn or see our demo react website and react app projects code at https://github.com/Cosync/AppKey-WebReactDemo, https://github.com/Cosync/AppKey-ReactNativeDemo, https://github.com/Cosync/AppKey-ReactExpoDemo

### Example

```
    try {
        let appUser = await appKeyAuth.auth.loginComplete('user_email@appkey.io', AssertionObject)
    } catch (error){
        
    }
```

## loginAnonymous

The *loginAnonymous()* function is used to login anonymously into the AppKey system. The anonymous login process is spread accross two functions, which have to be called within the right order:

* **loginAnonymous**
* **loginAnonymousComplete**

This function will only work if the anonymous login capability is enable with the AppKey portal for the applicaiton. 

The *loginAnonymous()* function initiates the anonymous passkey login process with the application. The function is passed a uuidString string, which is used to create the anonymous handle. That way, if the client wishes to reuse an anonymous handle, it can do so by reusing the same uuidString paramter. This function returns an *Signup Challenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s anonymous identity is verified securely.

```
    await appKeyAuth.auth.loginAnonymous({handle: String})
```

If an error occurs in the call to the function, an error exception will be thrown.


### Parameters
An object contains:

**handle** : String - this contains a unique string for the anonymous user and must start with ANON_ (e.g. `ANON_${random_string}`)

### Example

```
   
    try {
        let uuid = UUID()
        let result =  await appKeyAuth.auth.loginAnonymous({handle:`ANON_${uuid}`})
    } catch (error) {
        
    }
```

## loginAnonymousComplete

The *loginAnonymousComplete()* function is the second step in registering an anonymous user with an AppKey application, called after *loginAnonymous()*. 


If the *loginAnonymousComplete()* is successful it will return to the caller, the login credentials will be saved in member variable of the **appKeyAuth.auth.user** shared object:

* **appUser** : AppUser - application user object
* **accessToken** : String? - JWT REST access token for logged in user
* **jwt** : String? - JWT login token

The AppUser object contains the following fields

* **appUserId** : String - unique 128 bit user id
* **displayName** : String - user display name
* **handle** : String - user handle (email or phone)
* **status** : String - user status 'pending', 'active', 'suspended'
* **appId** : String - unique 128 bit application id
* **accessToken** : String? - JWT REST access token for logged in user
* **signUpToken** : String? - JWT REST sign up token
* **jwt** : String? - JWT login token
* **userName** : String? - unique user name (alphanumeric)
* **locale** : String? - current user locale
* **lastLogin** :  String? - date stamp of last login

```
    await appKeyAuth.auth.loginAnonymousComplete(handle, atttestationObject)  
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Assertion - this contains the Assertion object

### Example

```
    try {
        let result = await appKeyAuth.auth.loginAnonymousComplete(`ANON_${uuid}`, atttestationObject)  
    } catch (error) {
         
    }
```


## socialLogin 

The *sociallogin()* function is used to login into a user's account using a social login provider. Currently AppKey Server supports both 'apple' and 'google' as social login providers. If the social login is successful it will return a user object to the caller that is the same as loginComplete function. 

To use the socialLogin feature, first make sure to enable and configure it in your AppKey application at appkey.io for Apple and/or Google. Next, incorporate any Apple and/or Google social login library into your project; refer to our demo projects for guidance on implementing this social login feature at:

1. https://github.com/Cosync/AppKey-WebReactDemo
2. https://github.com/Cosync/AppKey-ReactNativeDemo
3. https://github.com/Cosync/AppKey-ReactExpoDemo

* **jwt**: the JWT token of the logged in user
* **accessToken**: the access token of the logged in user

```
    await appKeyAuth.auth.socialLogin({token: String, provider: String})
```

If an error occurs in the call to the function, a CosyncAuthError exceptions will be thrown.


### Parameters
An object contains:
**token** : String - this is the login token returned by the provider

**provider** : String - this contains the social provider either 'apple' or 'google'

### Example

```
    try {
        await appKeyAuth.auth.socialLogin({token:"apple_auth_token", provider:"apple"})
    } catch (error) {
         
    }

    
```

## socialSignup

The *socialSignup()* function is used to signup a user with a AppKey server using a social provider. 


This function will sign up a user to the AppKey service using a social account `token``. Currently, the AppKey system supports both Apple Id and Google social login protocols. This function receives the social token from the social login provider and a provider string that specifies the social provider (for instance, ‘apple’ or ‘google’).

If successful, this function will return a user object for the newly signed up user. The **socialSignup** function will not succeed if a user email account has previously been established for the ’email’ provider or if an account with an alternative social provider already exists for the same email. 

This function can be passed an optional locale parameter, which specifies the user’s locale.

To utilize this socialLogin feature, first ensure you enable and set it up in your AppKey application at appkey.io for Apple and/or Google.

```
await appKeyAuth.auth.socialSignup({token: String, provider: String, handle:string, locale:string})
     
``` 
 

### Parameters
An object contains:

**token** : String - this is the login token returned by the provider

**provider** : String - this contains the social provider either 'apple' or 'google'

**handle** : String - this contains the user's email (Apple Id or Google account)  

**locale** : String - 2 letter **locale** for the user


### Example

```
    await socialSignup({token: String, provider: String, handle:String, locale:String})
```




## verify

The *verify()* function is used to verify a user's account using a saved passkey. The verify function is a lightweight version of the *login()* function. The verify process is spread accross two functions, which have to be called within the right order:

* **verify**
* **verifyComplete**

The *verify()* function initiates the passkey verification process for a user handle (email or phone) that has already been registered with the application. The handle must correspond to a user that’s signed up and stored on the server. This function returns an *LoginChallenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s identity is verified securely.

```
await appKeyAuth.auth.verify({handle: String})  
     
```

If an error occurs in the call to the function, an error exception will be thrown.


### Parameters

**handle** : String - this contains the user's user name or email. 

### Example

```
    try {
        await appKeyAuth.auth.verify({handle:'user_demo@appkey.io'})  
    } catch (error) {
        
    }
```

## verifyComplete

The *verifyComplete()* function is the second step in registering a user with an AppKey application, called after *verify()*. It takes the the user’s handle (email or phone) and an Assertion object to verify the login. 

If the *verifyComplete()* is successful it will return to the caller with a AppUser object.

```
   await appKeyAuth.auth.verifyComplete(handle: String, assertion:AssertionObject)  
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Assertion - this contains the Assertion object

### Example

```
    try {
        let appUser = await appKeyAuth.auth.verifyComplete('user_demo@appkey.io', AssertionObject)  
    } catch (error) {
        
    }
```

## logout

The *logout()* function is used by the client application to log out of the AppKey server. This function does not actually call the server, rather it erases all the local data associated with the JWT login token. This function should be called when the user logs out.

```
    appKeyAuth.auth.logout() 
```

### Parameters

none

### Example

```
    appKeyAuth.auth.logout()
```

## setUserLocale

The *setUserLocale()* function is used by the client application to set the user's **locale**. The locale is a two letter code that identifies the user's locale - by default the locale is 'EN' for English. The AppKey authentication system supports the ISO 631–1 codes that are described [ISO 639–1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). Note: a client can only set the locale for a user if that locale is supported by the application in the Cosync Portal.

```
    appKeyAuth.profile.setUserLocale({locale:string})
```

### Parameters

**locale** : String - contains the user's locale (always uppercase)

### Example

```
    try {
        await appKeyAuth.profile.setUserLocale({locale:'FR'})
    } catch (error ) {
        
    }
```

## setUserName

The *setUserName()* function is used by the client application to set the user name associated with a user account. User names must be unique names that allow the application to identify a user by something other than the email or phone handle. Typically, a user name is selected the first time a user logs in, or after he/she signs up for the first time. This function will only work if user names are enabled with AppKey for the application in the portal.

User names must consist of alphanumeric characters - starting with a letter. They are not case sensitive

```
    await appKeyAuth.profile.setUserName({userName:userName})
    
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**userName** : String - user name to be associated with logged in user

### Example

```
    try {
        await appKeyAuth.profile.setUserName({userName:'appuserdemo'})
    } catch (error) {
        
    }
```

## userNameAvailable

The *userNameAvailable()* function is used by the client application whether a user name is available and unique for the application. User names must be unique names that allow the application to identify a user by something other than the email or phone handle. 

User names must consist of alphanumeric characters - starting with a letter. They are not case sensitive

```
    await appKeyAuth.profile.userNameAvailable({userName:'appuserdemo'})
    
```
This fuction returns **true** if user name is available, **false** otherwise. 

If an error occurs in the call to the function, a AppKeyError exceptions will be thrown.

### Parameters

**userName** : String - user name to be associated with logged in user

### Example

```
    try {
        let isAvailable = await appKeyAuth.profile.userNameAvailable({userName:'appuserdemo'})
        if isAvailable {
            ...
        }
    } catch (error) {
        
    }
```
