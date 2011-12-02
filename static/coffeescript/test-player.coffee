window.app = "#app";

class window.WordView extends Backbone.View
  initialize: ->
    @template = $('#word-template').html() 
  tagName: "tr"
  events:
    "click [name=delete-button]": "delete"  
  render: ->
    $(@el).html _.template @template, word: @model
    this
  delete: ->
    @model.destroy()
    $(@el).remove()    
    false
    
    
class window.WordTaskView extends Backbone.View
  initialize: ->
    @template = $('#word-task-template').html()
    @findedWords = new Words
  events:
    "click [name=add-button]": "addClick"
    "click [name=done-button]": "done"
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    $(@el).appendTo(app);
  
  add: (word) ->
    @findedWords.add word
    view = new WordView model: word
    this.$("[name=words-ul]").append view.render().el
    
  addClick: ->
    text = this.$("[name=text]").getSelection().text
    word = new Word word: text
    this.add word
    false
  done: ->
    @model.set result: findedWords: @findedWords.toJSON() 
    router.nextTask()
    false


class window.ChoiceView extends Backbone.View
  initialize: ->
    @template = $('#choice-template').html()
    _.extend this, Backbone.Events 
  events:
    "click": "click"  
  render: ->
    $(@el).html _.template @template, choice: @model
    this
  click: ->
    this.trigger 'selected', @model
    false
    
    
class window.ChoiceTaskView extends Backbone.View
  initialize: ->
    @template = $('#choice-task-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    $(@el).appendTo(app);
    this.addAll( @model.choices )
         
  add: (choice) ->
    view = new ChoiceView model: choice
    this.$("[name=choices-ul]").append view.render().el
    view.bind 'selected', this.choiceSelected, this
    
  addAll: () ->
    @model.choices.each (choice) => this.add( choice )  
    
  choiceSelected: (choice) ->
    @model.set result: { choice: choice.toJSON() }
    router.nextTask()

class window.TestView extends Backbone.View
  initialize: ->
    @template = $('#test-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, test: @model
    $(@el).appendTo(app)
  sendResults: ->
    this.$("[name=data]").val JSON.stringify test.makeJSON()
    this.$("form").submit()       

class window.SendResultsView extends Backbone.View
  initialize: ->
    @template = $('#send-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, test: @model
    $(@el).appendTo(app)
  sendResults: ->
    this.$("[name=data]").val JSON.stringify test.makeJSON()
    this.$("form").submit() 
    
class window.TestRouter extends Backbone.Router
  routes:
    "": "start"
    "secret": "showTest"
    "send": "sendResults"
    "tasks/:taskid": "showTask"
    "complete": "complete"
  start: ->
    @showTask( activeTask.cid )
  sendResults: ->
    if @completeTest
      view = new SendResultsView()
      view.render()
      view.sendResults()
      return false    
  showTest: -> 
    view = new TestView( model: test)
    view.render()
    view.sendResults() 
    
  showTask: (taskid) ->
    task = test.tasks.find (task) => task.cid == taskid
    info = TaskByType[ task.get 'type' ]
    view = new info.view model: task
    view.render()
  nextTask: ->
    activeTaskIndex++
    if activeTaskIndex < test.tasks.size()
      activeTask = test.tasks.at activeTaskIndex
      this.navigate "#tasks/"+activeTask.cid, true
    else
      this.complete()
      
  complete: ->
    @completeTest = true
    @navigate "send", true
    

    
window.router = new TestRouter()

window.TaskByType = new Object()

TaskByType[ TaskType.CHOICE ] = 
  name: gettext("Choice task")
  model: ChoiceTask
  view: ChoiceTaskView

TaskByType[ TaskType.WORD ] = 
  name: gettext("Word task")
  model: WordTask
  view: WordTaskView