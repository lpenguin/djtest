(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ﻿window.app = "#app";

  window.showedInstruction = false;

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
      this.findedWords = new Words;
      return this.started = false;
    };

    WordTaskView.prototype.events = {
      "click [name=add-button]": "addClick",
      "click [name=done-button]": "done",
      "click [name=start-button]": "start"
    };

    WordTaskView.prototype.render = function() {
      var r;
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      r = $(this.el).appendTo(app);
      if (!this.started) {
        $("[name=intruction]").show();
        $("[name=intro]").show();
      }
      return r;
    };

    WordTaskView.prototype.add = function(word) {
      var view;
      this.findedWords.add(word);
      view = new WordView({
        model: word
      });
      return this.$("[name=words-ul]").append(view.render().el);
    };

    WordTaskView.prototype.start = function() {
      this.started = true;
      $("[name=intruction]").hide();
      $("[name=intro]").hide();
      $("[name=main]").show();
      return testTimer.start();
    };

    WordTaskView.prototype.addClick = function() {
      var allText, l, m, r, range, text, word;
      allText = $("[name=text]").html();
      text = getSelectedText();
      range = $("[name=text]").getRangeAt();
      l = $("<span>" + allText.substr(0, range.startOffset) + "</span>");
      m = $("<span class='selected-word'>" + text + "</span>");
      r = $("<span>" + allText.substr(range.endOffset) + "</span>");
      word = new Word({
        word: text
      });
      this.add(word);
      return false;
    };

    WordTaskView.prototype.done1 = function() {
      return this.model.set({
        result: {
          findedWords: this.findedWords.toJSON()
        }
      });
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

    ChoiceTaskView.prototype.events = {
      "click [name=start-button]": "start"
    };

    ChoiceTaskView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      $(this.el).appendTo(app);
      if (this.showInstruction && !window.showedInstruction) {
        this.$("[name=main]").hide();
        this.$("[name=intro]").show();
        window.showedInstruction = true;
      } else {
        this.$("[name=main]").show();
        this.$("[name=intro]").hide();
      }
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
      var _this = this;
      return this.model.choices.each(function(choice) {
        return _this.add(choice);
      });
    };

    ChoiceTaskView.prototype.choiceSelected = function(choice) {
      this.model.set({
        result: {
          choice: choice.toJSON()
        }
      });
      return router.nextTask();
    };

    ChoiceTaskView.prototype.start = function() {
      testTimer.start();
      this.$("[name=main]").show();
      this.$("[name=intro]").hide();
      return $("[name=intruction]").hide();
    };

    ChoiceTaskView.prototype.done = function() {
      this.model.set({
        result: {
          choice: new Choice()
        }
      });
      router.nextTask();
      return false;
    };

    return ChoiceTaskView;

  })();

  window.SpeedTaskView = (function() {

    __extends(SpeedTaskView, Backbone.View);

    function SpeedTaskView() {
      SpeedTaskView.__super__.constructor.apply(this, arguments);
    }

    SpeedTaskView.prototype.initialize = function() {
      this.template = $('#speed-task-template').html();
      this.table_template = $('#speed-task-table-template').html();
      this.clicks = 0;
      this.step = 1;
      return this.result = {};
    };

    SpeedTaskView.prototype.events = {
      "click [name=start-button]": "start"
    };

    SpeedTaskView.prototype.render = function() {
      $(app).empty();
      $(this.el).html(_.template(this.template, {
        task: this.model
      }));
      $(this.el).appendTo(app);
      this.$('[name=step]').text(this.step);
      if (this.showInstruction && !window.showedInstruction) {
        this.$("[name=main]").hide();
        this.$("[name=intro]").show();
        window.showedInstruction = true;
      } else {
        this.$("[name=main]").show();
        this.$("[name=intro]").hide();
      }
      return this.drawStartButton();
    };

    SpeedTaskView.prototype.drawStartButton = function() {
      var button, input, self, span,
        _this = this;
      this.$('[name=table]').empty();
      span = $('<span>Предполагаемое количество нажатий</span>');
      input = $('<input type=text></input>');
      button = $('<button>Начать</button>');
      self = this;
      button.click(function() {
        var name;
        name = 'clicks_d' + _this.step;
        _this.result[name] = input.val();
        return _this.nextStep();
      });
      this.$('[name=table]').append(span);
      this.$('[name=table]').append(input);
      this.$('[name=table]').append($('<br/>'));
      return this.$('[name=table]').append(button);
    };

    SpeedTaskView.prototype.nextStep = function() {
      var speedtimer, time,
        _this = this;
      if (this.step <= 4) {
        this.$('[name=step]').text(this.step);
        this.drawTable();
        this.$('[name=table]').empty();
        this.drawTable();
        time = this.model.get('time' + this.step);
        speedtimer = new TimerView(time, function() {
          var name;
          if (_this.step >= 4) {
            _this.done();
            return false;
          }
          name = 'clicks' + _this.step;
          _this.result[name] = _this.clicks;
          _this.clicks = 0;
          _this.$('[name=clicks]').text(0);
          _this.drawStartButton();
          return _this.step++;
        });
        speedtimer.render();
        $(speedtimer.el).hide();
        return speedtimer.start();
      } else {
        return this.done;
      }
    };

    SpeedTaskView.prototype.incClicks = function() {
      this.clicks++;
      return this.$('[name=clicks]').text(this.clicks);
    };

    SpeedTaskView.prototype.drawTable = function() {
      var button, h, self, table, td, tr, w, _ref, _ref2;
      table = $('<table>');
      for (h = 1, _ref = this.model.get('width'); 1 <= _ref ? h <= _ref : h >= _ref; 1 <= _ref ? h++ : h--) {
        tr = $('<tr>');
        for (w = 1, _ref2 = this.model.get('height'); 1 <= _ref2 ? w <= _ref2 : w >= _ref2; 1 <= _ref2 ? w++ : w--) {
          td = $('<td>');
          button = $('<button>X</button>');
          self = this;
          button.click(function() {
            self.incClicks();
            return $(this).attr("disabled", true);
          });
          td.append(button);
          tr.append(td);
        }
        table.append(tr);
      }
      return this.$('[name=table]').append(table);
    };

    SpeedTaskView.prototype.choiceSelected = function(choice) {
      this.model.set({
        result: {
          choice: choice.toJSON()
        }
      });
      return router.nextTask();
    };

    SpeedTaskView.prototype.start = function() {
      testTimer.start();
      this.$("[name=main]").show();
      this.$("[name=intro]").hide();
      return $("[name=intruction]").hide();
    };

    SpeedTaskView.prototype.done = function() {
      this.model.set({
        result: this.result
      });
      router.nextTask();
      return false;
    };

    return SpeedTaskView;

  })();

  window.TimerView = (function() {

    __extends(TimerView, Backbone.View);

    function TimerView() {
      TimerView.__super__.constructor.apply(this, arguments);
    }

    TimerView.prototype.initialize = function(seconds, func) {
      this.template = $('#timer-template').html();
      this.seconds = seconds;
      return this.endFunc = func;
    };

    TimerView.prototype.render = function() {
      var app, res;
      app = "#timer";
      $(app).empty();
      $(this.el).html(_.template(this.template, {}));
      res = $(this.el).appendTo(app);
      this.$("#time").text(this.formatTime(this.seconds));
      return res;
    };

    TimerView.prototype.start = function() {
      var _this = this;
      return this.timerId = setInterval(function() {
        if (_this.seconds < 0) {
          _this.stop();
          _this.endFunc();
          return;
        }
        _this.$("#time").text(_this.formatTime(_this.seconds));
        return _this.seconds = _this.seconds - 1;
      }, 1000);
    };

    TimerView.prototype.stop = function() {
      return clearInterval(this.timerId);
    };

    TimerView.prototype.formatTime = function(seconds) {
      var date;
      date = new Date(seconds * 1000);
      return date.format("MM:ss");
      return String(seconds);
    };

    return TimerView;

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

    TestRouter.prototype.timerComplete = function() {
      return this.complete();
    };

    TestRouter.prototype.start = function() {
      var _this = this;
      if (test.time) {
        window.testTimer = new TimerView(test.time, function() {
          view1.done();
          return testTimer.remove();
        });
        testTimer.render();
      }
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
      var info, task,
        _this = this;
      task = test.tasks.find(function(task) {
        return task.cid === taskid;
      });
      info = TaskByType[task.get('type')];
      window.view1 = new info.view({
        model: task
      });
      view1.showInstruction = test.time;
      return view1.render();
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

  TaskByType[TaskType.SPEED] = {
    name: gettext("Speed task"),
    model: SpeedTask,
    view: SpeedTaskView
  };

}).call(this);
