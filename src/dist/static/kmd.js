"use strict";

var svgNS = "http://www.w3.org/2000/svg";
var MDGutterView = Backbone.Marionette.View.extend({
    className: "gutter gutter-horizontal",
    style: "width: 7px;",
    initialize: function(model) {
      this.model = model;
  },
  render: function() {
    //this.$el.html(this.leftTemplate);
    return this;
  }
});

var MDRightSideView = Backbone.Marionette.View.extend({
    className: "side-by-side__right kafka-half-panel",
    //style: "width: calc(50% - 3.5px);",
    initialize: function(model) {
      this.model = model;
      this.rightTemplate =
        "<div>" +
        "<div id='empty-view-id' class='empty-view'>" +
        "<p class='empty-view-message'>No item selected</p>" +
        "</div>" +
        "<div id='depgraph' style='display:none'>" +
        "<svg id='depsvg' width='90%' height='60%'></svg>" +
        "</div>" +
        "</div>";
    },
    attributes: function() {
        return {
            'width': 'calc(50% - 3.5px)'
        };
    },
    render: function() {
      this.$el.append(this.rightTemplate);
      return this;
    }
});

var MDTestCaseView = Backbone.Marionette.View.extend({
    className : "tree_node",
    tagName : "ul",
    //id : "gensvg",
    initialize: function(model, cls, mth) {
      //this.model = model;
      this.name = model.name;
      this.cls = cls;
      this.mth = mth;
    },
    render: function() {
        //this.$el.append(this.model.name);
        this.$el.append("<li class='tree_leaf' id='gensvg' cls=" + this.cls + " mth=" + this.mth + ">" + this.name);
        this.$el.append("</li>");
        return this;
    }
});

function showTooltip(box) {
    const tt = document.getElementById('tooltip');
    console.log('show', tt.style.visibility)
    tt.style.visibility = 'visible';
}
function hideTooltip(box) {
    const tt = document.getElementById('tooltip');
    console.log('hide', tt.style.visibility)
    tt.style.visibility = 'hidden';
}

var MDTestsView = Backbone.Marionette.View.extend({
    className : "tree_node",
    tagName : "ui",
    initialize: function(model) {
      this.model = model.classes;

    },
    render: function() {
        for (var i = 0; i < this.model.length; i++) {
            this.$el.append("<li class='tree_node' id='nogensvg'>> " + this.model[i].class);
            for (var j = 0; j < this.model[i].methods.length; j++) {
                const testCaseView = new MDTestCaseView(this.model[i].methods[j], i, j);
                testCaseView.render();
                this.$el.append(testCaseView.$el);
            }
            this.$el.append("</li>");
        }
        return this;
    }
});

