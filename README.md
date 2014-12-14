tinng-client-web
================

Web client for tinng service

##Development

####Needed software:

* Node Packaged Modules (npm) [https://www.npmjs.org/]()
* Bower (``npm install -g bower``)
* Polymer Vulcanize (``npm install -g vulcanize``)
* Bash shell (in Windows comes with [http://git-scm.com/](git-scm) and named as 'git bash')

####First time instructions

First, run ``project-init.sh``

####After you pull changes (if it's not the first time)

Run ``project-update.sh`` to get latest bower packages and create minimized index.html;

####Development notes

1. If you need to make changes in index file - place them in ``index-source.html``, **do not touch** ``index.html`` or 
``index-dev.html``, these are built with automated scripts 

2. Web components concept allows developer to make browser client of some service without a use of any sever scripting 
languages (maybe except for apache .htaccess). In Tinng's web client we decided to avoid using php, python, node.js or any other 
complex server-side scripting. To make solid build of a program for end user we use Polymer vulcanize and thinking of using
grunt, gulp or some other build tools. Please do not implement nothing but apache overriding scripts

 
####Testing results of your work in browser

You can see your changes by going directly to ``[yourdomain]/index-source.html``, but when it comes to real testing - 
run ``project-compact.sh`` to compile it to vulcanized and minified ``index.html`` and
just vulcanized ``index-dev.html``
