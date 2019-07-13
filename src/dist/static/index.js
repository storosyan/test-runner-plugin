'use strict';

// let getTestCases = function (ti, ind) {
//     var html = "";
//     var label = ti.displayName;
//     // var type = ti.type;


//     // if (typeof type === 'package') {
//     //     html = '<ul><li><input type="checkbox" class="familybox cbox"/>' + label;
//     // }



//     html = '<p>' + ind + '<input type="checkbox"/> ' + label + '</p>';
//     var children = ti.children;
//     if (typeof children !== 'undefined') {
//         var i;
//         for (i = 0; i < children.length; i++) {
//             console.log(JSON.parse(JSON.stringify(children[i])));
//             html += getTestCases(JSON.parse(JSON.stringify(children[i])), ind + "&nbsp;&nbsp;") + '\n';
//         }
//     }
//     return html;
// }

let buildList = function (parentElement, items) {
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
            li.innerHTML += items.children[i].displayName;
            buildList(li, JSON.parse(JSON.stringify(items.children[i])));
            u.append(li);
        }
    }
}



$(document).ready(function () {
    $.extend($.expr[':'], {
        unchecked: function (obj) {
            return ((obj.type == 'checkbox' || obj.type == 'radio') && !$(obj).is(':checked'));
        }
    });

    $(".floral input:checkbox").live('change', function () {
        $(this).next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));

        for (var i = $('.floral').find('ul').length - 1; i >= 0; i--) {
            $('.floral').find('ul:eq(' + i + ')').prev('input:checkbox').prop('checked', function () {
                return $(this).next('ul').find('input:unchecked').length === 0 ? true : false;
            });
        }
    });

    $('.dir').live('click', function (e) {
        e.stopPropagation();
        $(this).children('ul').slideToggle();
    });

});

let getTags = function (data) {
    let html = "";
    return html;
}
var TestRunnerTreeModel = Backbone.Model.extend({
    initialize(
        models, {
            url
        }) {
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
        // let content =
        //     '<h3>Available Tags</h3><div>' +
        //     getTags(js) + '</div>' +
        //     '<h3>Available Tests</h3><div style="overflow: auto; max-height: 100vh;" id="pageContent"> '
        // // getTestCases(js, "") + '</fieldset>';
        // this.$el.html(content + '</div>');

        // var tags = document.createElement('<h3 />');
        // tags.innerText += 'Available Tags';

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



        buildList(testsDiv, js);

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