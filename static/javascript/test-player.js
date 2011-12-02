(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.app = "#app";

  window.WordTaskView = (function() {

    __extends(WordTaskView, Backbone.View);

    function WordTaskView() {
      WordTaskView.__super__.constructor.apply(this, arguments);
    }

    WordTaskView.prototype.initialize = function() {
      return this.template = $('#word-task-template').html();
    };

    WordTaskView.prototype.events = {
      "click [name=add-button]": "addClick"
    };

    WordTaskView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      return $(this.el).appendTo(app);
    };

    WordTaskView.prototype.addClick = function() {
      return false;
    };

    return WordTaskView;

  })();

  window.ChoiceView = (function() {

    __extends(ChoiceView, Backbone.View);

    function ChoiceView() {
      ChoiceView.__super__.constructor.apply(this, arguments);
    }

    ChoiceView.prototype.initialize = function() {
      return this.template = $('#choice-template').html();
    };

    ChoiceView.prototype.events = {
      "click": "click"
    };

    ChoiceView.prototype.render = function() {
      $(this.el).html(_.template(this.template, {
        choice: this.model
      }));
      return this;
    };

    ChoiceView.prototype.click = function() {
      return false;
    };

    return ChoiceView;

  })();

  window.ChoiceTaskView = (function() {

    __extends(ChoiceTaskView, Backbone.View);

    function ChoiceTaskView() {
      ChoiceTaskView.__super__.constructor.apply(this, arguments);
    }

    ChoiceTaskView.prototype.initialize = function() {
      return this.template = $('#choice-task-template').html();
    };

    ChoiceTaskView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      $(this.el).appendTo(app);
      return this.addAll(this.model.choices);
    };

    ChoiceTaskView.prototype.add = function(choice) {
      var view;
      view = new ChoiceView({
        model: choice
      });
      return this.$("[name=choices-ul]").append(view.render().el);
    };

    ChoiceTaskView.prototype.addAll = function() {
      var _this = this;
      return this.model.choices.each(function(choice) {
        return _this.add(choice);
      });
    };

    return ChoiceTaskView;

  })();

  window.TestView = (function() {

    __extends(TestView, Backbone.View);

    function TestView() {
      TestView.__super__.constructor.apply(this, arguments);
    }

    TestView.prototype.initialize = function() {
      return this.template = $('#test-template').html();
    };

    TestView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        test: this.model
      }));
      return $(this.el).appendTo(app);
    };

    return TestView;

  })();

  window.TestRouter = (function() {

    __extends(TestRouter, Backbone.Router);

    function TestRouter() {
      TestRouter.__super__.constructor.apply(this, arguments);
    }

    TestRouter.prototype.routes = {
      "": "showTest",
      "tasks/:taskid": "showTask"
    };

    TestRouter.prototype.showTest = function() {
      var view;
      view = new TestView({
        model: test
      });
      return view.render();
    };

    TestRouter.prototype.showTask = function(taskid) {
      var info, task, view;
      var _this = this;
      task = test.tasks.find(function(task) {
        return task.cid === taskid;
      });
      info = TaskByType[task.get('type')];
      view = new info.view({
        model: task
      });
      return view.render();
    };

    TestRouter.prototype.nextTask = function() {
      return null;
    };

    return TestRouter;

  })();

  window.router = new TestRouter();

  window.TaskByType = new Object();

  TaskByType[TaskType.CHOICE] = {
    name: gettext("Choice task"),
    model: ChoiceTask,
    view: ChoiceTaskView
  };

  TaskByType[TaskType.WORD] = {
    name: gettext("Word task"),
    model: WordTask,
    view: WordTaskView
  };

}).call(this);
