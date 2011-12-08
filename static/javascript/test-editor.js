//(function($) {

//cheat!!
function gettext(text){
    if( text == "Choice task")
        return "Выбор из пунктов";
    if( text == "Word task")
        return "Поиск слов";    
    if( text == "No scales")
        return "Вы не добавили шкалы";    
    return text;
}

TaskType = {
	Undef: 0,
    CHOICE: 1,
    WORD: 2
};

var app = "#app";
var dialog = "#dialog";
test= null;

richEditorSettings = {
                        // Location of TinyMCE script
                        script_url : '/static/javascript/tiny_mce/tiny_mce.js',
                        // General options
                        theme : "advanced",
                        //plugins : "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

                        // Theme options
                        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,formatselect,fontsizeselect",
                        theme_advanced_buttons2 : "cut,copy,paste,pastetext,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,image,cleanup,|,forecolor,backcolor",
                        theme_advanced_buttons3: "",
                        //theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                        //theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                        theme_advanced_toolbar_location : "top",
                        theme_advanced_toolbar_align : "left",
                        theme_advanced_statusbar_location : "bottom",
                        theme_advanced_resizing : true,
						theme_advanced_font_sizes : "12px,14px,16px,24px"
                     };
	
WordView = Backbone.View.extend({
    initialize: function() {
		this.template = $('#word-template').template();
		this.model.bind('destroy', this.remove, this);
    },  
    tagName: "tr",
    className: "word test-editor",
    events: {
		"change [name=word]": "changeWord",
		"click [name=delete-button]": "destroy"
    	//"click [name=choice-title]": "toggleChoice",
    },
    render: function(){
        $(this.el).empty();
        $.tmpl( this.template, { model: this.model } ).appendTo( $(this.el) );

        return this;
    },
	changeWord: function(){
		var text = this.$("[name=word]").val();
		this.model.set({ word: text });
	},
	destroy: function(){
		this.model.destroy();
    	return false;
	}

});

ChoiceView = Backbone.View.extend({
    initialize: function() {
		this.template = $('#choice-template').template();
		this.model.bind('destroy', this.remove, this);
    },  
    tagName: "tr",
    className: "choice test-editor",
    events: {
    	"change select[name=scale]": "changeScale",
		"change [name=text]": "changeText",
		"change [name=value]": "changeValue",
		"click [name=delete-button]": "destroy"
    	//"click [name=choice-title]": "toggleChoice",
    },
    render: function(){
        //$(app).empty();
        $(this.el).empty();
        $.tmpl( this.template, { model: this.model, scales: scales } ).appendTo( $(this.el) );
        var self = this;
		var t = $.template("<option value='${id}' ${selected}>${name}</option>" );
		//self.$("select[name=scale]").append($.tmpl( t, { name: "", selected: "", id: "-1" }));
		scales.each( function( scale ){
        	var name = scale.get("name");
			var id = scale.get("id");
	        var selected = self.model.scale == scale ? "selected" : "";
	        self.$("select[name=scale]").append($.tmpl( t, { name: name, selected: selected, id: id }));
        })
        return this;
    },
    changeScale: function(){
    	this.model.scale = scales.findByName(
    		this.$("select[name=scale] option:selected").text()
    	);
    },
	changeText: function(){
		var text = this.$("[name=text]").val();
		this.model.set({ text: text });
	},
	changeValue: function(){
		var value = this.$("[name=value]").val();
		this.model.set({ value: value });
	},
	destroy: function(){
		this.model.destroy();
    	return false;
	}
    //toggleChoice: function(e){
    //	this.$("[name=choice-body]").toggleClass("hidden");
    //}
});

