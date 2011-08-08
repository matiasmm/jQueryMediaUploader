jQueryMediaUploader
===================

What is it?
-----------
It's jQuery Plugin for uploading files in a form. 
When you want to upload a file You usually add an input file tag. In this case you add any input tag (text, hidden, etc), this plugins is going to replace it by a button. When you press that button it's going to open the "Media Library". Here you can choose any file you can see or you can upload a new one.

Why It's just client side?
--------------------------
Because, the server side might depend either on your application or the programming language you are using. The idea is to make another repository that includes both sides in the future.

So, by the moment, you have to program the server side with the interface it provides (see actions.php).

Does it just includes images??
------------------------------
At the moment yes, But it's very easy to extend. The idea is to upload all kind of media files, but at this moment, it just renders images.




Examples of usage
=================

One file selector
-----------------
__HTML__

    <!-- you need a name to save the file id setted with jQueryMediaUploader. Value="1" if you are editing, if it's a new entity leave it empty -->
    <input type="hidden" name="file_id" value="1">

__Javascript__ 

    MediaUploader.FileSelector("#file_id");


Selecting Multiple files
------------------------
__HTML__

      <!-- Again, i'm supposing you are editing -->
      <input type="hidden" class="group" name="file_id[]" value="1">
      <input type="hidden" class="group" name="file_id[]" value="2">

__Javascript__ 

    MediaUploader.FileSelector(".group", {
        multiple: true
    });

You are going to get one button for selecting files multiple files, (not 2 buttons for each hidden).


Using categories
----------------
__HTML__

    <!-- Again, i'm supposing you are editing -->
    <input type="hidden" class="group" name="file_id[]" value="1">
    <input type="hidden" class="group" name="file_id[]" value="2">

__Javascript__ 

    MediaUploader.FileSelector(".group", {
        multiple: true,
        categories: ['guitars', 'drums', 'cities', 'top models']
    });

This categories are mainly usefull for interacting with the server side. In the server side, when you are listing the selectable files, you receive this categories, then you can filter them. If you don't receive any, you have to list them all.
MediaUploader works with just one Store object, but it knows wich categories are you using in every FileSelector.
When you upload a new file, it provides you a combo box to choose one of this categories.

Installation
============

Client side
-----------

1. In client side, include this code between the header tags:

__HTML__
    <link rel="stylesheet" type="text/css" media="screen" href="jQueryMediaUploader.css" />
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jQueryMediaUploader.js"></script>
    <script typepe="text/javascript">
        MediaUploader.Store.urls = {
            list: 'url_to_the_action_that_list_files.json',
            upload: 'url_to_the_action_to_upload_a_single_file.json',
            delete: 'url_to_the_action_to_delete_a_single_file.json',
        };
    </script>

2. Change the urls (list, upload, delete) depending on your application. You have to develop the server side as described later.

3. Create a MediaUploader instance. Usage Example:


__HTML__
    <input type="hidden" name="file" id="file">
    <script>
        MediaUploader.FileSelector("#file");
    </script>

Server side
-----------

You have to develop this part because this repository only includes the client side.

url_to_the_action_that_list_files.json
--------------------------------------

url_to_the_action_to_upload_a_single_file.json
----------------------------------------------

url_to_the_action_to_delete_a_single_file.json
----------------------------------------------

   
