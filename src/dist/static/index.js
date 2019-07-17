'use strict';

let buildTestsList = function (parentElement, items) {
    var i, li, inp;
    if (typeof items.children !== 'undefined') {
        var u = document.createElement("ul");
        u.style.listStyle = 'none';
        parentElement.append(u);
        for (i = 0; i < items.children.length; i++) {
            li = document.createElement('li');
            inp = document.createElement('input');
            inp.type = 'checkbox';
            inp.className = 'cbox';
            li.append(inp);
            li.className = 'dir';
            li.style.cursor = 'pointer';
            li.style.marginTop = '10px';
            if (typeof items.children[i].tags !== 'undefined') {
                li.innerHTML += items.children[i].displayName + ' [' + items.children[i].tags + ']';
            } else {
                li.innerHTML += items.children[i].displayName;
            }
            buildTestsList(li, JSON.parse(JSON.stringify(items.children[i])));
            u.append(li);
        }
    }
}

let buildTagsList = function (parentElement, items) {
    if (typeof items !== 'undefined') {
        var u = document.createElement("ul");
        parentElement.append(u);
        for (var i = 0; i < items.tags.length; i++) {
            var li = document.createElement('li');
            li.innerHTML += items.tags[i];
            u.append(li);
        }
    }
}
var TestRunnerTreeModel = Backbone.Model.extend({
    initialize(
        models, {
            url
        }) {
        this.url = url;
    }

})

allure.api.addTranslation('en', {
    tab: {
        tests: {
            name: 'Test Runner'
        }
    }
});

var TestRunnerTreeView = Backbone.Marionette.View.extend({
    //template: template,

    events: {
        'click .dir': 'toggle',
        'change .floral': 'checkbox'
    },

    toggle: function (e) {
        e.stopPropagation();
        this.$(e.currentTarget).children('ul').slideToggle();
    },

    checkbox: function (e) {
        this.$(e.target).next('ul').find('input:checkbox').prop('checked', this.$(e.target).prop("checked"));

        for (var i = this.$(e.currentTarget).find('ul').length - 1; i >= 0; i--) {
            var tar = this.$(e.currentTarget).find('ul:eq(' + i + ')').prev('input:checkbox');
            this.$(e.currentTarget).find('ul:eq(' + i + ')').prev('input:checkbox').prop('checked', function () {
                return tar.next('ul').find('input:checkbox:not(:checked)').length === 0 ? true : false;
            });
        }

    },

    render: function () {
        let js = JSON.parse(JSON.stringify(this.options));

        var tags = document.createElement("div");
        this.$el.append(tags);
        var tagsHeading = document.createElement("h3");
        tagsHeading.innerHTML += 'Available Tags';
        tags.append(tagsHeading);
        var tagsDiv = document.createElement("div");
        tags.append(tagsDiv);
        var tests = document.createElement("div");
        this.$el.append(tests);
        var testHeading = document.createElement("h3");
        testHeading.innerHTML += 'Available Tests';
        tests.append(testHeading);
        var testsDiv = document.createElement("div");
        testsDiv.className = 'floral';
        testsDiv.style.overflow = 'scroll';
        testsDiv.style.height = '90vh';
        tests.append(testsDiv);

        buildTagsList(tagsDiv, js);
        buildTestsList(testsDiv, js.tests);

        return this;
    }

});

class TestRunnerTreeLayout extends allure.components.AppLayout {

    initialize({
        url
    }) {
        //alert('layout:init')
        super.initialize();
        this.tree = new TestRunnerTreeModel([], {
            url
        });
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
        const {
            url
        } = this.options;
        this.onRouteUpdate(url);
    }
    onRouteUpdate(url) {

    }
}

allure.api.addTab('tests', {
    title: 'tab.tests.name',
    icon: 'fa fa-list',
    route: 'tests',
    onEnter: (function () {
        //alert('addtab')
        return new TestRunnerTreeLayout({
            url: 'data/testDiscovery.json'
        });
    })
});