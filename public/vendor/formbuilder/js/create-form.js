jQuery(function() {

  // var fb = $(document.getElementById('fb-editor')).formBuilder();
  //
  //  $('.language-selector li').click(function() {
  //    var lang = this.id;
  //    fb.actions.setLang
  //  });



    $('#visibility').change(function(e) {
        e.preventDefault()
        var ref = $(this)

        if (ref.val() == "" || ref.val() == 'PUBLIC') {
            $('#allows_edit_DIV').hide()
        } else {
            $('#allows_edit_DIV').slideDown()
            $('#allows_edit').val('0')
        }
    });

    // create the form editor
    var fbEditor = $(document.getElementById('fb-editor'))

    var formBuilder
    var fbOptions = {
      // i18n: {
      //   locale: 'ar-SA',
      // },
        dataType: 'json',
        formData: window._form_builder_content ? window._form_builder_content : '',
        controlOrder: [
            'header',
            'paragraph',
            'text',
            'textarea',
            'select',
            'number',
            'date',
            'autocomplete',
            'file',
        ],
        disableFields: [
            'button', // buttons are not needed since we are the one handling the submission
        ],  // field types that should not be shown
        disabledAttrs: [
            // 'access',
        ],
        typeUserDisabledAttrs: {
            'file': [
                'multiple',
                'subtype',
            ],
            'checkbox-group': [
                'other',
            ],
        },
        showActionButtons: false, // show the actions buttons at the bottom
        disabledActionButtons: ['data'], // get rid of the 'getData' button
        sortableControls: false, // allow users to re-order the controls to their liking
        editOnAdd: false,
        fieldRemoveWarn: false,
        roles: window.FormBuilder.form_roles || {},
        notify: {
            error: function(message) {
              return swal('Error', message, 'error')
            },
            success: function(message) {
              return swal('Success', message, 'success')
            },
            warning: function(message) {
              return swal('Warning', message, 'warning');
            }
        },
        onSave: function() {
            // var formData = formBuilder.formData
            // console.log(formData)
        },
    }


    formBuilder = fbEditor.formBuilder(fbOptions)
    // formBuilder = fbEditor.formBuilder()

    var fbClearBtn = $('.fb-clear-btn')
    var fbShowDataBtn = $('.fb-showdata-btn')
    var fbSaveBtn = $('.fb-save-btn')
    var fblangBtn = $('.language-selector li')

    // setup the buttons to respond to save and clear
    fbClearBtn.click(function(e) {
        e.preventDefault()

        if (! formBuilder.actions.getData().length) return

        sConfirm("Are you sure you want to clear all fields from the form?", function() {
            formBuilder.actions.clearFields()
        })
    });
    // document.getElementById('showData').addEventListener('click', function() {
    //   formBuilder.actions.showData()
    // });
    fbShowDataBtn.click(function(e) {
        e.preventDefault()
        formBuilder.actions.showData()
    });
    fblangBtn.click(function() {
    var lang = this.id;
    // alert(lang);
    if (lang == 'ar-SA') {
      $(".form-wrap,.form-builder, .frmb, .prev-holder, select, .form-wrap, .form-builder, .frmb, .prev-holder, input[type='text'], .form-wrap, .form-builder, .frmb, .prev-holder, textarea, .form-wrap, .form-builder, .frmb, .prev-holder, input[type='number']").css("direction","rtl")
      // $(this).closest('.form-builder').children('.field-label').css("float","right")
      // $(".form-wrap.form-builder .frmb .field-label, .form-wrap.form-builder .frmb .legend").css("float","right")
      // $(".form-wrap.form-builder .frmb .field-actions").css("left",0)
      // $("form-wrap, .field-label, .legend").css("float","right")

    }else {
      $(".form-wrap,.form-builder, .frmb, .prev-holder, select, .form-wrap, .form-builder, .frmb, .prev-holder, input[type='text'], .form-wrap, .form-builder, .frmb, .prev-holder, textarea, .form-wrap, .form-builder, .frmb, .prev-holder, input[type='number']").css("direction","ltr")

    }
    formBuilder.actions.setLang(lang)
  });

    fbSaveBtn.click(function(e) {
        e.preventDefault()

        var form = $('#createFormForm')
        console.log(form);
        console.log(formBuilder.actions.getData().length);
        // make sure the form is valid
        if ( ! form.parsley().validate() ) return

        // make sure the form builder is not empty
        if (! formBuilder.actions.getData().length) {
            swal({
                title: "Error",
                text: "The form builder cannot be empty",
                icon: 'error',
            })
            return
        }

        // ask for confirmation
        sConfirm("Save this form definition?", function() {
            fbSaveBtn.attr('disabled', 'disabled');
            fbClearBtn.attr('disabled', 'disabled');

            var formBuilderJSONData = formBuilder.actions.getData('json')
            // console.log(formBuilderJSONData)
            // var formBuilderArrayData = formBuilder.actions.getData()
            // console.log(formBuilderArrayData)

            var postData = {
                name: $('#name').val(),
                visibility: $('#visibility').val(),
                allows_edit: $('#allows_edit').val(),
                form_builder_json: formBuilderJSONData,
                _token: window.FormBuilder.csrfToken
            }

            var method = form.data('formMethod') ? 'PUT' : 'POST'
            jQuery.ajax({
                url: form.attr('action'),
                processData: true,
                data: postData,
                method: method,
                cache: false,
            })
            .then(function(response) {
                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')

                if (response.success) {
                    // the form has been created
                    // send the user to the form index page
                    swal({
                        title: "Form Saved!",
                        text: response.details || '',
                        icon: 'success',
                    })

                    setTimeout(function() {
                        window.location = response.dest
                    }, 1500);

                    // clear out the form
                    // $('#name').val('')
                    // $('#visibility').val('')
                    // $('#allows_edit').val('0')
                } else {
                    swal({
                        title: "Error",
                        text: response.details || 'Error',
                        icon: 'error',
                    })
                }
            }, function(error) {
                handleAjaxError(error)

                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')
            })
        })

    })

    // show the clear and save buttons
    $('#fb-editor-footer').slideDown()
})
