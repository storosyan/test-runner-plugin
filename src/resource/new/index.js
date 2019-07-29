//'use strict';
var DOMTemplateParser = function(html) {
    return new DOMParser().parseFromString(html, "text/html");
}
var TemplateParser = function(template, model) {
    let response = "";
    let n = 0;
    let m = template.indexOf("<%=", n);
    while ((m = template.indexOf("<%=", n)) >= 0) {
        response += template.substring(n, m);
        n = m + 3;
        m = template.indexOf("%>", n);
        //if (m < n) { console.error("invalid template at position " + n);}
        let key = template.substring(n, m);
        response += model[key];
        n = m + 2;
    }
    if (n > 0 && n < template.length) {
        response += template.substring(n)
    }
    return response;
}

var DiscovereyModel = Backbone.Model.extend({
    url: 'data/testDiscovery.json'
})

var TestExecutorView = Backbone.Marionette.View.extend ({
    className: "panel row test-executor",
    initialize: function() {
        alert('init')
        /*
        this.title = 'Test Executor';
        this.onceHostLabel = 'OENC host';
        this.testCountLabel = 'Total number of selected Tests cases';
        this.cleanLabel = 'Clean existing reports before generating a new one';
        this.testCount = 100;
        this.runButtonCaption = 'Run Tests';
        this.exec = new TestExecutor(exec);

        this.execTemplate =
            "<div class='row test-executor'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='panel'><span class='text-row host'><%=onceHostLabel%></span>" +
            "<span class='text-row'><input class='host-input' type='text' name='' value=''/></span></div>" +
            "<div class='panel'><span class='text-row text-label'><%=cleanLabel%></span>" +
            "<span class='text-row'><input type='checkbox' name='clean' class='clbox'></span></div>" +
            "<div class='panel'><span class='text-row text-label'><%=testCountLabel%></span><span><%=testCount%></span></div>" +
            "<div class='panel'><span class='text-row'><button class='execute-button' type='button' name='button'><%=runButtonCaption%></button></span></div>" +
            "</div>";
        this.listenTo(this, 'change:button', this.buttonClicked());
        this.render()*/
    },

    buttonClicked: function() {
        //alert('button Clicked')
    },

    enrender: function() {
        //this.$el.html(this.template(this.tag.toJSON()));
        //let execContent = TemplateParser(this.execTemplate, this)
        //this.$el.html(execContent);
        //let dom = DOMTemplateParser(execContent);
        //this.$el.add(dom);
        alert('enrender')

        return this;
    }
});


var TestRunnerView = Backbone.Marionette.View.extend ({
    className: "grid",
    //regions: {
    //    regExecutor: '.executor',
    //    regTags: '.left-col',
    //    regTests: 'rught-col'
    //},
    initialize: function(model) {
        this.model = model;
        var tags = document.createElement("div");
        tags.className = "left-col";
        var tests = document.createElement("div");
        tests.className = "right-col";
        ////this.$el.append(content);
        //this.$el.append(executor);
        this.$el.append(tags);
        this.$el.append(tests);
        this.execView = new TestExecutorView();
    },
    onShow: function() {
        alert('onshow');
        var execView = new TestExecutorView();
        this.showChildView('regExecutor', execView);
    },
    render: function() {
        //var executor = document.createElement("div");
        //executor.className = "executor";
        alert('rd')
        //this.onShow();
        this.showChildView('regExecutor', this.execView);
        return this;
    }
});

var TestRunnerLayout = allure.components.AppLayout.extend ({

    initialize: function({url}) {
        this.model = new DiscovereyModel([], {url});
    },


    loadData: function() {
        return this.model.fetch();
    },

    getContentView: function() {
        return new TestRunnerView(this.model)
    },
    onViewReady: function() {
        const {
            url
        } = this.options;
        this.onRouteUpdate(url);
    },
    onRouteUpdate: function(url) {

    }
});

allure.api.addTranslation('en', {
    tab: {
        tests: {
            name: 'Test Runner'
        }
    }
});

allure.api.addTab('tests', {
    title: 'tab.tests.name', icon: 'fa fa-list',
    route: 'tests',
    onEnter: (function () {
        return new TestRunnerLayout({
            url: 'data/testDiscovery.json'
        });
    })
});
