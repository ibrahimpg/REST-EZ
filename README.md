# node-api-boilerplate
A boilerplate REST API for user registration built with Node.js

Route | Request | Request Objects | Response
-|-|-|-
<**url**>/user/register | POST | username, password | message
<**url**>/user/login | POST | username, password | message, token
<**url**>/user/edit | PATCH | username, password | message
<**url**>/user/delete | DELETE | username, password | message