(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.gettext = function(text) {
    if (text === "Choice task") "Выбор из пунктов";
    if (text === "Word task") "Поиск слов";
    return text;
  };

  window.getSelected = function() {
    if (window.getSelection) {
      return window.getSelection();
    } else if (document.selection) {
      document.selection.createRange().text;
      return "";
    }
  };

  window.TaskType = {
    Undef: 0,
    CHOICE: 1,
    WORD: 2
  };

  Backbone.sync = function(method, model, success, error) {
    return success.success(model);
  };

  window.Scale = (function() {

    __extends(Scale, Backbone.Model);

    function Scale() {
      Scale.__super__.constructor.apply(this, arguments);
    }

    Scale.prototype.defaults = {
      name: "",
      description: "",
      id: null,
      value: 0
    };

    return Scale;

  })();

  window.Scales = (function() {

    __extends(Scales, Backbone.Collection);

    function Scales() {
      Scales.__super__.constructor.apply(this, arguments);
    }

    Scales.prototype.model = Scale;

    Scales.prototype.findById = function(id) {
      return this.find(function(scale) {
        return scale.get('id').toString() === id.toString();
      });
    };

    Scales.prototype.findByName = function(name) {
      return this.find(function(scale) {
        return scale.get("name") === name;
      });
    };

    return Scales;

  })();

  window.Choice = (function() {

    __extends(Choice, RefModel);

    function Choice() {
      Choice.__super__.constructor.apply(this, arguments);
    }

    Choice.prototype.refCollection = {
      field: "scales",
      collection: Scales
    };

    Choice.prototype.initialize = function() {
      var res, scale;
      Choice.__super__.initialize.apply(this, arguments);
      scale = this.get('scale');
      if (scale != null) {
        res = this.makeScale(scale);
        res.set({
          value: this.get('value')
        });
        this.scales.add(res);
        this.unset('scale');
        return this.unset('value');
      }
    };

    Choice.prototype.url = "";

    Choice.prototype.makeScale = function(data) {
      if (!_.isString(data)) {
        if (data.id != null) return scales.findById(data.id);
        if (data.name != null) return scales.findByName(data.name);
      }
      return scales.findById(data);
    };

    Choice.prototype.defaults = {
      text: ""
    };

    return Choice;

  })();

  window.Word = (function() {

    __extends(Word, Backbone.Model);

    function Word() {
      Word.__super__.constructor.apply(this, arguments);
    }

    Word.prototype.defaults = {
      word: ""
    };

    return Word;

  })();

  window.Choices = (function() {

    __extends(Choices, RefCollection);

    function Choices() {
      Choices.__super__.constructor.apply(this, arguments);
    }

    Choices.prototype.model = Choice;

    return Choices;

  })();

  window.Words = (function() {

    __extends(Words, Backbone.Collection);

    function Words() {
      Words.__super__.constructor.apply(this, arguments);
    }

    Words.prototype.model = Word;

    return Words;

  })();

  window.Task = (function() {

    __extends(Task, RefModel);

    function Task() {
      Task.__super__.constructor.apply(this, arguments);
    }

    Task.prototype.defaults = {
      name: "",
      description: "",
      time: "",
      type: window.TaskType.Undef
    };

    return Task;

  })();

  window.WordTask = (function() {

    __extends(WordTask, Task);

    function WordTask() {
      WordTask.__super__.constructor.apply(this, arguments);
    }

    WordTask.prototype.url = function() {
      return "/task/" + this.cid;
    };

    WordTask.prototype.defaults = {
      type: TaskType.WORD,
      mutilple: false,
      time: "",
      text: ""
    };

    WordTask.prototype.refCollection = {
      field: "words",
      collection: Words
    };

    WordTask.prototype.refModel = {
      field: "scale",
      model: Scale
    };

    return WordTask;

  })();

  window.ChoiceTask = (function() {

    __extends(ChoiceTask, Task);

    function ChoiceTask() {
      ChoiceTask.__super__.constructor.apply(this, arguments);
    }

    ChoiceTask.prototype.url = function() {
      return "/task/" + this.cid;
    };

    ChoiceTask.prototype.defaults = {
      type: TaskType.CHOICE,
      mutilple: false,
      time: ""
    };

    ChoiceTask.prototype.refCollection = {
      field: "choices",
      collection: Choices
    };

    return ChoiceTask;

  })();

  window.Tasks = (function() {

    __extends(Tasks, RefCollection);

    function Tasks() {
      Tasks.__super__.constructor.apply(this, arguments);
    }

    Tasks.prototype.model = Task;

    Tasks.prototype.url = "";

    Tasks.prototype.generator = function(elem) {
      var info;
      info = TaskByType[elem.type];
      if (!info) throw Error("Type not found");
      return new info.model(elem);
    };

    return Tasks;

  })();

  window.Test = (function() {

    __extends(Test, RefModel);

    function Test() {
      Test.__super__.constructor.apply(this, arguments);
    }

    Test.prototype.refCollection = {
      field: "tasks",
      collection: Tasks
    };

    Test.prototype.defaults = {
      name: "",
      description: ""
    };

    return Test;

  })();

  window.TaskByType = new Object;

}).call(this);
