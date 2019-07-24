"use strict";

let buildTestsList = function (parentElement, items) {
  var i, li, inp, spn;
  if (typeof items.children !== "undefined") {
    var u = document.createElement("ul");
    u.style.listStyle = "none";
    // u.insertBefore()
    // var exspan = document.createElement("span");
    // exspan.innerHTML += "expanded";

    // var collspan = document.createElement("span");
    // collspan.innerHTML += "collapsed";

    // u.insertBefore(collspan, );
    parentElement.append(u);
    for (i = 0; i < items.children.length; i++) {
      li = document.createElement("li");
      inp = document.createElement("input");
      inp.type = "checkbox";
      inp.value = items.children[i].displayName;
      inp.className = "cbox";
      li.append(inp);
      spn = document.createElement("span");
      spn.className = "dir";
      //   li.className = "dir";
      spn.style.cursor = "pointer";
      li.style.marginTop = "10px";
      if (typeof items.children[i].tags !== "undefined") {
        spn.innerHTML +=
          "&nbsp;" +
          items.children[i].displayName +
          " [" +
          items.children[i].tags +
          "]";
      } else {
        spn.innerHTML += "&nbsp;" + items.children[i].displayName;
      }
      li.append(spn);
      buildTestsList(li, JSON.parse(JSON.stringify(items.children[i])));
      u.append(li);
    }
  }
};

let search = function (element, matchingTitle) {
  if (element.displayName == matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = search(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
}

let buildTagsList = function (parentElement, items) {
    if (typeof items !== 'undefined') {
        var u = document.createElement("ul");
        parentElement.append(u);
        for (var i = 0; i < items.tags.length; i++) {
            console.log(items.tags[i])
            var li = document.createElement('li');
            li.id = "tags_"+i
            var rowSpan = document.createElement('span')
            rowSpan.id = "tag_" + i
            var chk1 = document.createElement('input');
            var chk2 = document.createElement('input');
            chk1.type = 'checkbox';
            chk1.id = "tags_include_" + i;
            chk2.id = "tags_exclude_"+i;
            chk2.type = 'checkbox';
            rowSpan.innerHTML = items.tags[i].name

            //console.log(chk)
            li.append(chk1);
            li.append(chk2);
            li.append(rowSpan);
            //console.log(li.innerHTML)
            u.append(li);
        }
        console.log(u.innerHTML)
    }
}

var TestRunnerTreeModel = Backbone.Model.extend({
  initialize(models, {
    url
  }) {
    this.url = url;
  }
});

allure.api.addTranslation("en", {
  tab: {
    tests: {
      name: "Test Runner"
    }
  }
});

var TestRunnerTreeView = Backbone.Marionette.View.extend({
  //template: template,

  events: {
    "click .dir": "toggle",
    "change .floral": "checkbox",
    "click .btn": "displayOutput"
  },

  toggle: function (e) {
    e.stopPropagation();
    this.$(e.currentTarget.parentElement)
      .children("ul")
      .slideToggle();
  },

  displayOutput: function () {
    console.log(this.options.attributes);
  },

  checkbox: function (e) {
    this.$(e.target)
      .next().next("ul")
      .find("input:checkbox")
      .prop("checked", this.$(e.target).prop("checked"));

    for (var i = this.$(e.target).next().next("ul").length - 1; i >= 0; i--) {
      var targ = this.$(e.target).next().next("ul:eq(" + i + ")").find("input:checkbox");
      search(this.options.get('tests'), targ[0].value).state = e.target.checked;
    }

    for (var i = this.$(e.currentTarget).find("ul").length - 1; i >= 0; i--) {
      var tar = this.$(e.currentTarget).find("ul:eq(" + i + ")").prev().prev("input:checkbox");
      this.$(e.currentTarget).find("ul:eq(" + i + ")")
        .prev().prev("input:checkbox")
        .prop("checked", function () {
          return tar.next().next("ul").find("input:checkbox:not(:checked)").length ===
            0 ?
            true :
            false;
        });
    }
    search(this.options.get('tests'), e.target.value).state = e.target.checked;
    // console.log()
    // let target = this.options.attributes.tests.children.filter(x => {
    //   if (x.)
    // })
    // console.log(this.options.attributes)
  },

  render: function () {
    let js = JSON.parse(JSON.stringify(this.options));

    // this.$el.style.display = "flex";

    var output = document.createElement("button");
    output.className = "btn";
    output.innerHTML += "RunTests";
    output.style.marginTop = "3rem";
    var main = document.createElement("div");
    this.$el.append(output);
    main.style.display = "flex";
    this.$el.append(main);
    var tags = document.createElement("div");
    main.append(tags);
    tags.style.border = "1px solid";
    tags.style.margin = ".5rem";
    tags.style.padding = "1rem";
    tags.style.width = "33%";
    var tagsHeading = document.createElement("h3");
    tagsHeading.innerHTML += "Available Tags";
    tags.append(tagsHeading);
    var tagsDiv = document.createElement("div");
    tags.append(tagsDiv);
    var tests = document.createElement("div");
    tests.style.border = "1px solid";
    tests.style.margin = ".5rem";
    tests.style.padding = "1rem";
    tests.style.width = "67%";
    main.append(tests);
    var testHeading = document.createElement("h3");
    testHeading.innerHTML += "Available Tests";
    tests.append(testHeading);
    var testsDiv = document.createElement("div");
    testsDiv.className = "floral";
    testsDiv.style.overflow = "scroll";
    testsDiv.style.height = "90vh";
    tests.append(testsDiv);

    buildTagsList(tagsDiv, js);
    buildTestsList(testsDiv, js.tests);

    return this ;
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
    return new TestRunnerTreeView(this.tree);
  }

  onViewReady() {
    const {
      url
    } = this.options;
    this.onRouteUpdate(url);
  }
  onRouteUpdate(url) {}
}

allure.api.addTab("tests", {
  title: "tab.tests.name",
  icon: "fa fa-list",
  route: "tests",
  onEnter: function () {
    //alert('addtab')
    return new TestRunnerTreeLayout({
       url: 'data/plugindata.json'
    });
  }
});