<?php
/**
 * This is a prototype of the server side
 *
 */
if($_GET['action'] == 'list'){
    echo json_encode(
        array(
            'files' => array(
               array(
                    'id' => 1, //mandatory
                    'type' => 'image', //mandatory
                    'src' => 'http://farm2.static.flickr.com/1233/1304237864_7a4aeb2bbd.jpg', 
                    'category' => 'guitars',
                    'height' => '100',
                    'width' => '100',
                   'description' => "Description Test Lorem Ipsum",
               ),
               array(
                    'id' => 2, //mandatory
                    'type' => 'image', //mandatory
                    'src' => 'http://t2.gstatic.com/images?q=tbn:ANd9GcRCNdcXr6Mn18kc069JtQFywX6oYr4O2LtleXsUC8iNiUaSmpjH', 
                    'category' => 'guitars', 
                    'height' => '100',
                    'width' => '100',
                ),
               array(
                    'id' => 3, //mandatory
                    'type' => 'image', //mandatory
                    'src' => 'http://t2.gstatic.com/images?q=tbn:ANd9GcRCNdcXr6Mn18kc069JtQFywX6oYr4O2LtleXsUC8iNiUaSmpjH', 
                    'category' => 'pianos', 
                    'height' => '100',
                    'width' => '100',
                   'description' => "Description test",
                ),


            )
        )
    );
}

if($_GET['action'] == 'upload'){
    /*
     * Save the file in database and filesystem with this info.
     *
     ///// $_POST //////
    array
        'd' => string 'dafs' (length=4)
        'category' => string 'rubros' (length=6)
        'submit' => string 'Upload' (length=6)

     ///// $_FILES //////
    array
    'f' => 
        array
            'name' => string 'uploaded_image.png' (length=14)
            'type' => string 'image/png' (length=9)
            'tmp_name' => string '/tmp/phpcOZS6h' (length=14)
            'error' => int 0
            'size' => int 738062
     */
    sleep(1);
    /**
     * File you just uploaded info
     */
    echo json_encode(array(
            'status' => 'success',
            'file' => array(
                    'id' => 1000, //mandatory
                    'type' => 'image', //mandatory
                    'src' => 'http://farm2.static.flickr.com/1233/1304237864_7a4aeb2bbd.jpg', 
                    'category' => 'drums', 
                    'height' => '100',
                    'width' => '100',
                    'description' => "Description test",
               )));
}

