'use strict';

class TestExecutor extends Backbone.Model {
    initialize(executor) {
        this.oenchost = executor.oenchost;
    }
};

class TestTag extends Backbone.Model {
    initialize(tag) {
        this.name = tag.name;
        this.state = tag.state;
    }
};

class TestTags extends Backbone.Collection {
    initialize(tags}) {
        this.tags = tags;
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

class TestRunnerView extends Backbone.Marionette.View {
    initialize(model) {
        let data = JSON.parse(JSON.stringify(model))
        this.tests = data.tests;
        this.tags = new TestTags(data.tags);
        this.executor = new TestExecutor(data.executor);
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
        let content = '<h3>Tests</h3>' + this.testCase(this.tests, "");
        this.$el.html(content);
        return this;
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
        const {
            url
        } = this.options;
        this.onRouteUpdate(url);
    }
    onRouteUpdate(url) {

    }
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