var MDLeftSideView = Backbone.Marionette.View.extend({
    className : "side-by-side__left kafka-half-panel",
    style : "width: calc(50% - 3.5px);",
    initialize: function(model) {

        this.levelident = 100;
        this.colors = {
            "vz-sdn.orchestrator" : "#ed7000",
            "vz-sdn.controller" : "#8000ff",
            "vz-sdn.ems" : "#0088ce",
            "vz-sdn.rms" : "#ffbc3d",
            "vz-sdn.bgp" : "#00ac3e",
            "bg" : "#f5f5f5"

        };
        this.dnShift = 0;
        this.headerHeight = 50;
        this.firstRow = this.headerHeight + 5;
        this.firstBoxRow = this.firstRow + 5;
        this.firstLabelRow = this.firstBoxRow + 6;
        this.firstTspanRow = this.firstLabelRow + 11;
        this.tspanHeight = 14;
        this.secondTspanRow = this.firstTspanRow + this.tspanHeight;
        this.firstRowShift = 0;
        this.firstBoxRowShift = this.firstRowShift + 10;
        this.firstLabelRowShift = this.firstBoxRowShift + 5;
        this.rowHeight = 50;
        this.boxHeight = 40;
        this.arrowIndent = 35;
        this.arrowHeadIndent = 10;
        this.cornerRadius = 5;
        this.data = model.data;
        this.model = model.data.classes[0].methods[0].method[0];
        this.leftTemplateStart =
            "<div>" +
            "<div class='pane__title pane__title_borderless'>" +
            "<span class='pane__title-text'>Kafka Tests</span>" +
            "</div>";
        this.leftTemplateEnd = "</div>";
    },
    splitTopicName: function(topic) {
        var n = topic.indexOf(".", 7);
        var l1text = topic.substring(0, n);
        var l2text = topic.substring(n + 1);
        return [l1text, l2text];
    },
    createBox: function(row, node, id) {
        var grid = document.createElementNS(svgNS, 'rect');
        var bgColor = 'white';
        if (row % 2 == 1) {
            bgColor = this.colors.bg;
        }

        grid.setAttributeNS(null, 'x', this.firstRowShift);
        grid.setAttributeNS(null, 'y', this.dnShift + this.firstRow + row * this.rowHeight);
        grid.setAttributeNS(null, 'width', 800);
        grid.setAttributeNS(null, 'height', this.rowHeight);
        grid.setAttributeNS(null, 'fill', bgColor);
        this.svg.appendChild(grid);
        var topic = node.label.substring(0, node.label.indexOf(".", 7));
        var label = this.createText(row, this.splitTopicName(node.label), node.level);
        this.svg.appendChild(label);
        var width = label.getBBox().width + 2 * this.cornerRadius;
        this.svg.removeChild(label)
        var rect = document.createElementNS(svgNS, 'rect');
        const boxX = this.firstBoxRowShift + node.level * this.levelident;
        const boxY = this.dnShift + this.firstBoxRow + row * this.rowHeight;
        rect.setAttributeNS(null, 'x', boxX);
        rect.setAttributeNS(null, 'y', boxY);
        rect.setAttributeNS(null, 'width', width);
        rect.setAttributeNS(null, 'height', this.boxHeight);
        rect.setAttributeNS(null, 'rx', this.cornerRadius);
        rect.setAttributeNS(null, 'ry', this.cornerRadius);
        rect.setAttributeNS(null, 'fill', this.colors.bg);
        rect.setAttributeNS(null, 'stroke', this.colors[topic]);
        rect.setAttributeNS(null, 'stroke-width', 2);
        rect.id = id;
        this.svg.appendChild(rect);
        this.svg.appendChild(label);
        //this.initTooltip(node.conditions, node.returns, boxX, boxY, id);
        //this.initTooltip(node.conditions, node.returns, boxX, boxY, id);
        return rect;
    },
    createText: function(row, lines, level) {
        var text = document.createElementNS(svgNS, 'text');
        text.setAttributeNS(null, 'x', this.firstLabelRowShift + level * this.levelident);
        text.setAttributeNS(null, 'y', this.dnShift + this.firstLabelRow + row * this.rowHeight);
        text.setAttributeNS(null, 'fill', 'black');
        var th = this.dnShift + this.firstTspanRow + row * this.rowHeight;
        for(var i in lines) {
            var tspan = document.createElementNS(svgNS, 'tspan');
            tspan.setAttributeNS(null, 'fill', 'black');
            tspan.setAttributeNS(null, 'x', this.firstLabelRowShift + level * this.levelident);
            tspan.setAttributeNS(null, 'y', th);
            tspan.innerHTML = lines[i];
            text.appendChild(tspan)
            th = th + this.tspanHeight;
        }
        return text;
    },
    createHeader: function(lines) {
        var text = document.createElementNS(svgNS, 'text');
        text.setAttributeNS(null, 'x', this.firstLabelRowShift);
        text.setAttributeNS(null, 'y', this.dnShift + this.firstLabelRow);
        text.setAttributeNS(null, 'fill', 'gray');
        //text.setAttributeNS(null, 'font-size', '25');  //font-size="100"
        var th = this.firstTspanRow;
        var tspan = document.createElementNS(svgNS, 'tspan');
        tspan.setAttributeNS(null, 'fill', 'black');
        tspan.setAttributeNS(null, 'font-size', '25');  //font-size="100"
        tspan.setAttributeNS(null, 'x', this.firstLabelRowShift);
        tspan.setAttributeNS(null, 'y', this.dnShift + 25);
        tspan.innerHTML = lines[0];
        text.appendChild(tspan)
        tspan = document.createElementNS(svgNS, 'tspan');
        tspan.setAttributeNS(null, 'x', this.firstLabelRowShift);
        tspan.setAttributeNS(null, 'y', this.dnShift + 45);
        tspan.innerHTML = lines[1];
        text.appendChild(tspan)
        return text;
    },
    link: function(box1, r1, box2, r2) {
        //console.log(box1.id, r1, box2.id, r2)
        var x1 = this.arrowIndent + box2.level * this.levelident
        var x2 = this.arrowHeadIndent + box1.level * this.levelident
        var y1 = this.dnShift + this.headerHeight + this.rowHeight + r2 * this.rowHeight;
        var y2 = this.dnShift + this.headerHeight + 30 + r1 * this.rowHeight;
        var lh = y2 - y1 - this.cornerRadius;
        var ll =  x2 - x1 - this.cornerRadius;
        var mPath = 'M ' + x1 + ' ' + y1 + ' v ' + lh + ' a ' + this.cornerRadius + ' ' + this.cornerRadius +
            ' 0 0 0 ' + this.cornerRadius + ' ' + this.cornerRadius + ' h ' + ll + ' m -' + this.cornerRadius + ' -' + this.cornerRadius +
            ' l ' + this.cornerRadius + ' ' + this.cornerRadius + ' l -' + this.cornerRadius + ' ' + this.cornerRadius;
        const path = document.createElementNS(svgNS, 'path');
        path.setAttributeNS(null, 'd', mPath);
        path.setAttributeNS(null, 'stroke', 'black');
        path.setAttributeNS(null, 'fill', 'none');
        this.svg.appendChild(path);
        return path;
    },
    cleanSvg: function(element) {
        var child = element.firstElementChild;
        while (child) {
            element.removeChild(child);
            child = element.firstElementChild;
        }
    },
    getTooltipEntry: function(ul, label, items) {
        var li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML = label;
        var uli = document.createElement('ul');
        ul.appendChild(uli);
        for (var i = 0; i < items.length; i++) {
            li = document.createElement('li');
            li.innerHTML = items[i];
            uli.appendChild(li);
        }
    },
    initTooltip: function(filters, returns, boxX, boxY, elId) {
        //const ttHeight = 150;
        const ttR = 10;
        const ttY = boxY + this.boxHeight;
        const ttX = boxX + 15;
        const ttWidth = Math.min(800 - ttX, 400);
        var g = document.createElementNS(svgNS, 'g');
        g.setAttributeNS(null, 'visibility', 'hidden');
        const fo = document.createElementNS(svgNS, 'foreignObject');
        fo.setAttributeNS(null, 'x', ttX);
        fo.setAttributeNS(null, 'y', ttY + ttR);
        fo.setAttributeNS(null, 'width', ttWidth);
        var ul = document.createElement('ul');
        //ul.setAttribute("list-style", "none");
        ul.style = "list-style:none;"
        console.log(filters, returns)
        if (filters) {
            this.getTooltipEntry(ul, "Filters:", filters);
        }
        if (returns) {
            this.getTooltipEntry(ul, "Returns:", returns);
        }
        fo.appendChild(ul);
        g.appendChild(fo);
        const set = document.createElementNS(svgNS, 'set');
        set.setAttributeNS(null, 'attributeName', 'visibility');
        set.setAttributeNS(null, 'from', 'hidden');
        set.setAttributeNS(null, 'to', 'visible');
        set.setAttributeNS(null, 'begin', elId + '.mouseover');
        set.setAttributeNS(null, 'end', elId + '.mouseout');
        g.appendChild(set);
        this.svg.appendChild(g);
        const ph = ul.clientHeight + 20;
        const ttHeight = ph;
        fo.setAttributeNS(null, 'height', ph);
        g.removeChild(fo);
        var path = document.createElementNS(svgNS, 'path');
        path.setAttributeNS(null, 'd',
            'M' + ttX + ',' + ttY +
            ' v' + ttHeight + 'a' + ttR + ',' + ttR + ' 0 0 0 ' + ttR + ',' + ttR +
            ' h' + (ttWidth - 2 * ttR) + 'a' + ttR + ',' + ttR + ' 0 0 0 ' + ttR + ',-' + ttR +
            ' v-' + (ttHeight - 2 * ttR) + 'a' + ttR + ',' + ttR + ' 0 0 0 -' + ttR + ',-' + ttR +
            ' h-' + (ttWidth - 2 * ttR) + 'a' + ttR + ',' + ttR + ' 0 0 1 -' + ttR + ',-' + ttR);
        path.setAttributeNS(null, 'stroke', 'green');
        path.setAttributeNS(null, 'fill', '#fcfbac');
        g.appendChild(path);
        g.appendChild(fo);
    },
    createSvg: function(data, c, m) {
        this.cleanSvg(this.svg);
        const deps = data.classes[c].methods[m].method;
        this.dnShift = 0;
        var dnShifts = [];
        for (var dn = 0; dn < deps.length; dn++) {
            dnShifts.push(this.dnShift);
            var header = this.createHeader([deps[dn].name, "Message dependenices"]);
            this.svg.appendChild(header);
            const path = document.createElementNS(svgNS, 'path');
            path.setAttributeNS(null, 'd', 'M0,' + (this.dnShift + this.headerHeight) + ' h800');
            path.setAttributeNS(null, 'stroke', '#ddd');
            path.setAttributeNS(null, 'fill', 'none');
            this.svg.appendChild(path);
            var nodemap = [];
            const messages = deps[dn].dependencies;
            for (var i = 0; i < messages.length; i++) {
                this.createBox(i, messages[i], "expMes_" + dn + "_" + i);
                nodemap.push(messages[i]);
                if (messages[i].parents) {
                    for (var l in messages[i].parents) {
                        const id = messages[i].parents[l];
                        var j = this.getIndex(nodemap, id);
                        if (j >= 0) {
                            this.link(messages[i], i, nodemap[j], j);
                        }
                    }
                }
            }
            this.dnShift = this.svg.getBBox().height;
        }
        for (var dn = 0; dn < deps.length; dn++) {
            const messages = deps[dn].dependencies;
            for (var i = 0; i < messages.length; i++) {
                const boxX = this.firstBoxRowShift + messages[i].level * this.levelident;
                const boxY = dnShifts[dn] + this.firstBoxRow + i * this.rowHeight;
                this.initTooltip(messages[i].conditions, messages[i].returns,
                    boxX, boxY, "expMes_" + dn + "_" + i);
            }
        }
        this.svg.setAttribute("width", this.svg.getBBox().width);
        this.svg.setAttribute("height", this.svg.getBBox().height);
    },
    getIndex: function(nodemap, id) {
        var i = 0;
        for(i = 0; i < nodemap.length; i++) {
            if (nodemap[i].id === id) {
                return i;
            }
        }
        return -1;
    },
    events: {
        "click #gensvg": "generateSvg",
        "click #nogensvg": "hidesvg"
    },
    unHighlight: function() {
        if (this.lastHighlightedEl) {
            this.lastHighlightedEl.style.backgroundColor = "white";
            delete this.lastHighlightedEl;
        }
    },
    highlightElement: function(e) {
        this.unHighlight();
        this.lastHighlightedEl = e;
        e.style.backgroundColor = "#FDFF47";
    },
    generateSvg: function(e) {
        this.svg = document.getElementById('depsvg');
        document.getElementById('depgraph').style.display = "block";
        document.getElementById('empty-view-id').style.display = "none";
        this.highlightElement(e.target)
        const c = parseInt(e.target.getAttribute('cls'));
        const m = parseInt(e.target.getAttribute('mth'));
        this.createSvg(this.data, c, m)
    },
    hidesvg: function() {
        document.getElementById('depgraph').style.display = "none";
        document.getElementById('empty-view-id').style.display = "block";
        this.unHighlight();
    },
    render: function() {
      this.$el.append(this.leftTemplateStart);
      const testsView = new MDTestsView(this.data);
      testsView.render();
      this.$el.append(testsView.$el);
      this.$el.append(this.leftTemplateEnd);
      return this;
    }
});

