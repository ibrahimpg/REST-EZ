# REST-EZ

## A lightweight user registration REST API for Node.js

Simple to customize and easily extendable, this API is optimized for quick deployment on Heroku with an mLab cluster, but can be configured to work in any other setup.

---

## Install

1. `git clone https://github.com/ibrahimpg/REST-EZ.git`

2. `cd REST-EZ`

3. `npm install`

---

## Environmental Variables

* JWT_KEY
* PORT
* CLIENT_URL
* MLAB_URL

---

## Customization

* **api/models/user.js** - Change minimum and maximum username length, as well as maximum bio length.

* **api/middleware/multer.js** - File size is limited to 1MB (1024 x 1024 x 1). The last number can be changed to reflect the MB limit you want on file uploads, up to the MongoDB maximum document size of 16 MB (1024 x 1024 x 16). Keep in mind that large files take longer to process.

* **api/middleware/multer.js** - Change image filter requirements to include different file extensions.

* **api/routes/user.js** - Registration route - Change minimum password length and default display picture and bio upon registration.

---

## Dependencies

[express](https://github.com/expressjs/express) 4.16.3 --- [mongoose](https://github.com/Automattic/mongoose) 5.2.12 --- [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 8.3.0 --- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) 2.4.3 --- [multer](https://github.com/expressjs/multer) 1.3.1

---

## API


Routes | HTTP | Request Objects | Response Objects[1]
| --- | --- | --- | --- |
<**url**>/user/view | GET | none | message, error
<**url**>/user/register | POST | username, password | message, error
<**url**>/user/login | POST | username, password | message, error, token
<**url**>/user/update | PATCH[3] | token[2], bio, display | message, error
<**url**>/user/delete | DELETE | token[2] | message, error

1. Indicates **possible** response objects.
2. Sent in Authorization header as "Bearer <**token**>"
3. Both bio and display must be sent to the update route.

**Note:** Remember that JWT can decode the token received from the client. This is why the username is not required in the update and delete routes - it can be attained from the token that has been sent.

---

## UI Tips

* When receiving a token from the server, you can save it to the client through [local or session storage](https://www.w3schools.com/html/html5_webstorage.asp). Automatically log user out (delete local or session storage and refresh) if authentication failure response is received from the server. 

* The delete user route executes immediately when a valid token is sent to it. Make sure to have client-side confirmation to make a delete request.

* You can send tokens in [fetch requests](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) when making JSON-based requests to the server or with the [FormData interface](https://developer.mozilla.org/en-US/docs/Web/API/FormData) when sending multipart/form data.

* How to convert buffer data to base-64:

`let base64Data = btoa(String.fromCharCode(...new Uint8Array(bufferData)))`

* Display base-64 data as an image in HTML:

`<img src = "data:${contentType};base64, ${base64Data}" alt="alt text" width=X height=Y>`

---

## User Model

* Unique Internal ID
* Registration Date
* Username (lowercase alphanumeric between 6 and 16 characters)
* Password (hashed, 6 characters minimum)
* Bio (max 200 characters)
* Display Picture (max 1 MB)

---

## Possible Future Improvements

* Email confirmation during registration and account recovery via email.
* Admin routes to allow easy moderation of users via a control panel UI.

---

## People

Created and maintained by Ibrahim PG. You can check out some of my other projects [here.](https://ibrahimpg.com)

---

## License

[MIT](https://github.com/ibrahimpg/REST-EZ/blob/master/LICENSE)
