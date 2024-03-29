window.gettext = (text) ->
    if text == "Choice task"
        "Выбор из пунктов"
    if text == "Word task"
        "Поиск слов"    
    if text == "Speed task"
        "Тест на моторику" 
    text
    
window.getSelected = ->
  if window.getSelection
    window.getSelection()
  else if document.selection
    document.selection.createRange().text
    ""

window.TaskType = Undef: 0,  CHOICE: 1, WORD: 2, SPEED: 3,
TaskType.SPEED = 3

Backbone.sync = (method, model, success, error) -> 
  success.success(model)

class window.Scale extends Backbone.Model
  defaults:
    name: ""
    description: ""
    id: null
    value: 0
        
class window.Scales extends Backbone.Collection
  model: Scale
  findById: (id) ->
    this.find (scale) ->
      scale.get('id').toString() == id.toString() 
      
  findByName: ( name ) ->
      @find ( scale ) ->
          scale.get("name") == name 

class window.Choice extends RefModel
  #refModel:
  #  field: "scale"
  #  model: Scale
  refCollection:
    field: "scales"
    collection: Scales
    
  initialize: ->
    super    
    scale = this.get 'scale'
    
    if scale?
      res = @makeScale scale
      res.set value: @get 'value'
      @scales.add res
      this.unset 'scale'
      this.unset 'value'
    first = scales.models[0]
    @scales.each (scale, i) ->
      if not scales.findById( scale.id )
        scale.id = first.id
        scale.set( id: first.get('id') )
        scale.set( name: first.get('name') )
        scale.set( value: first.get('value') )
  url: ""
  makeScale: (data) ->
    if not _.isString(data) #data is Scale Object Descriptor
      if data.id?
        return scales.findById(data.id)
      if data.name?
        return scales.findByName data.name 
    scales.findById(data)
    
  # collectionGenerator: ( arr ) ->
    # scales = new Scales
    # _(arr).each (data) =>
      # scales.add @makeScale data
    # return scales
  # modelGenerator: ( data ) ->
    # if not _.isString(data) #data is Scale Object Descriptor
      # if data.id?
        # return scales.findById(data.id)
      # if data.name?
        # return scales.findByName data.name 
    # scales.findById(data)
    
  defaults: 
        text: ""
        #value: 0

class window.Word extends Backbone.Model
  defaults: 
    word: ""
        
class window.Choices extends RefCollection
  model: Choice

class window.Words extends Backbone.Collection
  model: Word

class window.Task extends RefModel
    defaults:
        name: ""
        description: ""
        time: ""
        type: window.TaskType.Undef


class window.WordTask extends Task
  url: -> 
    "/task/"+@cid;
  defaults:
    type: TaskType.WORD
    mutilple: false
    time: ""
    text: ""
  refCollection:
    field: "words"
    collection: Words
  refModel:
    field: "scale"
    model: Scale
  initialize: ->
    super    
    first = scales.models[0]
    if not scales.findById( @scale.id )
        @scale.id = first.id
        @scale.set( id: first.get('id') )
        @scale.set( name: first.get('name') )
        @scale.set( value: first.get('value') )
    


class window.ChoiceTask extends Task
  url: ->
    return "/task/"+@cid;
  defaults:
    type: TaskType.CHOICE
    mutilple: false
    time: ""
  refCollection:
    field: "choices"
    collection: Choices
    
    
class window.SpeedTask extends Task
  url: -> 
    "/task/"+@cid;
  defaults:
    type: TaskType.SPEED
    mutilple: false
    time: ""
    text: ""
    time1: 10
    time2: 8
    time3: 8
    time4: 8
    height: 9
    width: 3
  refModel:
    field: "scale"
    model: Scale
  initialize: ->
    super    
    if not scales.findById( @scale.id )
        @scale.id = first.id
        @scale.set( id: first.get('id') )
        @scale.set( name: first.get('name') )
        @scale.set( value: first.get('value') )
    
class window.Tasks extends RefCollection
    model: Task
    url: ""
    generator: (elem) ->
      info = TaskByType[ elem.type ]
      throw Error "Type not found" if not info
      new info.model elem 

class window.Test extends RefModel
  refCollection:
    field: "tasks"
    collection: Tasks
  defaults:
    name: ""
    description: ""
    
    
window.TaskByType = new Object


