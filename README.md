# About
- Learning user website Authentication
- Passport strategy for authenticating with Facebook using the OAuth 2.0 API.

-This lets you authenticate using Facebook in your Node.js applications. By plugging into Passport, Facebook authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.

## Installation
- $ npm install passport-facebook
- Usage
-Create an Application
-Before using passport-facebook, you must register an application with Facebook..


## Configure Strategy
- The Facebook authentication strategy authenticates users using a Facebook account and OAuth 2.0 tokens.
- The app ID and secret obtained when creating an application are supplied as options when creating the strategy.
- The strategy also requires a verify callback, which receives the access token and optional refresh token, as well as profile which contains the authenticated user's Facebook profile. The verify callback must call cb providing a user to complete authentication.

