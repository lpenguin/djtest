window.gettext = (text) ->
    if text == "Choice task"
        "Выбор из пунктов"
    if text == "Word task"
        "Поиск слов"    
    text


window.TaskType = 
  Undef: 0
  CHOICE: 1
  WORD: 2

class window.Scale extends Backbone.Model
    defaults:
        name: ""
        description: ""
        id: null
        value: 0
        
class window.Scales extends Backbone.Collection
  model: Scale
  findByName: ( name ) ->
      @find ( scale ) ->
          scale.get("name") == name 

class window.Choice extends RefModel
  refModel:
    field: "scale"
    model: Scale
  modelGenerator: ( data ) ->
    if not _.isString(data) 
      return scales.findByName(data.name) #data is Scale Object Descriptor
    scales.findByName(data)
  defaults: 
        text: ""
        value: 0

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
        type: TaskType.Undef


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


