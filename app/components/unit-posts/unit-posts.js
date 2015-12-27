/**
 * Created by lerayne on 27.12.15.
 */

Polymer({

    // Polymer related

    is: 'unit-posts',

    behaviors: [
        tinng.polymerBehavior.Nodelist,
        tinng.polymerBehavior.Unit,
        tinng.polymerBehavior.Basic
    ],

    properties: {
        selectedTopic: {
            type: Number,
            value: 0,
            observer: 'subscribe'
        },

        private: {
            type: Boolean,
            value: false,
            computed: 'isTopicPrivate(topic.private)',
            observer: 'onPrivateChanged',
            reflectToAttribute: true
        }
    },

    listeners: {
        "send-message": "sendMessage"
    },


    ready: function () {

        this.fullframe = false;
        this.postsPerSlice = 50;
        this.currentSliceTop = 0;
        this.renameMode = false;

        this.initVars();

        if (tinng.router.get('topic')) {
            this.selectedTopic = _.parseInt(tinng.router.get('topic'));
            //console.log('this.selectedTopic', this.selectedTopic)
        }
    },

    //other

    /**
     * This vars should be set to initial values on both component start and clean
     */
    initVars: function () {
        this.nodes = [];
        this.topic = {};
        this.headLoaded = false;
        this.rights = {canRename: false};
        this.currentSliceTop = this.postsPerSlice;
    },


    /**
     * Cleans all vars and cancels subscriptions, cleans route
     */
    clean: function () {
        this.initVars();

        //this.$.postsList.clean();
        //todo - теперь обзёрвер вызывается сразу, поэтому делать сразу клин нельзя, стирается инфа из адресной строки

        //tinng.router.note('topic', null);
        //tinng.router.note('start', null);

        //todo - think up the algorythm for cleaning the route only when it's needed (on change topic but not on load)

        tinng.connection.unscribe(this, 'posts-main');
        tinng.connection.unscribe(this, 'topic-data-main');
    },


    /**
     * Subscribe to the posts and properties of a selected topic
     * (attention! this func is being called by observer of this.selectedTopic)
     */
    subscribe: function () {
        this.clean();

        //console.log('subscribe posts of', this.selectedTopic)

        //todo - raw way
        if (this.selectedTopic) {

            tinng.router.note('topic', this.selectedTopic);

            tinng.connection.subscribe([
                {
                    subscriber: this,
                    feedName: 'posts-main',
                    feed: {
                        feed: 'posts',
                        limit: this.currentSliceTop,
                        topic: this.selectedTopic
                    },
                    parser: function (data) {

                        this.parseUpdates(data);
                    }
                }, {
                    subscriber: this,
                    feedName: 'topic-data-main',
                    feed: {
                        feed: 'topic',
                        id: this.selectedTopic
                    },
                    parser: function (data) {

                        // avoiding binding error with undefined private field
                        // todo - maybe fix server response here
                        if (data.private == '0') {data.private = []}

                        this.topic = data;

                        // todo - set rights for topic here
                        // right now user.id is filled after topic load, so rename is unable on startup. THIS IS FINE!
                        // 'cause rigts announcements should come from server, not be computed from existing data math
                        if (tinng.user) {
                            this.rights.canRename = (tinng.user.id == this.topic.author_id || tinng.user.id == 1);
                        }
                        this.fire('iron-signal', {name: 'topic-loaded', data: {id: data.id}});
                    }
                }
            ]);


        }
    },



    /**
     * Parse received nodes list
     *
     * @param nodes - nodes model from server response
     */
    parseUpdates: function (nodes) {

        var firstLoad = !this.nodes.length;
        var wasAtTop = this.isAtTop();
        var setHeadLoaded;

        // memorizing scroll position
        if (!firstLoad && wasAtTop) {
            var topPost = $(this.$.scroll).children('card-post').eq(0);
            var topOffset = topPost[0].offsetTop;
        }

        if (firstLoad) {
            // если это первичная загрузка

            //this.headLoaded = false; // possibly duplicate

            if (typeof _(nodes).find({id: this.selectedTopic+''}) != 'undefined') {
                this.headLoaded = true;
            }

            // если мы заполняем массив первый раз - нужно его отсортировать
            this.nodes = this.sort(nodes, this.sortField, this.sortOrder);

        } else {
            // если в массиве уже есть ноды
            _(nodes).each(this.posts_processNode.bind(this));
        }

        if (firstLoad || this.isAtBottom()) {
            this.async(this.toBottom)
        }

        // using memorized scroll position to maintain scroll position
        if (!firstLoad && wasAtTop) {
            this.async(function () {
                topPost[0].scrollIntoView();
                this.$.scrollContainer.scrollTop = this.$.scrollContainer.scrollTop - topOffset;
            })
        }

        this.loaded = true;
        this.loading = false;
    },


    /**
     * Process single node
     *
     * @param data - node data from server
     */
    posts_processNode: function (data) {

        if (data.id == this.selectedTopic) {
            this.headLoaded = true;
        }

        // Use node behavior's method
        this.processNode(data);
    },



    // Load more and related

    loadMore: function () {
        this.showLoading();

        // todo - bug: sometimes loads wrong amount
        tinng.connection.rescribe(this, 'posts-main', {
            limit: this.currentSliceTop += this.postsPerSlice
        });
        tinng.router.note('start', this.currentSliceTop);
    },

    showLoadMore: function (nodes, headLoaded) {
        console.log('showLoadMore', nodes.length && !headLoaded)
        return nodes.length && !headLoaded
    },

    showLoading: function () {
        this.loaded = false;
        this.loading = true;
    },




    topicSelect: function (event, details) {

        this.loading = true;

        this.selectedTopic = details.topic.id;
    },

    sendMessage: function (event, message) {

        if (!!this.selectedTopic && !message.body.match(/^\s*$/)) {

            tinng.connection.write({
                action: 'add_post',
                topic: this.selectedTopic,
                message: message.body
            });

            this.$.editor.clean();
        }
    },

    //draft

    isTopicPrivate: function (privat) {
        console.log('is-private', privat)
        return typeof privat != 'undefined' && !!privat && privat.length > 0
    },

    onPrivateChanged:function(privat){
        if (privat){
            this.$.toolbar.classList.add('medium-tall')
        } else {
            this.$.toolbar.classList.remove('medium-tall')
        }
    },

    showRenameButton: function (haveRight, allreadyRenaming) {
        return haveRight && !allreadyRenaming;
    },

    meSingle: function () {
        this.fullframe = true;
    },

    goBack: function () {

        this.async(function () {
            this.fullframe = false;
        }, null, 250);

        this.fire('reveal', {sender: this})
    },

    unlock: function () {
        tinng.connection.query('service', null, {
            action: 'unlock_message',
            id: this.selectedTopic
        })
    },


    checkAndLock: function (callback) {
        tinng.connection.query('service', callback.bind(this), {
            action: 'check_n_lock',
            id: this.selectedTopic
        });
    },

    rename: function () {
        this.checkAndLock(function () {
            this.oldName = this.topic.topic_name;
            this.renameMode = true;
        });
    },

    cancelRename: function () {
        this.unlock();
        // todo - lurk mutation observer or wait for polymer to implement contenteditable feature
        this.$.topicName.innerText = this.oldName;
        this.renameMode = false;
    },

    saveName: function () {
        this.unlock();
        this.renameMode = false;

        tinng.connection.write({
            action: 'update_message',
            topic_name: this.$.topicName.innerText,
            id: this.selectedTopic
        });
    }
});