WordTaskView = Backbone.View.extend({
    initialize: function() {
		this.template = $('#word-task-template').template();
		this.modelEdit = refClone( this.model, WordTask );
		this.modelEdit.words.bind('remove', this.reAddAll, this);
    },  
	events: {
		"click button[name=add-button]": "addWord",
		"click button[name=cancel-button]": "cancel",
		"click button[name=save-button]": "save",
		"change [name=name]": "changeName",
		"change [name=time]": "changeTime",
		"change [name=text]": "changeText",
		"change select[name=scale]": "changeScale"
	},
    render: function(){
        $(app).empty();
        $(this.el).empty();
        $.tmpl( this.template, { model: this.modelEdit } ).appendTo( $(this.el) );
        this.addAll( this.modelEdit.words );
        
        var self = this;
        
        var t = $.template("<option value='${id}' ${selected}>${name}</option>" );
		scales.each( function( scale ){
        	var name = scale.get("name");
			var id = scale.get("id");
	        var selected = self.modelEdit.scale.get("name") == scale.get("name") ? "selected" : "";
	        self.$("select[name=scale]").append($.tmpl( t, { name: name, selected: selected, id: id }));
        })
        
        $(this.el).appendTo(app);
        this.makeRichEditor();
        return this;
    },
    makeRichEditor: function(){
        this.$(".rich").redaktor({django_csrf: csrfTocken});//tinymce( richEditorSettings );
    },
    addAll: function(words){
        var that = this;
        words.each( function( word ){
            that.add( word );
        });
        
    },
    reAddAll: function(){
    	this.$(".word").remove();
    	this.addAll( this.modelEdit.words );
    },
    add: function( word ){
		var count = this.$(".word").length + 1;
		word.set({number: count});
        var view = new WordView({ model:word });
        this.$("[name=words-table]").append( view.render().el ); 
    },
	addWord: function(){
		var word = new Word();
		this.modelEdit.words.add( word );
		this.add( word );
	},
	save: function(){
		var value = this.$("[name=description]").val();
		this.modelEdit.set({ description: value });
		
		refCopy( this.modelEdit, this.model );
		testRouter.navigate("", true );
	},
	cancel: function(){
		testRouter.navigate("", true );
	},
	changeName: function(){
		var value = this.$("[name=name]").val();
		this.modelEdit.set({ name: value });
	},
	changeTime: function(){
		var value = this.$("[name=time]").val();
		this.modelEdit.set({ time: value });
	},
	changeText: function(){
		var value = this.$("[name=text]").val();
		this.modelEdit.set({ text: value });
	},
	changeScale: function(){
    	this.modelEdit.scale = scales.findByName(
    		this.$("select[name=scale] option:selected").text()
    	);
    }
});

ChoiceTaskView = Backbone.View.extend({
    initialize: function() {
		this.template = $('#choice-task-template').template();
		this.modelEdit = refClone( this.model, ChoiceTask );
		this.modelEdit.choices.bind('remove', this.reAddAll, this);
    },  
	events: {
		"click button[name=add-button]": "addChoice",
		"click button[name=cancel-button]": "cancel",
		"click button[name=save-button]": "save",
		"change [name=name]": "changeName",
		"change [name=time]": "changeTime",
		"change [name=description]": "changeDescription"
	},
    render: function(){
        $(app).empty();
        $(this.el).empty();
        $.tmpl( this.template, { model: this.modelEdit } ).appendTo( $(this.el) );
        this.addAll( this.modelEdit.choices );
        $(this.el).appendTo(app);
        this.makeRichEditor();
        return this;
    },
    makeRichEditor: function(){
        //this.$(".rich").tinymce( richEditorSettings );
        this.$(".rich").redactor({django_csrf: csrfTocken});
    },
    addAll: function(choices){
        var that = this;
        choices.each( function( choice ){
            that.add( choice );
        });
        
    },
    reAddAll: function(){
    	this.$(".choice").remove();
    	this.addAll( this.modelEdit.choices );
    },
    add: function( choice ){
		var count = this.$(".choice").length + 1;
		choice.set({number: count});
        var view  = new ChoiceView({ model:choice });
        this.$("[name=choices-table]").append( view.render().el ); 
    },
	addChoice: function(){
		var choice = new Choice({ scale: scales.at(0).get("name") });
		this.modelEdit.choices.add( choice );
		this.add( choice );
	},
	save: function(){
		var value = this.$("[name=description]").val();
		this.modelEdit.set({ description: value });
		refCopy( this.modelEdit, this.model );
		testRouter.navigate("", true );
	},
	cancel: function(){
		testRouter.navigate("", true );
	},
	changeName: function(){
		var value = this.$("[name=name]").val();
		this.modelEdit.set({ name: value });
	},
	changeTime: function(){
		var value = this.$("[name=time]").val();
		this.modelEdit.set({ time: value });
	},
	changeDescription: function(){
		return;
	}
});

