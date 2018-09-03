# REST-EZ

## A lightweight user registration REST API for Node.js

A boilerplate REST API for user registration built with Node.js. Built to be easily configurable, highly customizable, and easily extendable. Use of direct image saving to MongoDB saves us from using multer, express-validator, and AW3. Optimized for quick deployment on Heroku with the mLab addon. Simply configure the variables found in the index.js file and follow the instructions for the environmental variables to quickly get the API running and implement user registration for your web, desktop, or mobile application.

---

## Install

1. `git clone https://github.com/ibrahimpg/node-api-boilerplate.git`

2. `cd folderName`

3. `npm install`

---

## Environmental Variables

* JWT_KEY
* PORT
* CLIENT_URL
* MLAB_URL

---

## Configuration

There are several aspects of this API that are easily configurable to tailor to specific use cases.

* api/models/user.js - Change the minimum and maximum length of username's, as well as the maximum length of bio's.
* api/middleware/multer.js - File size is limited to 1MB (1024 x 1024 x 1). The last number can be changed to reflect the MB limit you want on file uploads, up to the MongoDB maximum document size of 16 MB. Keep in mind that large files take longer to process and save and can make your database slow.
* api/middleware/multer.js - Change the file filter requirements to include the image file extensions you want to accept, or remove the pre-existing acceptance jpeg and/or png.
* api/routes/user.js - Change the minimum password length in the registration route, as well as the default bio upon registration.

---

## Dependencies

[express](https://github.com/expressjs/express) 4.16.3 --- [mongoose](https://github.com/Automattic/mongoose) 5.2.12 --- [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 8.3.0 --- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) 2.4.3 --- [multer](https://github.com/expressjs/multer) 1.3.1

---

## API

Routes | HTTP | Request Objects | Response Objects[1]
-|-|-|-|-
<**url**>/user/view | GET | none | message
<**url**>/user/register | POST | username, password | message, error
<**url**>/user/login | POST | username, password | message, error, token
<**url**>/user/update | PATCH[3] | token[2], bio, display | message, error
<**url**>/user/delete | DELETE | token[2] | message, error

1. Indicate **possible** response objects.
2. Sent in Authorization header as "Bearer <**token**>"
3. Both bio and display must be sent to the update route.

If you're wondering why it isn't necessary to send the username in the update/delete routes, it's because the JWT middleware is able to unpack them from the token that is received.

---

## Tips

1. On the client: automatically log out user (delete sessionStorage/localStorage) if authentication failure response is received from API.

2. Implement "are you sure you would like to delete your account?" functionality on the client-side. The delete route executes if it receives a valid token. The token contains the user's internal ID and username (and the client having a valid token indicates that they signed in to that account with the correct password).

3. Sending tokens along with form data is easy with the [FormData interface](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

4. Encode a string in base-64:

`let newData = btoa(String.fromCharCode(...new Uint8Array(oldData)))`

5. Display base-64 as an image in HTML:

`<img src = "data:${contentType};base64, ${newData}" alt="alt text" width=X height=Y>`

6. When receiving a token from the server, you can save it to the client through [local or session storage](https://www.w3schools.com/html/html5_webstorage.asp).

7. Use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make requests to the server in vanilla JavaScript.

---

## User Model

* Unique Internal ID
* Registration Date
* Username (lowercase alphanumeric between 6 and 16 characters)
* Password (hashed, 6 characters minimum)
* Bio (max 200 characters)
* Display Picture

---

## Possible Improvements

* Email confirmation during registration
* Password recovery via email
* Admin routes for admin control panel (maybe irrelevant with upper tier mLab clusters)
* GET request for all users? Depending on the app, for admin use or general public use.

---

## People

Created and maintained by Ibrahim PG. You can check out some of my other projects [here.](https://ibrahimpg.com)

---

## License

[MIT](https://github.com/ibrahimpg/REST-EZ/blob/master/LICENSE)