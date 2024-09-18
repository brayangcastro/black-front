<?php


   $id_prod= $_REQUEST['ID_Prod'];
  echo "ID:".$id_prod;

if (isset($_FILES['uploadedFile']) && $_FILES['uploadedFile']['error'] === UPLOAD_ERR_OK) {
           
            
        $fileTmpPath = $_FILES['uploadedFile']['tmp_name'];
        $fileName = $_FILES['uploadedFile']['name'];
        $fileSize = $_FILES['uploadedFile']['size'];
        $fileType = $_FILES['uploadedFile']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        
        $newFileName2 = 'sku-'.$id_prod . '.' . $fileExtension;
        
        
        $allowedfileExtensions = array('jpg', 'gif', 'png', 'zip', 'txt', 'xls', 'doc');
        if (in_array($fileExtension, $allowedfileExtensions)) {
           
        $uploadFileDir = './uploaded_files/';
        $dest_path = $uploadFileDir . $newFileName2;
         
                if(move_uploaded_file($fileTmpPath, $dest_path))
                {
                  $message ='Imagen cargada correctamente.';
                  echo $message;
                  $maxDim = 600;
                    $file_name = $_FILES['uploadedFile']['tmp_name'];
                    list($width, $height, $type, $attr) = getimagesize( $file_name );
                    if ( $width > $maxDim || $height > $maxDim ) {
                        $target_filename = $file_name;
                        $ratio = $width/$height;
                        if( $ratio > 1) {
                            $new_width = $maxDim;
                            $new_height = $maxDim/$ratio;
                        } else {
                            $new_width = $maxDim*$ratio;
                            $new_height = $maxDim;
                        }
                        $src = imagecreatefromstring( file_get_contents( $file_name ) );
                        $dst = imagecreatetruecolor( $new_width, $new_height );
                        imagecopyresampled( $dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
                        imagedestroy( $src );
                        imagepng( $dst, $target_filename ); // adjust format as needed
                        imagedestroy( $dst );
                        $message = 'resize.';
                   echo $message;
                    }

                }
                else
                {
                  $message = 'Hubo un error.';
                   echo $message;
                }
        }

}
 
?>