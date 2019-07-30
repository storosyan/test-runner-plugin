'use strict';

class TestTags extends Backbone.Collection {
    initialize(tags) {
        this.tags = tags;
    }
};

class TestTagView extends Backbone.Marionette.View {
    initialize(tag) {
        this.tagTemplate = "<div class='text-row'>" +
        "<span class='include'><input type='checkbox' name='include' class='cbox'></span>" +
        "<span class='exclude'><input type='checkbox' name='exclude' class='cbox'>" +
        "</span><span><%=name%></span></div>";
        this.tag = tag;
        this.listenTo(this.$el, 'click: .cbox', this.onClickCbox);
        this.render();
    }

    onClickCbox() {
        alert('tinclude tag clicked')
    }

    render() {
        //this.$el.html(this.template(this.tag.toJSON()));
        let content = TemplateParser(this.tagTemplate, this.tag);
        this.$el.html(content);
        return this;
    }
}

var TestTagViewVar = Backbone.Marionette.View.extend({
    //template: _.template("<div></div>"),
    initialize: function() {
        this.tagTemplate = "<div class='text-row'>" +
        "<span class='include'><input type='checkbox' name='include' class='cbox'></span>" +
        "<span class='exclude'><input type='checkbox' name='exclude' class='cbox'>" +
        "</span><span><%=name%></span></div>";
//        this.tag = tag;
//        this.render();
    },
    events: {
      "click .dir": "toggle",
      "change .floral": "checkbox",
      "click .btn": "displayOutput",
      "change .tgBoxInclude": "includetagsToggle",
      "change .tgBoxExclude": "excludetagsToggle"
    },
    includetagsToggle: function(e) {
        alert('includetagsToggle')
    },
    excludetagsToggle: function(e) {
        alert('excludetagsToggle')
    },
    toggle: function (e) {
        alert('toggle')
    },
    displayOutput: function (e) {
        alert('displayOutput')
    },
    checkbox: function (e) {
        alert('checkbox')
    },

    render: function (tag) {
        //this.$el.html(this.template(this.tag.toJSON()));
        let content = TemplateParser(this.tagTemplate, tag);
        this.$el.html(content);
        return this;
    }
});

class TestTagsView extends Backbone.Marionette.View {

    initialize(tags) {
        this.title = "Tags";
        this.tagName = "Tag Name";
        this.tags = tags;
        this.tagsTemplate = "<div class='panel'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='text-row'>" +
            "<span class='include'>√</span>" +
            "<span class='exclude'>x</span>" +
            "<span><%=tagName%></span>" +
            "</div><%=tagContent%></div>";
        this.render();
    }

    render() {
        var str = "";
        var tagView = new TestTagViewVar();
        this.tags.each(function(item){
            //var tagView = new TestTagView(item.toJSON());
            //var tagView = new TestTagViewVar();
            str += tagView.render(item.toJSON()).el.innerHTML;
        });
        this.tagContent = str;
        let content = TemplateParser(this.tagsTemplate, this);
        this.$el.html(content);
        return this;
    }
}

var TestRunnerView = Backbone.Marionette.View.extend ({
    className: "grid",
    initialize: function(model) {
        this.model = model;
        this.gridTemplate =
            "<div class='panel'>" +
                "<%=execView%>" +
            "</div>" +
            "<div class='panel'>" +
                "<div class='left-col'>" +
                    "<%=tagsView%>" +
                "</div>" +
                "<div class='right-col'>" +
                    "<%=testsView%>" +
                "</div>" +
            "</div>";
    },

    events: {
        //'click .execute-button': 'buttonClicked',
        "submit #test-run-form": "runTests",
        'click .tree': 'treeClicked',
        'click .include': 'include',
        'click .exclude': 'exclude',
    },

    include: function(e) {
        let exclude = e.currentTarget.parentElement.children[1].children[0].checked;
        if (exclude) {
            e.currentTarget.parentElement.children[1].children[0].checked = false;
        }
    },

    exclude: function(e) {
        let include = e.currentTarget.parentElement.children[1].children[0].checked;
        if (include) {
            e.currentTarget.parentElement.children[0].children[0].checked = false;
        }
    },

    runTests: function(e) {
        alert('runner:runTests Clicked')
    },

    buttonClicked: function(e) {
        alert('runner:button Clicked')
    },

    treeClicked: function(e) {
        alert('runner:tree Clicked')
    },

    render: function() {
        this.tagsView = new TestTagsView(this.model.tags).el.innerHTML;
        this.execView = new TestExecutorView(this.model.executor).el.innerHTML;
        this.testsView = new TestTestsView(this.model).el.innerHTML;
        let gridView = TemplateParser(this.gridTemplate, this)
        this.$el.html(gridView);
        return this;
    }
});

