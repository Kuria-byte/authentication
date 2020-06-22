# About
- Learning user website Authentication
- Passport strategy for authenticating with ***Facebook and Google using the OAuth 2.0 API.***
- This lets you authenticate using Facebook/Google in your Node.js applications. By plugging into Passport, Facebook/Google authentication can be easily and unobtrusively integrated into any application or framework that supports ***Connect-style middleware***, including Express.

## What I learnt📐
- PassportJs & Cookie sessions for Authentication
- Bcrypt,Hashing and salting
- Hashing using MD5
- Passport google oauth2

## Level 2-5
- Each commit has a different authentication strategy ranging from safe to safest.
- Pick up where you'd like to start depending on what you'd like to implement.

## Installation
- $ npm install passport-facebook

### Usage
- Create an Application
- Before using passport-facebook/Google, you must register an application with Facebook or Google

## Configure Strategy
- The Facebook authentication strategy authenticates users using a Facebook account and OAuth 2.0 tokens.
- The app ID and secret obtained when creating an application are supplied as options when creating the strategy.
- The strategy also requires a verify callback, which receives the access token and optional refresh token, as well as profile which contains the authenticated user's Facebook profile. The verify callback must call cb providing a user to complete authentication.

### References❤
- https://www.geeksforgeeks.org/password-hashing-with-md5-module-in-node-js/
- https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/
- https://www.thesslstore.com/blog/difference-encryption-hashing-salting/

