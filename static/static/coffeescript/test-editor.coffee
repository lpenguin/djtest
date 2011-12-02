window.app = "#app";

class window.WordTaskView extends Backbone.View
  initialize: ->
    @template = $('#word-task-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    $(@el).appendTo(app);


class window.ChoiceView extends Backbone.View
  initialize: ->
    @template = $('#choice-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, choice: @model
    this
    
    
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
    this.$("[name: choices-ul]").append view.render().el
    
  addAll: () ->
    @model.choices.each (choice) => this.add( choice )  
    

class window.TestView extends Backbone.View
  initialize: ->
    @template = $('#test-template').html()
    
  render: ->
    $(app).empty()
    $(@el).html _.template @template, test: @model
    $(@el).appendTo(app);
    # this.addAll( @model.tasks )
#     
  # add: (task) ->
    # info = TaskType[ task.get 'type' ]
    # view = new info.view model: task
    # this.$("[name: tasks-ul]").append view.render().el
#     
  # addAll: () ->
    # @model.tasks.each (task) => this.add( task )    

class window.TestRouter extends Backbone.Router
  routes:
    "": "showTest"
    "tasks/:taskid": "showTask"
  showTest: ->
    view = new TestView( model: test)
    view.render()
    
  showTask: (taskid) ->
    task = test.tasks.find (task) => task.cid == id
    info = TaskType[ task.get 'type' ]
    view = new info.view model: task
    view.render()
    
window.TaskType = new Object()

TaskType[ TaskByType.CHOICE ] = 
  name: gettext("Choice task")
  model: ChoiceTask
  view: ChoiceTaskView

TaskType[ TaskByType.WORD ] = 
  name: gettext("Word task")
  model: WordTask
  view: WordTaskView