var TestExecutorView = Backbone.Marionette.View.extend({
    //tagName: "form",
    //id: "test-run-form",
    //className: "run-form",
    initialize: function(exec) {
        this.title = 'Test Executor';
        this.onceHostLabel = 'OENC host';
        this.testCountLabel = 'Total number of selected Tests cases';
        this.cleanLabel = 'Clean existing reports before generating a new one';
        this.testCount = 100;
        this.runButtonCaption = 'Run Tests';
        this.exec = new TestExecutor(exec);
        this.execTemplate =
            "<form id='test-run-form' class='run-form'><div class='row test-executor'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='panel'><label class='text-row host' for='host_text'><%=onceHostLabel%></label>" +
            "<input class='host-input' type='text' name='' id='host_text' value=''/></div>" +
            "<div class='panel'><label class='text-row text-label' for='id_clean'><%=cleanLabel%></label>" +
            "<input type='checkbox' name='clean' id='id_clean' class='clbox'></div>" +
            "<div class='panel'><label class='text-row text-label'><%=testCountLabel%></label><label><%=testCount%></label></div>" +
            "<div class='panel'><span class='text-row'><button class='execute-button' id='run'><%=runButtonCaption%></button></span></div>" +
            "</div></form>";
        this.render();
    },

    render: function() {
        //this.$el.html(this.template(this.tag.toJSON()));
        let execContent = TemplateParser(this.execTemplate, this)
        this.$el.html(execContent);
        //let dom = DOMTemplateParser(execContent);
        //this.$el.add(dom);
        return this;
    }
});

class TestNodeView extends Backbone.Marionette.View {
    initialize() {
        this.leaf = new TestLeafView();
        this.testsTemplate =
        "<li class='dir tree_leaf'>" +
            "<input type='checkbox' class='cbox'>" +
            "<%=displayName%>" +
            "<ul class='tree_node'>" +
                "<%=node%>" +
            "</ul>" +
        "</li>";
    }

    render(test) {
        var content = "";
        if (test.type === "testcase") {
            content += this.leaf.render(test).el.innerHTML;
        } else {
            if (test.children) {
                var children = "";
                for(var i in test.children) {
                    children += this.render(test.children[i]).el.innerHTML;
                }
            }
            content += TemplateParser(this.testsTemplate, {displayName:test.displayName, node:children})
        }
        this.$el.html(content);
        //let dom = DOMTemplateParser(content);
        //this.$el.add(dom);
        return this;
    }

}

class TestLeafView extends Backbone.Marionette.View {
    initialize() {
        //this.template = this._.template("<div class='abcd'></div>");
        this.testsTemplate = "<li class='dir tree_leaf'>" +
            "<input type='checkbox' class='cbox'>" +
            "<%=displayName%>" +
            "</li>"
    }
    render(test) {
        let content = TemplateParser(this.testsTemplate, test)
        this.$el.html(content);
        //let dom = DOMTemplateParser(content);
        //this.$el.add(dom);
        return this;
    }
}

class TestTestsView extends Backbone.Marionette.View {
    initialize(model) {
        this.node = new TestNodeView();
        this.leaf = new TestLeafView();
        this.title = 'Available Tests';
        this.tests = model.tests;
        this.allTests = model.allTests;
        this.testsTemplate =
            "<div class='panel'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='tree'><ul class='tree_node'><%=content%></ul></div></div>";
        this.render()
    }

    renderFlat() {
        this.content = "";
        let newNode = true;
        let firstNode = true;
        for (var i in this.allTests) {
            if (this.allTests[i].type === "testcase") {
                if (newNode) {
                    this.content += "<ul class='tree_node'>";
                    newNode = false;
                }
                this.content += this.leaf.render(this.allTests[i]).el.innerHTML
                firstNode = false;
            } else {
                if (!firstNode) {
                    this.content += "</ul>";
                }
                this.content += "<ul class='tree_node'>";
                if (!newNode) {
                    this.content += "</ul>";
                }
                newNode = true;
                this.content += this.leaf.render(this.allTests[i]).el.innerHTML
            }
        }
        let execContent = TemplateParser(this.testsTemplate, this)
        this.$el.html(execContent);
        //let dom = DOMTemplateParser(execContent);
        //this.$el.add(dom);
        return this;

    }

    renderTree() {
        this.content = this.node.render(this.tests).el.innerHTML;
        let execContent = TemplateParser(this.testsTemplate, this)
        //let dom = DOMTemplateParser(execContent);
        //this.$el.add(dom);//DOMTemplateParser
        this.$el.html(execContent);
        return this;
    }

    render() {
        //return this.renderFlat();
        return this.renderTree();
    }
}


class TestExecutor extends Backbone.Model {
    initialize(executor) {
        this.oenchost = executor.oenchost;

    }
};


class AvailableTest extends Backbone.Model {
    initialize({item, id}) {
        this.displayName = item['displayName'];
        this.id = id + "." + this.displayName;
        this.state = "";
        this.type = item['type'];
        this.tags = item['tags'];
        if (item['className']) {
            this.className = item['className']
        };
        if (item['methodName']) {
            this.methodName = item['methodName']
        };
    }
}

class TestRunnerModel extends Backbone.Model {
    initialize(models, {url}) {
        this.url = url;
    }
    /*
    getFlattenTestResults(item, list, id) {
        var newTest = new AvailableTest({item:item, id:id});
        list.push(newTest);

        if (item.children) {
            var i;
            for (i in item.children) {
                this.getFlattenTestResults(item.children[i], list, newTest['id']);
            }
        }
    }
*/
    parse(data) {
        this.tests = data["tests"];
        //this.allTests = []
        //this.getFlattenTestResults(this.tests, this.allTests, "root");
        this.tags = new TestTags(data["tags"]);
        this.executor = new TestExecutor(data["executor"]);
    }

}


class TestRunnerLayout extends allure.components.AppLayout {
    initialize({url}) {
        super.initialize();
        this.model = new TestRunnerModel([], {url});
    }


    loadData() {
        return this.model.fetch();
    }

    getContentView() {
        return new TestRunnerView(this.model)
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
