function sendFile(file, editor) {

    data = new FormData();
    data.append("SummernoteFile", file);
    $.ajax({
       data: data,
       type: "POST",
       url: summernote_url + "/upload.php",
	   cache: false,
	   contentType: false,
       processData: false,
       success: function(url) {
  		  str = url.substr(0, 2);
		  msg = url.replace(str,'');
		  if(str == "1|") {
			$(editor).summernote("insertImage", msg);
		  } else {
			alert(msg);
		  }
       },
       error : function(url) {
		  alert("오류가 발생하였습니다.");
	   }
   });
}

(function ($) {
  $(document).ready(function () {
		//document.emojiSource = '/amina/plugin/editor/summernote/plugin/emoji/pngs/'; //relative path to emojis
    $(".summernote").summernote({
      lang: 'ko-KR',
      height: 300,
			dialogsInBody : true,
			
			map: {
        apiKey: 'AIzaSyAV0NvORvyBJUukI_GH0SDSZgYndpf0Ayo',
        // This will be used when map is initialized in the dialog.
        center: {
          lat: 37.554203,
          lng: 126.972943
        },
        zoom: 13
 	    },
      // toolbar
      toolbar: [
				//https://summernote.org/deep-dive/
				//['style', [ 'fontname','fontsize','color']],
				['font', ['bold', 'strikethrough', 'clear']],
				['para', ['fontsize','paragraph']],
				['insert', [ 'picture','video','hello','uploadfile','map','videoAttributes']],
				['codeview']
			],


			// popover: {
			// 	image: [
			// 		['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
			// 		['float', ['floatLeft', 'floatRight', 'floatNone']],
			// 		['remove', ['removeMedia']],
			// 	],
			// 	link: [
			// 		['link', ['linkDialogShow', 'unlink']]
			// 	],
			// 	air: [
			// 		['color', ['color']],
			// 		['font', ['bold', 'underline', 'clear']],
			// 		['para', ['ul', 'paragraph']],
			// 		['table', ['table']],
			// 		['insert', ['link', 'picture']]
			// 	],
			// },
			
      callbacks : {
		 onImageUpload: function (files) {
			// Max Image Size : 10MB
			var maxImageSize = 10 * 1024 * 1024;
			var maxImage = false; 
			var isMax = false;
			var isFile = false;
			var fileName;
			var fileExt;
			for (var i = 0; i < files.length; i++) {
			  if (files[i].size > maxImageSize) {
				isMax = true;
				break;   
			  }

			  fileName = files[i].name;
			  fileExt = fileName.split('.').pop().toLowerCase();
			  if($.inArray(fileExt, ['jpg', 'gif','png']) == -1) {
				isFile = true;
				break;   
			  }
			}

			if (isMax) { 
			   alert('10MB 이내 이미지 파일만 업로드할 수 있습니다.');
			} else if (isFile) { 
			   alert('jpg, gif, png 파일만 업로드할 수 있습니다.');
			} else {
				for(var i = 0; i < files.length; i++) {
					sendFile(files[i], this);
				}
			}
		 }
	  }
		});
		
		


  });
})(jQuery);
