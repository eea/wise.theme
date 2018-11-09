$(document).ready(function(){

    $(".autoTransl").click(function(e) {
        e.preventDefault();
        // debugger;
        var text_div = $(this).parent().parent('ul').parent('div').siblings('div');
        var text = text_div.children('.text').text();
        var buton = $(this);
        var target_languages = ['EN'];
        var source_lang = 'EN';
        //debugger;
        $.ajax({
            text_div: text_div,
            type: "POST",
            url: "./request-translation2",
            dataType: 'json',
            data: {
                "text-to-translate": text,
                "targetLanguages": target_languages,
                "sourceLanguage": source_lang,
                "externalReference": text, // set by us, used as identifier
                "sourceObject": window.location.href,
            },
            success: function(result) {
                $.ajax({
                    type: "POST",
                    url: "./request-translation2",
                    tryCount : 0,
                    retryLimit : 10,
                    data: {
                        "from_annot": result.externalRefId,
                    },
                    success: function(translation) {
                        if (translation) {
                            //debugger;
                            text_div.children('.transl').text(translation)
                        }
                        else {
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                $.ajax(this);
                                return;
                            }
                            return;
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //debugger;
                        if (textStatus == 'timeout') {
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                $.ajax(this);
                                return;
                            }
                            return;
                        }
                        if (xhr.status == 500) {
                            //handle error
                        } else {
                            //handle error
                        }
                    }});
            },
            error: function(result) {
                //debugger;
                alert('error');
            }
        });
    });

    $('.editTransl').click(function(e) {
      e.preventDefault();

      var text_div = $(this).parent().parent('ul').parent('div').siblings('div');
      var translation = text_div.children('.transl').text();

      var form = $(this).parent().parent('ul').parent('div').siblings('div').children('form');
      form[0].style.display = 'block';
      form[0].elements['new_transl'].value = translation;

    });

    $('.submitTransl').click(function(e) {
      e.preventDefault();

      var text_div = $(this).parent().parent()
      var orig_text = text_div.children('.text').text()

      //debugger;

      var form = $(this).parent();
      var translation = form[0].elements['new_transl'].value

      $.ajax({
          form: form,
          text_div: text_div,
          translation: translation,
          type: 'POST',
          url: './translation-callback2',
          dataType: 'json',
          data: {
            'external-reference': orig_text,
            'translation': translation
          },
          success: function(result) {
            //debugger;
            form[0].style.display = 'none';
            text_div.children('.transl').text(translation)
          },
          error: function(result) {
            alert('ERROR saving translation!');
          }
      });

    });

});
