# Isomorphic build configuration

Isomorphic app is about having scripts on both server and client side. Server side is also a node 
application that serves static HTML that corresponds to the given URL. 

This means that in **production** build we have to compile client-side script to be a static file 
and on server side we need to run an app. 

In the **development** mode we need to run server app too, but also it's good to have a live 
watcher of client-side script and hot-reloader. So we have to run another app for this, like a 
webpack-dev-server.

More of it not browser, nor the node server wants to run full-fledged ES2016-17, so we need to 
compile both sides with webpack. There are two webpack configs for that.

For all those reasons we have this much of package scripts:  
**start** - starts compiled file as a pm2 service on production server  
**stop** - stops pm2 service on production server  
**restart** - restarts pm2 service on production server  
**prod-client** - builds client-side sources to a JS file to be loaded as a static file  
**prod-server** - builds server-side sources to a JS file to be run by pm2  
**dev-client** - starts client-side as a webpack-dev-server  
**dev-server** - builds server-side sources to a JS file to be run by WebStorm debugger or whatever means 