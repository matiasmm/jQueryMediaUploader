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
HTML:
    <!-- you need a name to save the file id setted with jQueryMediaUploader. Value="1" if you are editing, if it's a new entity leave it empty -->
    <input type="hidden" name="file_id" value="1">

Javascript: 
    MediaUploader.FileSelector("#file_id");


Selecting Multiple files
------------------------
HTML:
    <!-- Again, i'm supposing you are editing -->
    <input type="hidden" class="group" name="file_id[]" value="1">
    <input type="hidden" class="group" name="file_id[]" value="2">

Javascript: 
    MediaUploader.FileSelector(".group", {
        multiple: true
    });

You are going to get one button for selecting files multiple files, (not 2 buttons for each hidden).


Using categories
----------------
HTML:
    <!-- Again, i'm supposing you are editing -->
    <input type="hidden" class="group" name="file_id[]" value="1">
    <input type="hidden" class="group" name="file_id[]" value="2">

Javascript: 
    MediaUploader.FileSelector(".group", {
        multiple: true,
        categories: ['guitars', 'drums', 'cities', 'top models']
    });

This categories are mainly usefull for interacting with the server side. In the server side, you recive this categories, to list the selectable files.
When you upload a new file, it provides you a combo box to choose one of this categories.

   