(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.app = "#app";
  window.WordView = (function() {
    __extends(WordView, Backbone.View);
    function WordView() {
      WordView.__super__.constructor.apply(this, arguments);
    }
    WordView.prototype.initialize = function() {
      return this.template = $('#word-template').html();
    };
    WordView.prototype.tagName = "tr";
    WordView.prototype.events = {
      "click [name=delete-button]": "delete"
    };
    WordView.prototype.render = function() {
      $(this.el).html(_.template(this.template, {
        word: this.model
      }));
      return this;
    };
    WordView.prototype["delete"] = function() {
      this.model.destroy();
      $(this.el).remove();
      return false;
    };
    return WordView;
  })();
  window.WordTaskView = (function() {
    __extends(WordTaskView, Backbone.View);
    function WordTaskView() {
      WordTaskView.__super__.constructor.apply(this, arguments);
    }
    WordTaskView.prototype.initialize = function() {
      this.template = $('#word-task-template').html();
      return this.findedWords = new Words;
    };
    WordTaskView.prototype.events = {
      "click [name=add-button]": "addClick",
      "click [name=done-button]": "done"
    };
    WordTaskView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      return $(this.el).appendTo(app);
    };
    WordTaskView.prototype.add = function(word) {
      var view;
      this.findedWords.add(word);
      view = new WordView({
        model: word
      });
      return this.$("[name=words-ul]").append(view.render().el);
    };
    WordTaskView.prototype.addClick = function() {
      var text, word;
      text = this.$("[name=text]").getSelection().text;
      word = new Word({
        word: text
      });
      this.add(word);
      return false;
    };
    WordTaskView.prototype.done = function() {
      this.model.set({
        result: {
          findedWords: this.findedWords.toJSON()
        }
      });
      router.nextTask();
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
      this.template = $('#choice-template').html();
      return _.extend(this, Backbone.Events);
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
      this.trigger('selected', this.model);
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
      this.$("[name=choices-ul]").append(view.render().el);
      return view.bind('selected', this.choiceSelected, this);
    };
    ChoiceTaskView.prototype.addAll = function() {
      return this.model.choices.each(__bind(function(choice) {
        return this.add(choice);
      }, this));
    };
    ChoiceTaskView.prototype.choiceSelected = function(choice) {
      this.model.set({
        result: {
          choice: choice.toJSON()
        }
      });
      return router.nextTask();
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
    TestView.prototype.sendResults = function() {
      this.$("[name=data]").val(JSON.stringify(test.makeJSON()));
      return this.$("form").submit();
    };
    return TestView;
  })();
  window.SendResultsView = (function() {
    __extends(SendResultsView, Backbone.View);
    function SendResultsView() {
      SendResultsView.__super__.constructor.apply(this, arguments);
    }
    SendResultsView.prototype.initialize = function() {
      return this.template = $('#send-template').html();
    };
    SendResultsView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        test: this.model
      }));
      return $(this.el).appendTo(app);
    };
    SendResultsView.prototype.sendResults = function() {
      this.$("[name=data]").val(JSON.stringify(test.makeJSON()));
      return this.$("form").submit();
    };
    return SendResultsView;
  })();
  window.TestRouter = (function() {
    __extends(TestRouter, Backbone.Router);
    function TestRouter() {
      TestRouter.__super__.constructor.apply(this, arguments);
    }
    TestRouter.prototype.routes = {
      "": "start",
      "secret": "showTest",
      "send": "sendResults",
      "tasks/:taskid": "showTask",
      "complete": "complete"
    };
    TestRouter.prototype.start = function() {
      return this.showTask(activeTask.cid);
    };
    TestRouter.prototype.sendResults = function() {
      var view;
      if (this.completeTest) {
        view = new SendResultsView();
        view.render();
        view.sendResults();
        return false;
      }
    };
    TestRouter.prototype.showTest = function() {
      var view;
      view = new TestView({
        model: test
      });
      view.render();
      return view.sendResults();
    };
    TestRouter.prototype.showTask = function(taskid) {
      var info, task, view;
      task = test.tasks.find(__bind(function(task) {
        return task.cid === taskid;
      }, this));
      info = TaskByType[task.get('type')];
      view = new info.view({
        model: task
      });
      return view.render();
    };
    TestRouter.prototype.nextTask = function() {
      var activeTask;
      activeTaskIndex++;
      if (activeTaskIndex < test.tasks.size()) {
        activeTask = test.tasks.at(activeTaskIndex);
        return this.navigate("#tasks/" + activeTask.cid, true);
      } else {
        return this.complete();
      }
    };
    TestRouter.prototype.complete = function() {
      this.completeTest = true;
      return this.navigate("send", true);
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
