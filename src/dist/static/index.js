"use strict";

class TestTags extends Backbone.Collection {
  initialize(tags) {
    this.tags = tags;
  }
}

class TestTagView extends Backbone.Marionette.View {
  initialize(tag) {
    this.tagTemplate =
      "<div class='text-row'>" +
      "<span class='include'><input type='checkbox' name='include' class='cbox'></span>" +
      "<span class='exclude'><input type='checkbox' name='exclude' class='cbox'>" +
      "</span><span><%=name%></span></div>";
    this.tag = tag;
    this.listenTo(this.$el, "click: .cbox", this.onClickCbox);
    this.render();
  }

  render() {
    //this.$el.html(this.template(this.tag.toJSON()));
    let content = TemplateParser(this.tagTemplate, this.tag);
    this.$el.html(content);
    return this;
  }
}

var TestTagViewVar = Backbone.Marionette.View.extend({
  initialize: function() {
    this.tagTemplate =
      "<div class='text-row'>" +
      "<span class='include'><input type='checkbox' name='include' class='cbox'></span>" +
      "<span class='exclude'><input type='checkbox' name='exclude' class='cbox'>" +
      "</span><span><%=name%></span></div>";
  },

  render: function(tag) {
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
    this.tagsTemplate =
      "<div class='panel'>" +
      "<div class='title'><h2><%=title%></h2></div>" +
      "<div class='text-row'>" +
      "<span class='include'>√</span>" +
      "<span class='exclude exclude-icon'>x</span>" +
      "<span><%=tagName%></span>" +
      "</div><%=tagContent%></div>";
    this.render();
  }

  render() {
    var str = "";
    var tagView = new TestTagViewVar();
    this.tags.each(function(item) {
      str += tagView.render(item.toJSON()).el.innerHTML;
    });
    this.tagContent = str;
    let content = TemplateParser(this.tagsTemplate, this);
    this.$el.html(content);
    return this;
  }
}
var excludeArr = [];
var includeArr = [];
var totalSelectedCounts = 0;
var hostUrl = "http://10.100.16.76";
var cleanFlag = false;

var TestRunnerView = Backbone.Marionette.View.extend({
  className: "grid",
  initialize: function(model) {
    this.model = model;
    this.gridTemplate =
      "<div class='panel'><%=execView%></div>" +
      "<div class='panel'>" +
      "<div class='left-col'><%=tagsView%></div>" +
      "<div class='right-col'><%=testsView%></div>" +
      "</div>";
  },

  events: {
    //'click .execute-button': 'buttonClicked',
    //"submit #test-run-form": "runTests",
    "click #run": "runTests",
    "click .dispName": "treeClicked",
    "change .tree": "checked",
    "click .include": "include",
    "click .exclude": "exclude",
    "change .host-input": "hostUrl",
    "change #id_clean": "cleanFlag"
  },

  hostUrl: function(e) {
    hostUrl = e.currentTarget.value.trim();
  },

  cleanFlag: function(e) {
    cleanFlag = e.currentTarget.checked;
  },

  setTagState: function({ tagName: name, state: state }) {
    this.model.tags.each(function(item) {
      if (item.get("name") === name) {
        item.set("state", state);
      }
    });
  },

  switchTagState: function(clicked, pair) {
    if (pair.checked) {
      pair.checked = false;
      clicked.checked = true;
    }
  },

  highlightTest: function(chkStatus, selectedBox, ar1, ar2, flag) {
    if (chkStatus) {
      ar1.push(selectedBox);
      if (ar2.indexOf(selectedBox) >= 0) {
        for (var i = 0; i < ar2.length; i++) {
          if (ar2[i] === selectedBox) {
            ar2.splice(i, 1);
          }
        }
      }
    } else {
      for (var i = 0; i < ar1.length; i++) {
        if (ar1[i] === selectedBox) {
          ar1.splice(i, 1);
        }
      }
    }
    let allTestTags = this.el.getElementsByClassName("tags");
    for (let i = 0; i < allTestTags.length; i++) {
      let tmTag = allTestTags[i].innerText.trim();
      tmTag = tmTag.substring(1, tmTag.length - 1);
      let mthdTags = tmTag.split(",");
      if (flag) {
        let intersected = mthdTags.filter(value => ar2.includes(value));
        if (mthdTags.indexOf(selectedBox) >= 0) {
          if (chkStatus && intersected.length < 1) {
            allTestTags[i].parentElement.children[1].setAttribute(
              "style",
              "color: #fff; background-color: #97cc64;"
            );
            //allTestTags[i].parentElement.setAttribute("style", "background-color: green;")
            totalSelectedCounts += 1;
          } else if (chkStatus === false && intersected.length < 1) {
            allTestTags[i].parentElement.children[1].setAttribute(
              "style",
              "color: #000; background-color: none;"
            );
            if (totalSelectedCounts <= 1) {
              totalSelectedCounts = 0;
            } else {
              totalSelectedCounts += -1;
            }
          }
        }
      } else {
        let intersectedIn = mthdTags.filter(value => ar2.includes(value));
        let intersectedEx = mthdTags.filter(value => ar1.includes(value));
        if (mthdTags.indexOf(selectedBox) >= 0) {
          if (chkStatus) {
            allTestTags[i].parentElement.children[1].setAttribute(
              "style",
              "color: #fff; background-color: red;"
            );
            if (intersectedIn.length > 0 && intersectedEx.length > 0) {
              if (totalSelectedCounts <= 1) {
                totalSelectedCounts = 0;
              } else {
                totalSelectedCounts += -1;
              }
            } else if (includeArr.length === 0 && excludeArr.length > 0) {
              totalSelectedCounts = 0;
            }
          } else if (chkStatus === false && intersectedIn.length > 0) {
            allTestTags[i].parentElement.children[1].setAttribute(
              "style",
              "color: #fff; background-color: #97cc64;"
            );
            totalSelectedCounts += +1;
          } else {
            allTestTags[i].parentElement.children[1].setAttribute(
              "style",
              "color: #000; background-color: none;"
            );
            if (intersectedIn.length >= 0 && intersectedEx.length > 0) {
              if (totalSelectedCounts <= 1) {
                totalSelectedCounts = 0;
              } else {
                totalSelectedCounts += -1;
              }
            }
          }
        }
      }
    }
    this.el.getElementsByClassName(
      "selectedTestsCount"
    )[0].innerText = totalSelectedCounts;
  },

  include: function(e) {
    this.switchTagState(
      e.currentTarget.children[0],
      e.currentTarget.parentElement.children[1].children[0]
    );
    if (e.target.checked) {
      this.setTagState({
        tagName: e.currentTarget.parentElement.children[2].innerText.trim(),
        state: "include"
      });
    } else {
      this.setTagState({
        tagName: e.currentTarget.parentElement.children[2].innerText.trim(),
        state: false
      });
    }

    this.highlightTest(
      e.currentTarget.children[0].checked,
      e.currentTarget.parentElement.children[2].innerText.trim(),
      includeArr,
      excludeArr,
      true
    );
  },

  exclude: function(e) {
    this.switchTagState(
      e.currentTarget.children[0],
      e.currentTarget.parentElement.children[0].children[0]
    );
    if (e.target.checked) {
      this.setTagState({
        tagName: e.currentTarget.parentElement.children[2].innerText.trim(),
        state: "exclude"
      });
    } else {
      this.setTagState({
        tagName: e.currentTarget.parentElement.children[2].innerText.trim(),
        state: false
      });
    }
    this.highlightTest(
      e.currentTarget.children[0].checked,
      e.currentTarget.parentElement.children[2].innerText.trim(),
      excludeArr,
      includeArr,
      false
    );
  },

  runTests: function(e) {
    var output = JSON.parse(
      JSON.stringify({
        tests: { packages: [], classes: [], methods: [] }
      })
    );
    if (
      typeof this.options.tests.state != "undefined" &&
      this.options.tests.state === true
    ) {
      output.tests.packages.push(this.options.tests.displayName);
    } else {
      this.buildJson(this.options.tests, output.tests);
    }
    var url = hostUrl.trim() || "";
    if (!url.startsWith("http")) {
      alert("Invalid OENC host. Must start with http(s).");
    } else {
      var blob = new Blob(
        [
          JSON.stringify({
            exec: { host: url, clean: cleanFlag },
            tags: this.options.tags,
            tests: output
          })
        ],
        {
          type: "application/octet-stream"
        }
      );
      /* suggested structure foe tests component of the resulting json
    {test: {packages: ["pckg1", "pckg2", ...]},
           {classes: ["cls1", "cls2", ...]},
           {methods: ["meth1", "meth2", ...]}
       }
    */
      var url = URL.createObjectURL(blob);
      //alert(url)
      var link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "TestRunner.json");
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        true,
        window,
        1,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      link.dispatchEvent(event);
    }
  },

  buildJson: function(modelobj, jsonobj) {
    for (var j in modelobj.children) {
      if (
        typeof modelobj.children[j].state != "undefined" &&
        modelobj.children[j].state === true
      ) {
        if (modelobj.children[j].type == "package") {
          jsonobj.packages.push(modelobj.children[j].displayName);
        } else if (modelobj.children[j].type == "class") {
          jsonobj.classes.push(modelobj.children[j].displayName);
        } else {
          jsonobj.methods.push(modelobj.children[j].displayName);
        }
      } else {
        this.buildJson(modelobj.children[j], jsonobj);
      }
    }
    return jsonobj;
  },

  treeClicked: function(e) {
    e.stopPropagation();
    this.$(e.target.parentElement)
      .children("ul")
      .slideToggle();
  },

  checked: function(e) {
    this.$(e.target)
      .next()
      .next()
      .next("ul")
      .find("input:checkbox")
      .prop("checked", this.$(e.target).prop("checked"));
    let selected = this.search(
      this.options.tests,
      e.target.nextSibling.textContent
    );
    if (selected) {
      selected.state = e.target.checked;
    }
    for (
      var i =
        this.$(e.target)
          .next()
          .next()
          .next("ul")
          .find("input:checkbox").length - 1;
      i >= 0;
      i--
    ) {
      var targ = this.$(e.target)
        .next()
        .next()
        .next("ul")
        .find("input:checkbox")[i];
      let selected = this.search(
        this.options.tests,
        targ.nextSibling.textContent
      );
      if (selected) {
        selected.state = e.target.checked;
      }
    }
  },

  search: function(element, matchingTitle) {
    if (element.displayName == matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result == null && i < element.children.length; i++) {
        result = this.search(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  },

  render: function() {
    this.tagsView = new TestTagsView(this.model.tags).el.innerHTML;
    this.execView = new TestExecutorView(this.model.executor).el.innerHTML;
    this.testsView = new TestTestsView(this.model).el.innerHTML;
    let gridView = TemplateParser(this.gridTemplate, this);
    this.$el.html(gridView);
    return this;
  }
});

var TestExecutorView = Backbone.Marionette.View.extend({
  //tagName: "form",
  //id: "test-run-form",
  //className: "run-form",
  initialize: function(exec) {
    this.title = "Test Executor";
    this.onceHostLabel = "OENC host";
    this.testCountLabel = "Total number of selected Tests cases";
    this.cleanLabel = "Clean existing reports before generating a new one";
    this.testCount = totalSelectedCounts;
    this.runButtonCaption = "Run Tests";
    this.exec = new TestExecutor(exec);
    this.execTemplate =
      //"<form id='test-run-form' class='run-form'>" +
      "<div class='row test-executor'>" +
      "<div class='title'><h2><%=title%></h2></div>" +
      "<div class='panel'><label class='text-row host' for='host_text'><%=onceHostLabel%></label>" +
      "<input class='host-input' type='text' name='' id='host_text' value=''/></div>" +
      "<div class='panel'><label class='text-row text-label' for='id_clean'><%=cleanLabel%></label>" +
      "<input type='checkbox' name='clean' id='id_clean' class='clbox'></div>" +
      "<div class='panel'><label class='text-row text-label'><%=testCountLabel%></label><label class='selectedTestsCount'><%=testCount%></label></div>" +
      "<div class='panel'><span class='text-row'><button class='execute-button' id='run'><%=runButtonCaption%></button></span></div>" +
      "</div>";
    //+ "</form>"
    this.render();
  },

  render: function() {
    let execContent = TemplateParser(this.execTemplate, this);
    this.$el.html(execContent);
    return this;
  }
});

class TestNodeView extends Backbone.Marionette.View {
  initialize() {
    this.leaf = new TestLeafView();
    this.testsTemplate =
      "<ul class='tree_node'>" +
      "<li class='dir tree_leaf'>" +
      "<input type='checkbox' class='cbox'>" +
      "<span class='dispName  eachElem'><%=displayName%></span>" +
      "<span class='tags label label-info'>[<%=tags%>]</span>" +
      "<ul class='tree_node'>" +
      "<%=node%>" +
      "</ul>" +
      "</li>" +
      "</ul>";
  }

  render(test) {
    var content = "";
    if (test.type === "testcase") {
      content += this.leaf.render(test).el.innerHTML;
    } else {
      if (test.children) {
        var children = "";
        for (var i in test.children) {
          children += this.render(test.children[i]).el.innerHTML;
        }
      }
      content += TemplateParser(this.testsTemplate, {
        displayName: test.displayName,
        node: children
      });
    }
    this.$el.html(content);
    return this;
  }
}

class TestLeafView extends Backbone.Marionette.View {
  initialize() {
    this.testsTemplate =
      "<li class='dir tree_leaf'>" + // tags=<%=alltags%>
      "<input type='checkbox' class='cbox'>" +
      "<span class='dispName  eachElem'><%=displayName%></span>" +
      "<span class='tags label label-info'>[<%=tags%>]</span>" +
      "</li>";
  }
  render(test) {
    let content = TemplateParser(this.testsTemplate, test);
    this.$el.html(content);
    return this;
  }
}

class TestTestsView extends Backbone.Marionette.View {
  initialize(model) {
    this.node = new TestNodeView();
    this.leaf = new TestLeafView();
    this.title = "Available Tests";
    this.tests = model.tests;
    //this.allTests = model.allTests;
    this.testsTemplate =
      "<div class='panel'>" +
      "<div class='title'><h2><%=title%></h2></div>" +
      "<div class='tree'><%=content%></div></div>";
    //"<div class='tree'><ul class='tree_node'><%=content%></ul></div></div>";
    this.render();
  }

  render() {
    this.content = this.node.render(this.tests).el.innerHTML;
    let execContent = TemplateParser(this.testsTemplate, this);
    this.$el.html(execContent);
    return this;
  }
}

class TestExecutor extends Backbone.Model {
  initialize(executor) {
    this.oenchost = executor.oenchost;
  }
}

class AvailableTest extends Backbone.Model {
  initialize({ item, id }) {
    this.displayName = item["displayName"];
    this.id = id + "." + this.displayName;
    this.state = "";
    this.type = item["type"];
    this.tags = item["tags"];
    if (item["className"]) {
      this.className = item["className"];
    }
    if (item["methodName"]) {
      this.methodName = item["methodName"];
    }
  }
}

class TestRunnerModel extends Backbone.Model {
  initialize(models, { url }) {
    this.url = url;
  }
  parse(data) {
    this.tests = data["tests"];
    this.tags = new TestTags(data["tags"]);
    this.executor = new TestExecutor(data["executor"]);
  }
}

class TestRunnerLayout extends allure.components.AppLayout {
  initialize({ url }) {
    super.initialize();
    this.model = new TestRunnerModel([], { url });
  }

  loadData() {
    return this.model.fetch();
  }

  getContentView() {
    return new TestRunnerView(this.model);
  }
  onViewReady() {
    const { url } = this.options;
    this.onRouteUpdate(url);
  }
  onRouteUpdate(url) {}
}
var DOMTemplateParser = function(html) {
  return new DOMParser().parseFromString(html, "text/html");
};
var TemplateParser = function(template, model) {
  let response = "";
  let n = 0;
  let m = template.indexOf("<%=", n);
  while ((m = template.indexOf("<%=", n)) >= 0) {
    response += template.substring(n, m);
    n = m + 3;
    m = template.indexOf("%>", n);
    let key = template.substring(n, m);
    if (model[key]) {
      response += model[key];
    }
    n = m + 2;
  }
  if (n > 0 && n < template.length) {
    response += template.substring(n);
  }
  return response;
};

allure.api.addTranslation("en", {
  tab: {
    tests: {
      name: "Test Runner"
    }
  }
});

allure.api.addTab("tests", {
  title: "tab.tests.name",
  icon: "fa fa-list",
  route: "tests",
  onEnter: function() {
    return new TestRunnerLayout({
      url: "data/testDiscoverynew.json"
    });
  }
});