var MDView = Backbone.Marionette.View.extend({
    className: "side-by-side",
    style: "width: 100%;",
    initialize: function(model) {
      this.model = model;
    },

    render: function() {
      const leftView = new MDLeftSideView(this.model);
      leftView.render();
      const gutterView = new MDGutterView(this.model);
      gutterView.render();
      const rightView = new MDRightSideView(this.model);
      rightView.render();
      this.$el.append(leftView.$el)
      this.$el.append(gutterView.$el)
      this.$el.append(rightView.$el)
      return this;
    }
});

class MDModel extends Backbone.Model {
  initialize(models, { url }) {
    this.url = url;
  }
  parse(data) {
    this.data = data;
  }
}

class MDLayout extends allure.components.AppLayout {
  initialize({ url }) {
    super.initialize();
    this.model = new MDModel([], { url });
  }

  loadData() {
    return this.model.fetch();
  }

  getContentView() {
    return new MDView(this.model);
  }
  onViewReady() {
    const { url } = this.options;
    this.onRouteUpdate(url);
  }
  onRouteUpdate(url) {}
}

allure.api.addTranslation("en", {
  tab: {
    kafka: {
      dependencies: "Dependencies"
    }
  }
});

allure.api.addTab("kafka", {
  title: "tab.kafka.dependencies",
  icon: "fa fa-list",
  route: "kafka",
  onEnter: function() {
    return new MDLayout({
      url: "data/kafka.json"
    });
  }
});
