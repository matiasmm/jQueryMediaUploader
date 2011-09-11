/**
* Matias Montenegro <matiasmmontenegro@gmail.com>
*
*/
(function($){
    MediaUploader = {
        i18n: {
            button_submit: "Upload",
            select_element: "Select file",
            reading_library_db: "Loading files",
            uploading: "Uploading",
            loading: "Loading",
            select: "Select",
            unselect: "Unselect",
            description: "description",
            required: "required",
            remove: "remove"

        }
    };
    MediaUploader.Store = {
        urls: {
            list: 'actions.php?action=list',
            upload: 'actions.php?action=upload',
            "remove": ''
        },
        categories: [],
        files: [],
        status: 'none',
        subscribed: [],
        //callbacks array
        after_start: [],

        subscribe: function(fs){
            this.subscribed.push(fs);
            this._init_window(fs);
        },
        search_in_array: function(arr, o){
            var pos = -1;
            for(var kc = 0; kc < arr.length ;kc++){
                if(arr[kc] === o){
                    pos = kc;
                }
            }
            return pos;
        },
        pushCateogories: function(arr){
            for(var k = 0; k< arr.length; k++){
                var e = arr[k];
                var pos = -1;

                if(this.search_in_array(this.categories, e) === -1){
                    this.categories.push(e);
                }
            }
        },
        broadcast: function(message, type){
            for(var k=0; k < this.subscribed.length; k++){
                this.subscribed[k].message(message, type);
            }
        },
        getItem: function(id){
            for(var k = 0; k < this.files.length; k++){
                if(id == this.files[k].id){
                    return this.files[k];
                }
            }
            return null;
        },
        start: function(callback){
            if(callback !== undefined){
                this.after_start.push(callback);
            }

            if(this.status == 'none'){
                this.status = 'loading';
                var d = {};
                if(this.noCateogories === undefined){
                    d.categories = this.categories;
                };
                MediaUploader.Store.broadcast(MediaUploader.i18n.loading, 'success');
                $.ajax({
                    url: this.urls.list,
                    method: 'post',
                    data: d,
                    dataType: 'json',
                    error: function(d){
                        MediaUploader.status = 'error';
                        MediaUploader.Store.broadcast('error', 'error');
                    },
                    success: function(data){
                        for(var k=0; k<data.files.length; k++){
                            MediaUploader.Store.add(data.files[k]);
                        }

                        MediaUploader.Store.broadcast('', 'success');
                        MediaUploader.status = 'success';
                        for(var i=0; i< MediaUploader.Store.after_start.length; i++ ){
                            MediaUploader.Store.after_start[i]();
                        }
                    }
                });
            }else{
                if(callback !== undefined){
                    callback();
                }
            }
        },
        unsubscribe: function(fs){
            for(var k=0; k < this.subscribed.length; k++){
                if(fs == this.subscribed[k]){
                    this.subscribed.splice(k,1);
                    return;
                }
            }
        },
        add: function(item){
            this.files.push(item);
            for(var k=0; k < this.subscribed.length; k++){
                if(this.subscribed[k].config.categories !== undefined && this.search_in_array(this.subscribed[k].config.categories, item.category) === -1){
                    continue;
                }
                this.subscribed[k].add(item);
            }
        },
        _init_window: function(fs){
            for(var k = 0; k < this.files.length; k++){
                if(fs.config.categories !== undefined && this.search_in_array(fs.config.categories, this.files[k].category) === -1){
                    continue;
                }
                fs.add(this.files[k]);
            }
        },
        "remove": function(id){
            this.files.push(item);
            for(var k=0; k < this.subscribed.length; k++){
                this.subscribed[k].remove(id);
            }
            for(var i=0; k < this.files.length; i++){
                if(id === this.files[i].id){
                    this.files.splice(i,1);
                    return;
                }
            }
        }

    };
    MediaUploader.Render = {
        image: function(item){
            return $("<img>")
                .data('id', item.id)
                .attr("src", item.src)
                .attr("height", item.width)
                .attr("width", item.height);
        },
        video: function(item){
            return $("<div class='video'>")
                .data('id', item.id);
        }
    };
    MediaUploader._BaseFileSelector = function(input_selector, config){
        var input = $(input_selector);
        if(input.lengthi == 0){
            alert("No elements matching with selector: " + input_selector);
        }

        if(config === undefined){
            config = {};
        }

        var default_files = [$(input).val()];
        if(config.multiple == true){
            input.each(function(i, el){
                if(i == 0){
                    input = $(el);
                }else{
                    default_files.push($(el).val());
                    $(el).remove();
                }
            });
        }

        if(input == null){
            alert("No elements matching with selector: " + input_selector);
        }

        var o = {
            origin_input: input,
            widget: {},
            config: config,
            name: null,
            default_files: default_files,
            /**
             * Creates the selected items displayer and the button that renders the widget selector
             */
            create: function(){
                var div =  $('<div class="jqMediauploader">');

                if(this.config.categories !== undefined){
                    MediaUploader.Store.pushCateogories(this.config.categories);
                }else{
                    MediaUploader.Store.noCateogories = true;
                }
                this.widget.container = div;
                this.name = $(this.origin_input).attr("name");

                div
                    .append(o.widget.display = $('<div class="display">'))
                    .append(o.widget.button = $('<input type="button">').attr("value", MediaUploader.i18n.select_element));
                    o.widget.button.bind('click', {t: this},function(event){
                        div.append(event.data.t.makeWindow());
                    });

                if(this.config.multiple){
                    this.name = (this.name.substring(this.name.length-2,this.name.length) == '[]')? this.name.substring(0, this.name.length-2) : this.name;
                }
                this.origin_input.after(div);
                this.origin_input.remove();
                if(this.default_files.length){
                    var onready = function(){
                        MediaUploader.Store.start(function(){
                            o.widget.display.html('');
                            for(var k=0; k<o.default_files.length; k++){
                                var f = MediaUploader.Store.getItem(o.default_files[k]);
                                if(f !== null){
                                    o._displayAdd(f);
                                }
                            }
                        });
                    };

                    ($.isReady)? onready() : $(document).ready(onready) ;

                }
            },
            /**
             * Creates extra fields inside the uploader file form in addition to the input file field.
             */
            getExtraFields: function(){
                var d = $("<div>");
                if(this.config.categories !== undefined){
                    var select = $("<select name='category'>");
                    for(var k = 0; k< this.config.categories.length; k++){
                        var c = this.config.categories[k];
                        select.append($('<option>').attr("value", c).html(c));
                    }
                    d.append(select);
                }
                return d;
            },
             /**
              * Creates widget(to select a file)
              */
             makeWindow: function(){
                var $this = this;

                if($this.widget.button.data('fs') === $this){
                    return ;
                }
                $this.widget.button.data('fs', $this);

                var iframe = $('<iframe id="mediauploader_iframe" name="mediauploader_iframe">').hide();
                this.files_container = $("<div class='container'>");
                var extra_fields = this.getExtraFields();
                this.win = $('<div class="mediauploader">')
                     .append(iframe)
                     .append($('<div class="close-button">').html("&nbsp;").bind('click',function(){
                       $this.win.close();
                     }))
                     .append($('<form target="mediauploader_iframe" method="post" enctype="multipart/form-data">').bind('submit', function(){
                             var valid = true;
                             $(this).find('.required').each(function(){
                                 if($(".required").val() == false){
                                     valid = false;
                                 }
                             });
                             if(valid ==false){
                                 $this.message(MediaUploader.i18n.required, 'error');
                                 return false;
                             }else{
                                 $this.message("", 'notice');
                             }
                             $(this).attr("action", MediaUploader.Store.urls.upload);
                             iframe.load(function(data){
                                 $this.message("", 'notice');
                                 var o = $.parseJSON(iframe.contents().find("body").html());
                                 if(o.status == 'success'){
                                     MediaUploader.Store.add(o.file);
                                }else{
                                    if(o['errors']){
                                        var m = '';
                                        for(var k=0;k<o['errors'].length; k++){
                                            m += o['errors'];
                                        }
                                        $this.message(m, "error");
                                    }else{
                                        $this.message("Unable to upload file", "error");
                                    }
                                 }

                             });

                             $this.message(MediaUploader.i18n.uploading, 'notice');

                         })
                         .append($('<input type="file" name="f" class="required">'))
                         .append($('<label>').html(MediaUploader.i18n.description))
                         .append($('<input type="text" name="d" class="required">'))
                         .append(extra_fields)
                         .append($('<input type="submit" name="submit">').attr("value", MediaUploader.i18n.button_submit))
                     )
                     .append(this.message_container = $('<div class="messages">'))
                     .append(this.files_container)
                     .append($("<input value='select' type='button'>").bind('click', function(){
                         $this.displaySelectedItems();
                     }));

                this.win.close = function(){
                    MediaUploader.Store.unsubscribe($this);
                    $this.win.remove();
                    $this.widget.button.data("fs", null);
                    delete $this;
                };
                MediaUploader.Store.subscribe(o);
                MediaUploader.Store.start();

                return this.win;
            },

            displaySelectedItems: function(){
                var $this = this;
                this.widget.display.html('');
                this.files_container.find(".selected").each(function(){
                    $this._displayAdd($(this).data('item'));
                });
                this.win.close();
            },
            /**
             * Add item to displayer
             */
            _displayAdd: function(file){
                var cont = $('<div class="item">');
                var input = $('<input type="hidden">').attr('name', (this.config.multiple)? this.name+'[]' :  this.name).attr('value', file.id);
                var rendered = MediaUploader.Render[file.type](file);
                cont.append(rendered).append(input);
                this.widget.display.append(cont);
            },
            message: function(message, type){
                var m = $('<div>').attr('class', type).html(message);
                this.message_container.html(m);
            },
            /**
             * Add item to Widget container
             */
            add: function(item){
                if(item.type == undefined || MediaUploader.Render[item.type] == false){
                    alert("Item with incorrect or null type: " + item.type);
                    return;
                }
                $fs = this;
                var div = $("<div class='file unselected'>");
                    div.append($("<div class='select button'>").html(MediaUploader.i18n.select).bind('click',function(){
                        if(!$fs.config.multiple){
                            $fs.files_container.find(".file").each(function(){
                                $(this).removeClass("selected");
                                $(this).addClass("unselected");
                            });
                        }

                        var select_b = $(this);
                        if(div.hasClass('unselected')){
                            div.removeClass('unselected');
                            div.addClass('selected');
                            select_b.html(MediaUploader.i18n.unselect);
                        }else{
                            div.addClass('unselected');
                            div.removeClass('selected');
                            select_b.html(MediaUploader.i18n.select);
                        }
                    }))
                    .append(MediaUploader.Render[item.type](item));
                    if(item["description"] !== undefined){
                        div.append($('<div class="description">').html(item.description));
                    }
                div.data("item",item);
                this.files_container.append(div);
            },
            /**
             * Given an item id, it removes the item being displayed in the items container
             */
            "remove": function(id){
                this.files_container.find(".file").each(function(){
                    var it = $(this).data("item");
                    if(it.id === item.id){
                        $(this).remove();
                        return false;
                    }
                });
                this.files_container.append(div);
            }

        };
        return o;
    }


    MediaUploader.FileSelector = function(input_selector, config){
        var o = MediaUploader._BaseFileSelector(input_selector, config);
        o.displaySelectedItems = function(){
            var $this = this;
            this.widget.display.html('');
            this.files_container.find(".selected").each(function(){
                $this._displayAdd($(this).data('item'));
            });
            this.win.close();
        };
        o.create();
        return o;
    }

    MediaUploader.MultipleFileSelector = function(input_selector, config){
        var o = MediaUploader._BaseFileSelector(input_selector, config);
        config['multiple'] = true;
        o.displaySelectedItems = function(){
            var $this = this;
            this.files_container.find(".selected").each(function(){
                $this._displayAdd($(this).data('item'));
            });
            this.win.close();
        };

        o._displayAdd = function(file){
            var cont = $('<div class="item">');
            var remove = $('<div class="remove">').html('&nbsp;').bind('click',function(){
                cont.remove();
            });
            var input = $('<input type="hidden">').attr('name', (this.config.multiple)? this.name+'[]' :  this.name).attr('value', file.id);
            var rendered = MediaUploader.Render[file.type](file);
            cont.append(rendered).append(input).append(remove);
            this.widget.display.append(cont);
        };

        o.create();
        return o;
    }
})(jQuery);
