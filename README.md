Node.js demo app for Node.js
=============================

A demo app that uses Prediction.io node.js SDK.

https://github.com/PredictionIO/PredictionIO



Install the demo app
----------

1. Install Preditcion.io server - instructions: http://docs.prediction.io/current/installation/index.html
2. Install node.js - http://nodejs.org/
3. Extract repo to some directory (ex. `` C:/pio_demo ``)
4. Open cmd (windows) or terminal (mac)
5. change directory to the project directory: `` cd C:/pio_demo ``
6. Install module dependencies
  ```
    npm install
  ```
7. Run the webapp server
  ```
    node index
  ```
8. Open your browser to `` http://localhost:7676  ``
9. 



Use the demo app
-----------
The demo has a 3-column interface: Users, Colors, and Recommendations

This simulates the typical prediction.io use case environment. In this case, we are simulating a community of users that have various color preferences. We want to present our users with color recommendations using Prediction.io.

In a real setup, colors would be something more useful - movies, music, places, etc. But this is a simplified sandbox to explore the functionality. 

1. Add new users by filling out the name text field, and clicking the [+]
2. Add new colors by clicking the [+] next to Colors
3. Click a user in the Users table to work with a particular user.
  1. Click colors to add them to the user's  list of likes.
  2. Recommendations for the user are shown in the Recommendations column.

--------

Built during UCOSP 2014 http://ucosp.ca/
