tinng-client-web
================

Web client for tinng service

##Development

####Needed software:

* Node Packaged Modules (npm) [https://www.npmjs.org/]()
* Bower (``npm install -g bower``)
* Polymer Vulcanize (``npm install -g vulcanize``)
* Bash shell (in Windows comes with [http://git-scm.com/](git-scm) and is named git bash)

####First time instructions

First, run ``project-build.sh``

####After you pull changes (if it's not the first time)

Run ``project-update.sh`` to get latest bower packages and create minimized indices;

####After you develop

You develop in ``index-source.html`` and run ``project-compact.sh`` to compile it to vulcanized and minified ``index.html`` and
 just vulcanized ``index-dev.html``
 
 You also can run program in browser using ``[yourdomain]/index-source.html``
