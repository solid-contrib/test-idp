# Test IDP

A fake IDP used for the Solid Storage Test Suite.

## Install

```bash
git clone https://github.com/solid/test-idp.git
npm i
HOST=example.com  npm start
```

If your host is localhost modify you `/etc/hosts` file to include the following.
```
127.0.0.1    example.com
```
Your test-idp host is now `example.com`

Ensure that you have a wildcard host on the subdomain for your host. If your host is `example.com` then `*.example.com` should also be directed to the test-idp

## WebIDs

This module exposes WebIDs for test users. Currently, they are

- https://alice.idp.test.solidproject.org/profile/card#me 
- https://bobwebid.idp.test.solidproject.org/profile/card#me


## Getting tokens

Once your test-idp server is running, you can generate tokens test
your Solid resource server. There are two ways to do this. One is to
get all the tokens in one JSON object. To do so call the following:

```
https://example.com/tokens?aud=https://mystorageserver.example
```

Where `https://mystorageserver.example` is the URL of your storage server.

At the moment, this will return 6 tokens:
 - `ALICE_ID_GOOD`: A good ID Token representing Alice herself (not operating through any app)
 - `ALICE_POP_FOR_GOOD_APP_GOOD`: A good PoP token representing Alice using Good App (an app that is in Alices's trusted apps)
 - `ALICE_POP_FOR_BAD_APP_GOOD`: A good PoP token representing Alice using Bad App (an app that is not in Alices's trusted apps)
 - `BOB_ID_GOOD`: A good ID Token representing Bob himself (not operating through any app)
 - `BOB_POP_FOR_GOOD_APP_GOOD`: A good PoP token representing Bob using Good App (an app that is in Bob's trusted apps)
 - `BOB_POP_FOR_BAD_APP_GOOD`: A good PoP token representing Bob using
   Bad App (an app that is not in Bob's trusted apps)
   
The other is to append the above token names to the URL, e.g. 

```
https://example.com/tokens/ALICE_ID_GOOD?aud=https://mystorageserver.example
```

This will return a single bearer token.


