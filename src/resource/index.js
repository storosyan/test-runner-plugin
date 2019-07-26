'use strict';

class TestTags extends Backbone.Collection {
    initialize(tags) {
        this.tags = tags;
    }
};

class TestTagView extends Backbone.Marionette.View {
    initialize(tag) {
        this.tagTemplate = "<div class='text-row'>" +
        "<span class='include'><input type='checkbox' name='include'></span>" +
        "<span class='exclude'><input type='checkbox' name='exclude'>" +
        "</span><span><%=name%></span></div>";
        this.tag = tag;
        this.render();
    }
    render() {
        //this.$el.html(this.template(this.tag.toJSON()));
        let content = TemplateParser(this.tagTemplate, this.tag);
        this.$el.html(content);
        return this;
    }
}

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
        this.listenTo(this, 'change:includeTag', this.includeTag());
        this.render();
    }

    includeTag() {
        //alert('include tag')
    }

    excludeTag() {
        //alert('exclude tag')
    }

    render() {
        var str = "";
        this.tags.each(function(item){
            var tagView = new TestTagView(item.toJSON());
            str += tagView.el.innerHTML;
        });
        this.tagContent = str;
        let content = TemplateParser(this.tagsTemplate, this);
        this.$el.html(content);
        return this;
    }
}

class TestRunnerView extends Backbone.Marionette.View {
    initialize(model) {
        this.model = model;
        this.gridTemplate =
            "<div class='grid'>" +
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
                "</div>" +
            "</div>";
    }

    render() {
        this.tagsView = new TestTagsView(this.model.tags).el.innerHTML;
        //let testsView = new TestTagsView(this.tags);
        this.execView = new TestExecutorView(this.model.executor).el.innerHTML;
        this.testsView = new TestTestsView(this.model).el.innerHTML;
        let gridView = TemplateParser(this.gridTemplate, this)
        this.$el.html(gridView);
        return this;
    }

    onRender() {
        //alert("onrender")
    }

};

class TestExecutorView extends Backbone.Marionette.View {
    initialize(exec) {
        this.title = 'Test Executor';
        this.onceHostLabel = 'OENC host';
        this.testCount = 'Total number of selected Tests cases';
        this.runButtonCaption = 'Run Tests';
        this.exec = new TestExecutor(exec);

        this.execTemplate =
            "<div class='row'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='panel'><span class='text-row'><%=onceHostLabel%><input type='text' name='' value=''/></span></div>" +
            "<div class='panel'><span class='text-row'><%=testCount%></span><span>100</span></div>" +
            "<div class='panel'><span class='text-row'><button type='button' name='button'><%=runButtonCaption%></button></span></div>" +
            "</div>";
        this.listenTo(this, 'change:button', this.buttonClicked());
        this.render()
    }

    buttonClicked() {
        //alert('button Clicked')
    }

    render() {
        //this.$el.html(this.template(this.tag.toJSON()));
        let execContent = TemplateParser(this.execTemplate, this)
        this.$el.html(execContent);
        return this;
    }
}
/*
class TestNodeView extends Backbone.Marionette.View {
    initialize(test) {
        this.node = new TestLeafView();
        this.testsTemplate = "<ul class='tree_node'>" +
            "<%=node%>" +
            "</ul>";
    }

    render(test) {
        let item = this.node.render(test).el.innerHTML;
        let content = TemplateParser(this.testsTemplate, {node:item})
        this.$el.html(content);
        return this;
    }

}
*/
class TestLeafView extends Backbone.Marionette.View {
    initialize() {
        this.testsTemplate = "<li class='dir tree_leaf'>" +
            "<input type='checkbox' class='cbox'>" +
            "<%=displayName%>" +
            "</li>"
    }
    render(test) {
        let content = TemplateParser(this.testsTemplate, test)
        this.$el.html(content);
        return this;
    }
}

class TestTestsView extends Backbone.Marionette.View {
    initialize(model) {
        //this.node = new TestNodeView();
        this.leaf = new TestLeafView();
        this.title = 'Available Tests';
        this.tests = model.tests;
        this.allTests = model.allTests;
        this.testsTemplate =
            "<div class='panel'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='tree'><%=content%></div></div>";
        this.render()
    }

    render() {
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
        return this;
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

    parse(data) {
        //this.tests = JSON.parse(JSON.stringify(data["tests"]));
        this.tests = data["tests"];
        this.allTests = []
        this.getFlattenTestResults(this.tests, this.allTests, "root");
        this.tags = new TestTags(data["tags"]);
        this.executor = new TestExecutor(data["executor"]);
    }

    getFirstTest() {
        if (this.allTests.length > 0 ) {
            return this.allTests[0];
        }
    }

    getLastTest() {
        if (this.allTests.length > 0 ) {
            return this.allTests[this.allTests.length - 1];
        }
    }

    getNextTest(testResultUid) {
        const index = this.allTests.findIndex(testResult => testResult.uid === testResultUid);
        if (index < this.allTests.length - 1) {
            return this.allTests[index + 1];
        }
    }

    getPreviousTest(testResultUid) {
        const index = this.allTests.findIndex(testResult => testResult.uid === testResultUid);
        if (index > 0) {
            return this.allTests[index - 1];
        }
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
        //alert('onviewready')
        const {
            url
        } = this.options;
        this.onRouteUpdate(url);
    }
    onRouteUpdate(url) {

    }
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