TaskElemView = Backbone.View.extend({
	initialize: function() {
		this.template = $('#task-elem-template').template();
		this.model.bind('destroy', this.remove, this);
		_.extend(this, Backbone.Events);
    },  
    tagName: "tr",
    className: "test-editor",
    events: {
        	"click [name=delete-button]" : "deleteTask",
        	"click [name=copy-button]": "copyTask"
    },
    render: function(){
        $(this.el).empty();
        $.tmpl( this.template, { model: this.model } ).appendTo( $(this.el) );
        return this;
    },
    copyTask: function(){
    	this.trigger('copy', this.model);
    	return false;
    },
    deleteTask: function(e){
    	this.model.destroy();
    	return false;
    }
});

TestView = Backbone.View.extend({
    initialize: function() {
        this.template = $('#test-template').template();
    },  
    events: {
		"click [name=add-button]" : "addTask",	
		"click [name=save-button]" : "save",
		"click [name=cancel-button]" : "cancel"
    },
    render: function(){
        $(app).empty();
        $(this.el).empty();
        $.tmpl( this.template, {model:this.model} ).appendTo( $(this.el) );
        $(this.el).appendTo(app);
        this.addAll( this.model.tasks );
    },
    add: function( task ){
        var view = new TaskElemView({ model: task });
        view.bind('copy', this.copyTask, this );
        this.$("[name=tasks-table]").append( view.render().el );
    },
    addAll: function( tasks ){
        var that = this;
        tasks.each( function( task ){
            that.add( task );
        });
    },
    addTask: function(){
		testRouter.navigate("task-new", true );
    	return false;
    },
	makeNewName: function(name){
		var re = /(\d+)$/;
		var f = name.match(re);
		if( ! f ) return name;
		var num = f[1];
		var intnum = parseInt(num);
		name = name.replace( re, "" );
		intnum++;
		return name+intnum;
 			
	},
    copyTask: function(task){
    	var info = TaskByType[task.get("type")];
		var name = task.get('name');
		name = this.makeNewName(name);
	
		var copyedTask = new info.model();
		refCopy( task, copyedTask );
		copyedTask.set( {name: name });
		test.tasks.add( copyedTask );
		this.add( copyedTask );
    	return false;
    },
    save: function(){
    	var data = JSON.stringify( test.makeJSON() );
    	this.$("[name=data]").val( data );
    	this.$("[name=main-form]").submit();
    	return false;
    }, 
    cancel: function(){
    	document.location = testChangeUrl;
    	return false;
    }
});


TaskByType = {};
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

NewTaskView = Backbone.View.extend({
    initialize: function() {
        this.template = $('#new-task-template').template();
        this.render();
    },  
    events: {
		"click [name=continue-button]" : "next",
		"click [name=cancel-button]" : "cancel"	
    },
    render: function(){
        $(app).empty();
        $(this.el).empty();
        $.tmpl( this.template, {} ).appendTo( $(this.el) );
        this.addTaskTypes();
        $(this.el).appendTo($(app));
    },
    next: function(){
    	var info = TaskByType[this.$("select[name=task-type] option:selected").val()];
    	var task = new info.model();
    	var name = this.$("[name=task-name]").val();
    	task.set({name: name});
		task.set({description: "" });
    	test.tasks.add( task );
    	testRouter.navigate("task/"+task.cid, true );
    	//this.$("select[name=scale] option:selected").text()
    	return false;
    },
    addTaskTypes: function(){
    	var self = this;
    	_(TaskByType).each(function(elem, i){
    		self.$("[name=task-type]").append("<option value='"+i+"'>"+elem.name+"</option>");
    	});
    },
    cancel: function(){
		testRouter.navigate("", true );
	}
});

TestRouter = Backbone.Router.extend({
	routes: {
		"": "testView",
		"task/:taskId" : "taskEdit",
		"task-new": "taskNew"
	},
	testView: function(){
		var view = new TestView( { model: test } );
		view.render();
	},
	taskEdit: function( cid ){
		var task = test.tasks.find(function( task ){
			return task.cid == cid;
		});
		if( !task )
			throw Error("Task not found");
		
		var view;
		var info = TaskByType[ task.get("type") ];
		var view = new info.view({ model: task });
		view.render();
	},
	taskNew: function(){
	    var view  = new NewTaskView();
	}
});

testRouter = new TestRouter();

//})();
