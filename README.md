# gradeable

## About
A simple web app for creating and grading multiple choice tests. Allows teachers to print tests of their own design. Does not require proprietary bubble sheets. Students can fill out the test directly on the printed sheet. Teachers simply scan in all the test pages and hundop grades and sorts the tests.

## Setup

1. requires mongodb to run, run mongod.exe, then mongo.exe, create a database called hundop by typing 'use hundop' into the mongo.exe shell

2. run yarn install inside gradeable/frontend/client/

3. run yarn install inside the gradeable/frontend/ 

4. run yarn dev inside gradeable/frontend/

5. express server should start on port 5000, node server for react should run on port 3000

6. open http://localhost:3000/ in browser to see web page
