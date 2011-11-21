RefCollection = Backbone.Collection.extend({
	initialize: function( options ){
		this.loadJSON( options );
	},
	//Redefine
	generator: null /*function( elem ){
		return new SomeModel(elem);//some generating code 
	}*/,
	loadJSON: function( data ){
		this.reset();
		var that = this;
		_(data).each( function( elem ){
			if( that.generator )
				that.add( that.generator( elem ))
			else
				that.add( new that.model( elem ));
		});
	},
	makeJSON: function(){
		var data = [];
		this.each( function( model ){
			if( model.makeJSON )
				data.push( model.makeJSON() );
			else
				data.push( model.toJSON() );
		});
		return data;
	}	
});

refClone = function( refObj, Class ){
	var js = refObj.makeJSON();
	var c = new Class( refObj.makeJSON() );
	var cjs = c.makeJSON();
	return new Class( refObj.makeJSON() );
}

refCopy = function( from, to ){
	to.loadJSON( from.makeJSON() );
}
RefModel = Backbone.Model.extend({
	initialize: function( options ){
		this.loadJSON( options );
	},
	//Redefine:
	refModel: null,/* {
		field: "fieldName",
		model: null
	}*/
	refCollection: null, /*{
		field: "fieldName",
		collection: null
	}*/
	modelGenerator: null,
	collectionGenerator:  null,
	loadJSON: function( data ){
		this.set( data );
		var self = this;
		if( this.refModel ){
			var fieldName = this.refModel.field;
			if( _.isUndefined( data[ fieldName ] ) )
				data[ fieldName ] = {};
			var generator = this.modelGenerator ? 
								this.modelGenerator : 
								function( data ){ 
									return new self.refModel.model( data )
								};
			this[ fieldName ] = generator( data[ fieldName ] );
			this.unset( fieldName );
		}
		if( this.refCollection ){
			var fieldName = this.refCollection.field;
			if( _.isUndefined( data[ fieldName ] ) )
				data[ fieldName ] = [];
			var generator = this.modelGenerator ? 
								this.collectionGenerator : 
								function( data ){ 
									return new self.refCollection.collection( data )
								};
			
			this[ fieldName ] = generator( data[ fieldName ] );
			this.unset( fieldName );
		}
	},
	makeJSON: function(){
		var data = this.toJSON();
		if( this.refModel ){
			var model = this[ this.refModel.field ];
			if( model.makeJSON )
				data[ this.refModel.field ] = model.makeJSON();
			else
				data[ this.refModel.field ] = model.toJSON();
		}
		if( this.refCollection ){
			var collection = this[ this.refCollection.field ];
			if( collection.makeJSON )
				data[ this.refCollection.field ] = collection.makeJSON();
			else
				data[ this.refCollection.field ] = collection.toJSON();
		}
		return data;
	}
});
