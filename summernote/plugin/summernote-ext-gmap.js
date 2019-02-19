/**
 * Plugin for upload file, author Kirill Danilevsky, k.danilevsky@gmail.com
 */

(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // Upload file dialog plugin

    /**
     * @param {Object} context - context object has status of editor.
     */
    var Uploadfile = function (context) {
        var editor = $('#summernote');
        var self = this;
        var ui = $.summernote.ui;
        var $editor = context.layoutInfo.editor;
        var options = context.options;
        var lang = options.langInfo;
        var $editable = context.layoutInfo.editable;

        // add context menu button
        context.memo('button.gmap', function () {
            return ui.button({
                contents: '<i class="fas fa-map-marker" style="font-family: FontAwesome; font-style: normal;" /> map',
                tooltip: lang.gmap.name,
                click: context.createInvokeHandler('gmap.showDialog')
            }).render();
        });

        // This method will be called when editor is initialized by $('..').summernote();
        // You can create elements for plugin
        self.initialize = function () {
            var $container = options.dialogsInBody ? $(document.body) : $editor;

            var body = '<div id="dialog-gmap">' +
                // '<div class="form-group note-group-select-from-files">' +
                // '<label>' + lang.gmap.selectFromFiles + '</label>' +
                // '<input class="note-file-input form-control" type="file" id="file-link" name="file-link" style="height: auto"/>' +
                // '</div>' +
                // '<div class="preloader"></div>' +
                // '<div class="form-group note-group-link-title" style="overflow:auto;">' +
                // '<label>' + lang.gmap.linkName + '</label>' +
                // '<input class="note-gmap-link-title form-control" type="text" />' +
                // '</div>' +
                // '<div class="form-group note-group-link-blank" style="overflow:auto;">' +
                // '<input class="note-gmap-link-blank" type="checkbox" style="margin-right: 10px" />' +
                // '<label> ' + lang.gmap.linkBlank + '</label>' +
                // '</div>' +
                '<iframe src="http://localhost/amina/bbs/helper.php?act=map" style="width:100%; height:400px;" />' +
                '</div>';

            var footer = '<button href="#" class="btn btn-primary note-gmap-btn">' +
                lang.gmap.saveFile + '</button>';

            self.$dialog = ui.dialog({
                title: lang.gmap.title,
                fade: options.dialogsFade,
                body: body,
                footer: footer
            }).render().appendTo($container);

        };

        self.destroy = function () {
            ui.hideDialog(self.$dialog);
            self.$dialog.remove();
        };

        self.showDialog = function () {
            self
                .openDialog()
                .then(function (dialogData) {
                    // [workaround] hide dialog before restore range for IE range focus
                    ui.hideDialog(self.$dialog);

                    // do something with dialogData
                    //console.log("dialog returned: ", dialogData);

                    context.invoke('editor.restoreRange');
                    context.invoke('editor.focus');

                    // @param {String} text - link text
                    // @param {String} url - link url
                    // @param {Boolean} isNewWindow - whether link's target is new window or not
                    editor.summernote('createLink', {
                        text: dialogData['title'],
                        url: dialogData['link'],
                        isNewWindow: dialogData['blank']
                    });

                })
                .fail(function () {
                    context.invoke('editor.restoreRange');
                });

        };

        self.openDialog = function () {

            return $.Deferred(function (deferred) {

                var $file, $linkTitle, $linkBlank,
                    $fileInput = self.$dialog.find('#file-link'),
                    $fileLinkTitle = self.$dialog.find('.note-gmap-link-title'),
                    $fileLinkBlank = self.$dialog.find('.note-gmap-link-blank'),
                    $fileBtn = self.$dialog.find('.note-gmap-btn');

                context.invoke('editor.saveRange');

                ui.onDialogShown(self.$dialog, function () {
                    context.triggerEvent('dialog.shown');

                    // Click button action.
                    $fileBtn.click(function (event) {

                        // Get title for link and clear field.
                        $linkTitle = $fileLinkTitle.val();

                        // Get file
                        $file = $fileInput[0].files;

                        // Get status.
                        $linkBlank = $fileLinkBlank.is(':checked');

                        event.preventDefault();

                        // Create ajax function. Save file to disk and insert link to editor.
                        if ($file.length > 0) {

                            // Check format data $image, file or url
                            if (jQuery.type($file) == "string") {
                                // This is text string.
                                data = new FormData();
                                data.append("fileLink", $file);
                            }
                            else {
                                // This is file.
                                data = new FormData();
                                data.append("files", $file[0]);
                            }

                            $.ajax({
                                data: data,
                                type: "POST",
                                url: "../plugin/editor/summernote/upload.php",
                                cache: false,
                                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                                contentType: false,
                                processData: false,
                                success: function (linkToFile) {

                                    // if not errors.
                                    if (typeof linkToFile['error'] == 'undefined') {

                                        if ($linkTitle.length < 1) {
                                            $linkTitle = linkToFile;
                                        }

                                        // Create array with data;
                                        var dataLink = {
                                            'link': linkToFile,
                                            'title': $linkTitle,
                                            'blank': $linkBlank
                                        };

                                        $('.preloader').html('');

                                        // Clear title.
                                        $fileLinkTitle.val('').trigger('focus');

                                        // Clear file field.
                                        $fileInput.val('').trigger('focus');

                                        // Get data and transfer to editor. Close dialog window.
                                        deferred.resolve(dataLink);

                                        // Clear checkbox.
                                        $fileLinkBlank.prop("checked", false ).trigger('focus');
                                    }
                                    else {
                                        $('.preloader').html(lang.gmap.error).css({color: 'red'});
                                    }
                                }
                            });
                        } else {
                            $('.preloader').html(lang.gmap.empty).css({color: 'red'});
                        }

                    });

                });

                ui.onDialogHidden(self.$dialog, function () {
                    $fileInput.off('change');
                    $fileLinkTitle.off('keyup paste keypress');
                    $fileBtn.off('click');

                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                });

                ui.showDialog(self.$dialog)
            });
        };
    };

    // Extends summernote
    $.extend(true, $.summernote, {
        plugins: {
            gmap: Uploadfile
        },

        // add localization texts
        lang: {
            'en-US': {
                gmap: {
                    name: 'Uploadfile',
                    title: 'google map',
                    saveFile: 'Save file',
                    selectFromFiles: 'Select from files',
                    linkName: 'Title link',
                    linkBlank: 'Open in new window',
                    error: 'Error, can\'t upload file! Please check file or URL.',
                    empty: 'Please select file for upload.'
                }
            },
            'ko-KR': {
                gmap: {
                    name: 'Uploadfile',
                    title: 'google map',
                    saveFile: 'Save file',
                    selectFromFiles: 'Select from files',
                    linkName: 'Title link',
                    linkBlank: 'Open in new window',
                    error: 'Error, can\'t upload file! Please check file or URL.',
                    empty: 'Please select file for upload.'
                }
            }
        }
    });
}));