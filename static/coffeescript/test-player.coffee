window.app = "#app";
window.showedInstruction = false

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
    @started = false
  events:
    "click [name=add-button]": "addClick"
    "click [name=done-button]": "done"
    "click [name=start-button]": "start"
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    r = $(@el).appendTo(app);
    if not @started
        $("[name=intruction]").show()
        $("[name=intro]").show()
    r
  add: (word) ->
    @findedWords.add word
    view = new WordView model: word
    this.$("[name=words-ul]").append view.render().el
  start: ->
    @started = true
    
    $("[name=intruction]").hide()
    $("[name=intro]").hide()
    $("[name=main]").show()
    testTimer.start()
	
  addClick: ->
    allText = $("[name=text]").html()
    text = getSelectedText()
    range = $("[name=text]").getRangeAt()
    l = $("<span>"+allText.substr(0, range.startOffset)+"</span>")
    m = $("<span class='selected-word'>"+text+"</span>")
    r = $("<span>"+allText.substr(range.endOffset)+"</span>" )
    word = new Word word: text
    this.add word
    false
  done1: ->
    @model.set result: findedWords: @findedWords.toJSON() 
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
  events:
    "click [name=start-button]": "start"
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    $(@el).appendTo(app);
    if @showInstruction and not window.showedInstruction 
        this.$("[name=main]").hide()
        this.$("[name=intro]").show()
        window.showedInstruction = true
    else
        this.$("[name=main]").show()
        this.$("[name=intro]").hide()
        #$("[name=intruction]").hide()
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
        
  start: () ->
    testTimer.start()
    this.$("[name=main]").show()
    this.$("[name=intro]").hide()
    $("[name=intruction]").hide()    
    
  done: ->
    @model.set result: { choice: new Choice() } 
    router.nextTask()
    false    

class window.SpeedTaskView extends Backbone.View
  initialize: ->
    @template = $('#speed-task-template').html()
    @table_template = $('#speed-task-table-template').html()
    @clicks = 0
    @step = 1
    @result = {}
  events:
    "click [name=start-button]": "start"
    "click [name=next]": "nextClick"
  render: ->
    $(app).empty()
    $(@el).html _.template @template, task: @model
    $(@el).appendTo(app);
    this.$('[name=step]').text( @step )
    if @showInstruction and not window.showedInstruction 
        this.$("[name=main]").hide()
        this.$("[name=intro]").show()
        window.showedInstruction = true
    else
        this.$("[name=main]").show()
        this.$("[name=intro]").hide()
        #$("[name=intruction]").hide()
    @drawStartButton()
  drawStartButton: -> 
    this.$('[name=table]').empty()
    
    span = $('<span>Предполагаемое количество нажатий</span>')
    input = $('<input type=text></input>')
    button = $('<button>Начать</button>') 
    self = this
    button.click => 
        name = 'clicks_d'+@step
        @result[ name ] = input.val()
        @nextStep()
    this.$('[name=table]').append span
    this.$('[name=table]').append input
    this.$('[name=table]').append $('<br/>')
    this.$('[name=table]').append button
    this.$('[name=clicks-div]').hide()
  nextClick: ->
    this.$('[name=clicks-div]').show()
    this.$('[name=result-div]').hide()
    name = 'clicks'+@step
    @result[ name ] = @clicks 
    @clicks = 0
    this.$('[name=clicks]').text( 0 )
    @drawStartButton()
    @step++   
    this.$('[name=step]').text( @step )     
  nextStep: () ->
    if @step <= 4
        this.$('[name=step]').text( @step )
        this.drawTable()    
        this.$('[name=table]').empty()
        @drawTable()
        this.$('[name=clicks-div]').show()
        time = @model.get('time'+@step)
        speedtimer = new TimerView( time, =>
            
            if @step >= 4
                @done()
                return false
            
            this.$('[name=clicks-div]').hide()
            this.$('[name=clicks-result]').text( @clicks )
            this.$('[name=result-div]').show()
            this.$('[name=table]').empty()

        )
            
        
        speedtimer.render()
        $(speedtimer.el).hide()
        speedtimer.start()
    else
        @done
  incClicks: () ->
    @clicks++
    this.$('[name=clicks]').text( @clicks )
  drawTable: () ->
    table = $('<table>')
    for h in [1 .. @model.get('width')]
        tr = $('<tr>')
        for w in [1 .. @model.get('height')]
            td = $('<td>')
            button = $('<button>X</button>')
            self = this
            button.click -> 
                self.incClicks()
                $(this).attr("disabled", true)
            td.append button
            tr.append td
        table.append tr
        
    this.$('[name=table]').append table
    
    
  choiceSelected: (choice) ->
    @model.set result: { choice: choice.toJSON() }
    router.nextTask()
        
  start: () ->
    testTimer.start()
    this.$("[name=main]").show()
    this.$("[name=intro]").hide()
    $("[name=intruction]").hide()    
    
  done: ->
    @model.set result: @result
    router.nextTask()
    false    
    
class window.TimerView extends Backbone.View
  initialize: (seconds, func)->
    @template = $('#timer-template').html() 
    @seconds = seconds
    @endFunc = func
  render: ->
    app = "#timer"
    $(app).empty()
    $(@el).html _.template @template, {}
    res = $(@el).appendTo(app)    
    this.$("#time").text @formatTime( @seconds )
    res
  start: () ->
    @timerId = setInterval( ()=>
        if @seconds < 0 
            @stop()
            @endFunc()
            return
        this.$("#time").text @formatTime( @seconds )
        @seconds = @seconds - 1
    , 1000 );
    #@update()
  stop: ->
    clearInterval( @timerId )
  formatTime: (seconds) ->
    date = new Date( seconds * 1000 )
    return date.format("MM:ss")
    return String( seconds )

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
    
class window.TaskCompleteView extends Backbone.View
  initialize: ->
    @template = $('#task-complete-template').html()
  events:
    "click [name=start-test]": "startTest"
  render: ->
    $(app).empty()
    $(@el).html _.template @template, test: @model
    $(@el).appendTo(app)
  startTest: ->
    router.endTest()
    
class window.TestRouter extends Backbone.Router
  routes:
    "": "start"
    "secret": "showTest"
    "send": "sendResults"
    "tasks/:taskid": "showTask"
    "complete": "complete"
  timerComplete: ->
    @complete()
  start: ->
    if test.time
        window.testTimer = new TimerView(  test.time,  =>
            view1.done()
            testTimer.remove()
            #@complete()
        )
        testTimer.render()
        #testTimer.start()
    @showTask( activeTask.cid )
  sendResults: ->
    if @completeTest
      view = new TaskCompleteView()
      view.render()
  
  showTest: -> 
    view = new TestView( model: test)
    view.render()
    view.sendResults() 
    
  showTask: (taskid) ->
    task = test.tasks.find (task) => task.cid == taskid
    info = TaskByType[ task.get 'type' ]
    window.view1 = new info.view model: task
    view1.showInstruction = test.time
    view1.render()
 
  nextTask: ->
    activeTaskIndex++
    if activeTaskIndex < test.tasks.size()
      activeTask = test.tasks.at activeTaskIndex
      this.navigate "#tasks/"+activeTask.cid, true
    else
      this.complete()  
    
  endTest: ->
    if @completeTest
      view = new SendResultsView()
      view.render()
      view.sendResults()
      return false  
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

TaskByType[ TaskType.SPEED ] = 
  name: gettext("Speed task")
  model:SpeedTask
  view: SpeedTaskView