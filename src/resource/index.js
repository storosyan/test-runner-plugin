'use strict';

class TestTag extends Backbone.Model {
    initialize(tag) {
        this.name = tag.name;
        this.state = tag.state;
    }
};

class TestTags extends Backbone.Collection {
    initialize(tags) {
        //alert('tags-collection')
        //alert(tags)
        //tags.forEach(function(item, index) {
        //    alert(item)
        //    tag = new TestTag(item)
        //    this.add(tag)
        //});
        this.tags = tags;
    }

    parse(response) {
        alert('parse')
    }
};

class TestCase extends Backbone.Model {
    initialize({testCase}) {
        this.className = testCase.get('className'),
        this.displayName = testCase.get('displayName'),
        this.methodName = testCase.get('methodName'),
        this.state = "",
        this.tags = testCase.get('tags')
    }
};

class TestClass extends Backbone.Model {
    initialize({testClass}) {
        this.className = testCase.get('className'),
        this.displayName = testCase.get('displayName'),
        this.state = "",
        this.testCases = testClass.get('children'),
        this.tags = testCase.get('tags')
    }
};

class TestCases extends Backbone.Collection {
    initialize({testCases}) {
        this.testCases = testCases;
    }
};

class TestClasses extends Backbone.Collection {
    initialize({testClasses}) {
        this.testClasses = testClasses;
    }
};

class TestPackages extends Backbone.Collection {
    initialize({testPackages}) {
        this.testPackages = testPackages;
    }
};

class TestPackage extends Backbone.Model {
    initialize({testPackage}) {
        this.displayName = testPackage.get('displayName'),
        this.state = "",
        this.testClasses = testPackage.get('children')
    }
};

class Tests extends Backbone.Model {
    initialize({test}) {
        this.displayName = testPackage.get('displayName'),
        this.state = "",
        this.testClasses = testPackage.get('children')
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
        this.tagsTemplate = "<div class='left-col'>" +
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
        let data = JSON.parse(JSON.stringify(model))
        this.tests = data.tests;
        this.tags = new TestTags(data.tags);
        this.executor = new TestExecutor(data.executor);
        this.gridTemplate = "<div class='grid'><%=grid%></div>";
    }
    testCase(ti, ind) {
        var html = "";
        var label = ti.displayName;
        html = '<p>' + ind + label + '</p>';
        var children = ti.children;
        if (typeof children !== 'undefined') {
            var i;
            for (i = 0; i < children.length; i++) {
                html += this.testCase(JSON.parse(JSON.stringify(children[i])), ind + "  ") + '\n';
            }
        }
        return html;
    }

    render() {
        let tagsView = new TestTagsView(this.tags);
        //let testsView = new TestTagsView(this.tags);
        let execView = new TestExecutorView(this.executor);
        let content = execView.el.innerHTML + tagsView.el.innerHTML;
        let gridView = TemplateParser(this.gridTemplate, {grid:content})
        //this.$el.append(gridView);
        this.$el.html(gridView);
        return this;
    }

};

class TestExecutorView extends Backbone.Marionette.View {
    initialize(exec) {
        this.title = 'Test Executor';
        this.onceHostLabel = 'OENC host';
        this.testCount = 'Total number of selected Tests cases';
        this.runButtonCaption = 'Run Tests';
        this.exec = new TestExecutor(exec);
        /*
        this.template =  _.template($(
        */
        //this.template =  TemplateCompiler(

        this.execTemplate =
            "<div class='panel'><div class='row'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='panel'><span class='text-row'><%=onceHostLabel%><input type='text' name='' value=''/></span></div>" +
            "<div class='panel'><span class='text-row'><%=testCount%></span><span>100</span></div>" +
            "<div class='panel'><span class='text-row'><button type='button' name='button'><%=runButtonCaption%></button></span></div>" +
            "</div></div>";
        this.render()
    }

    render() {
        //this.$el.html(this.template(this.tag.toJSON()));
        let execContent = TemplateParser(this.execTemplate, this)
        this.$el.html(execContent);
        return this;
    }
}

class TestTestsView extends Backbone.Marionette.View {
    initialize(test) {
        this.title = 'Available Tests';
        this.exec = new TestExecutor(exec);
        this.testsTemplate =
            "<div class='right-col'>" +
            "<div class='title'><h2><%=title%></h2></div>" +
            "<div class='tree'><%=content%></div></div>";

        this.render()
    }

    render() {
        //this.$el.html(this.template(this.tag.toJSON()));
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


class TestRunnerModel extends Backbone.Model {
    initialize(models, {url}) {
        this.url = url;
    }
};

class TestRunnerLayout extends allure.components.AppLayout {

    initialize({url}) {
        super.initialize();
        this.model = new TestRunnerModel([], {
            url
        });
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
