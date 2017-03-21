/**
 * Created by lerayne on 02.01.16.
 */
Polymer({

    //Polymer-specific fields
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    is: 'unit-topics',

    behaviors: [
        tinng.polymerBehavior.Nodelist,
        tinng.polymerBehavior.Unit,
        tinng.polymerBehavior.Basic
    ],

    ready: function () {
        // set default sorting
        this.sortField = 'updated';
        this.sortOrder = 'desc';

        //interface
        this.searchOn = false;

        this.subscribe();
    },

    listeners:{
        //interface
        'search-cleared':'searchHide'
    },



    // Main data workflow
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Subscribes this unit to topic updates
     */
    subscribe: function () {

        this.clean();

        tinng.connection.subscribe({
            subscriber: this,
            feedName: 'topics-main',
            feed: {
                feed: 'topics'
            },
            parser: function (data) {
                this.parseUpdates(data);
            }
        });
    },


    /**
     * Transfer unit to initial state
     */
    clean: function () {
        this.nodes = [];
        tinng.connection.unscribe(this, 'topics-main');
    },


    /**
     * Main parsing function that transforms list of updates from server to the new model
     */
    parseUpdates: function (nodes) {

        // prepare all nodes
        _(nodes).each(this.prepareNode.bind(this));

        if (!this.nodes.length) {
            // если это первичная загрузка

            // если мы заполняем массив первый раз - просто присваеваем, отсортировав
            this.nodes = this.sort(nodes, this.sortField, this.sortOrder);

        } else {
            // если в массиве уже есть ноды - обработать каждую
            _(nodes).each(this.topics_processNode.bind(this));

            // todo - нужно либо отключить соблюдение сортировки в processNode, либо сделать условие на выполнение sortSelf
            // (было ли обновление) иначе - двойная работа. А еще лучше - сначала, если есть обновления, А ТАКЖЕ если от
            // обновлений может зависеть порядок - обновить и отсортировать, а затем добавить/удалить с само-сортировкой.
            // Чтобы понять, нужна ли сортировка - можно проверять, изменилось ли поле, по которому сортируем ;)
            this.sortSelf();
        }
    },


    /**
     * Process separate node
     */
    topics_processNode: function (data) {
        this.processNode(data);
    },


    /**
     * Called when iron-signal "topic-loaded" is broadcasted (apparently from unit-posts component)
     *
     * @param event
     * @param data
     */
    onTopicLoaded: function (event, data) {
        this.topics_markSelected(data.id);
    },


    topics_markSelected: function (id) {
        this.clearSelection();
        this.markSelected(id)
    },


    // Unit interface
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Show unit's slide-in menu
     */
    menuShow: function () {
        this.$.slideMenu.menuShow();
    },


    /**
     * Show unit's header search field
     */
    searchShow: function(){
        this.searchOn = true;
        this.$.searchCollapser.open(this.searchFocus.bind(this));
    },


    /**
     * Start search fiels's hiding process
     */
    searchHide:function(){
        this.$.searchCollapser.close(this._searchFinishHiding.bind(this));
    },


    /**
     * Finish search fiels's hiding process (runs on animation's end)
     *
     * @private
     */
    _searchFinishHiding: function(){
        this.searchOn = false;
    },


    /**
     * Give focus to searche's input box
     */
    searchFocus: function(){
        this.$.search.focus()
    },

    /**
     * For future suspend/restore commands
     *
     * @param event
     * @param data
     */
    parseSignal: function (event, data) {
        //console.log(data);
        if (data.command == 'suspend') {
            console.info('SUSPEND topics unit activity')
        }

        if (data.command == 'restore') {
            console.info('RESTORE topics unit activity')
        }
    }
});