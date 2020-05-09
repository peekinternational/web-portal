jQuery(function() {
	var fbRenderOptions = {
		container: false,
		dataType: 'json',
		formData: window._form_builder_content ? window._form_builder_content : '',
		render: true,
	}

	$('#fb-render').formRender(fbRenderOptions)
	var type ="{{$type}}";
	if (type !="") {
		// $("#textarea-1589047834011").css("background","aqua");
		$(".rendered-form").css("direction","rtl");
		// $("label").css("float","right");
	}

})
