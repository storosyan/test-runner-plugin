'use strict';

let getTestCases = function(ti, ind) {
    var html = "";
    var label = ti.displayName;
    html = '<p>' + ind + label + '</p>';
    var children = ti.children;
    if (typeof children !== 'undefined') {
        var i;
        for (i = 0; i < children.length; i++) {
            html += getTestCases(JSON.parse(JSON.stringify(children[i])), ind + "&nbsp;&nbsp;") + '\n';
        }
    }
    return html;
}

let getTags = function(data) {
    let html = "";
    return html;
}
var TestRunnerTreeModel = Backbone.Model.extend({
    initialize(
        models,
        {url}) {
        this.url = url;
    }

})

//const template = function (data) {
//    return '<h3>Available Tests</h3><div style="overflow-y: scroll;">' + testCase(data, "&nbsp;&nbsp;") + '</div>';
//};

allure.api.addTranslation('en', {
    tab: {
        tests: {
            name: 'Test Runner'
        }
    }
});

var TestRunnerTreeView = Backbone.Marionette.View.extend({
    //template: template,

    render: function () {
        let js = JSON.parse(JSON.stringify(this.options));
        let content =
                '<h3>Available Tags</h3><div>'
                + getTags(js) + '</div>'
                + '<h3>Available Tests</h3><div style="overflow: auto; max-height: 100vh;">'
                + getTestCases(js, "");
        this.$el.html(content + '</div>');
        return this;
    }

});

class TestRunnerTreeLayout extends allure.components.AppLayout {

    initialize({url}) {
        //alert('layout:init')
        super.initialize();
        this.tree = new TestRunnerTreeModel([], {url});
    }

    loadData() {
        //alert('layout:load')
        return this.tree.fetch();
    }

    getContentView() {
        //alert('layout:content')
        return new TestRunnerTreeView(this.tree)
    }
    onViewReady() {
        const {url} = this.options;
        this.onRouteUpdate(url);
    }
    onRouteUpdate(url) {

    }
}

allure.api.addTab('tests', {
    title: 'tab.tests.name', icon: 'fa fa-list',
    route: 'tests',
    onEnter: (function () {
        //alert('addtab')
        return new TestRunnerTreeLayout({
            url: 'data/testDiscovery.json'
        });
    })
});
