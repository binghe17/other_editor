<?php
include_once("./_common.php");

$success = $error = '';
if(is_uploaded_file($_FILES['SummernoteFile']['tmp_name'])) {

	$ym = date('ym', G5_SERVER_TIME);

	$data_dir = G5_DATA_PATH.'/editor/'.$ym.'/';
	$data_url = G5_DATA_URL.'/editor/'.$ym.'/';

	@mkdir($data_dir, G5_DIR_PERMISSION);
	@chmod($data_dir, G5_DIR_PERMISSION);

	$tmp_name = $_FILES['SummernoteFile']['tmp_name'];
	$filename = basename($_FILES['SummernoteFile']['name']);

	if (!preg_match("/(pdf|xls|doc|zip|rar)$/i", apms_get_ext($filename))) { 
		@unlink($tmp_name);
		$error = 'E1';
	} else if (!getimagesize($tmp_name)) {
		@unlink($tmp_name);
		$error = 'E2';
	} else {
		$chars_array = array_merge(range(0,9), range('a','z'), range('A','Z'));
		shuffle($chars_array);
		$shuffle = implode('', $chars_array);
		$file_name = abs(ip2long($_SERVER['REMOTE_ADDR'])).'_'.substr($shuffle,0,8).'_'.replace_filename($filename);
		$save_dir = sprintf('%s/%s', $data_dir, $file_name);
        $save_url = sprintf('%s/%s', $data_url, $file_name);
		
		@move_uploaded_file($tmp_name, $save_dir);

		@chmod($save_dir, G5_FILE_PERMISSION);

		$success = $save_url;
	}
} else {
	// refer to error code : http://www.php.net/manual/en/features.file-upload.errors.php
	$error = $_FILES['SummernoteFile']['error'];
	if(!$error) $error = 'E3';
}

// Result
if($success) {
	echo '1|'.$success;
} else {
	switch($error) {
		case '1'	: $error = '업로드 용량 제한에 걸렸습니다.'; break; 
		case '2'	: $error = '업로드 용량 제한에 걸렸습니다.'; break;
		case '3'	: $error = '파일이 일부분만 전송되었습니다.'; break;
		case '4'	: $error = '파일이 전송되지 않았습니다.'; break;
		case '6'	: $error = '임시 폴더가 없어 업로드 할 수 없습니다.'; break;
		case '7'	: $error = '파일 쓰기에 실패했습니다.'; break;
		case '8'	: $error = '알수 없는 오류입니다.'; break;
		case 'E1'	: $error = '제한된 파일 격식입니다. pdf, xls, doc, zip, rar 파일만 올리실 수 있습니다.'; break; 
		case 'E2'	: $error = '0 byte 파일은 업로드 할 수 없습니다.'; break; 
		default		: $error = '오류가 발생하였습니다.'; break;
	}
	echo '0|'.$error;
}
?>