<?php
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

function editor_html($id, $content, $is_dhtml_editor=true)
{
    global $g5, $config;
    static $js = true;

    $editor_url = G5_EDITOR_URL.'/'.$config['cf_editor'];

    $html = "";
    $html .= "<span class=\"sound_only\">썸머노트 시작</span>";

	if ($is_dhtml_editor && $js) {

        ob_start();
?>
<link rel="stylesheet" href="<?php echo $editor_url ?>/summernote.css">
<script src="<?php echo $editor_url ?>/summernote.js"></script>
<script src="<?php echo $editor_url ?>/lang/summernote-ko-KR.js"></script>
<script src="<?php echo $editor_url ?>/plugin/summernote-ext-hello.js"></script>
<script src="<?php echo $editor_url ?>/plugin/uploadfile/summernote-ext-uploadfile.js"></script>
<!-- <script src="<?php echo $editor_url ?>/plugin/summernote-ext-gmap.js"></script> -->
<script src="<?php echo $editor_url ?>/plugin/summernote-video-attributes.js"></script>
<script src="<?php echo $editor_url ?>/plugin/summernote-map-plugin.js"></script>

<script>
var summernote_url = "<?php echo $editor_url ?>";
</script>
<script src="<?php echo $editor_url ?>/editor.js"></script>
<?php       
        $html .= ob_get_contents();
        ob_end_clean();

        $js = false;
    }

    $summernote_class = $is_dhtml_editor ? "summernote" : "";
    $html .= "\n<textarea id=\"$id\" name=\"$id\" class=\"$summernote_class\" >$content</textarea>";
    $html .= "\n<span class=\"sound_only\">썸머노트 끝</span>";
    return $html;
}


// textarea 로 값을 넘긴다. javascript 반드시 필요
function get_editor_js($id, $is_dhtml_editor=true)
{
    if ($is_dhtml_editor) {
        return "var {$id}_editor_data = $('#{$id}').summernote('code');";
    } else {
        return "var {$id}_editor = document.getElementById('{$id}');\n";
    }
}


//  textarea 의 값이 비어 있는지 검사
function chk_editor_js($id, $is_dhtml_editor=true)
{
    if ($is_dhtml_editor) {
        return "if (!{$id}_editor_data) { alert(\"내용을 입력해 주십시오.\"); $('#{$id}').summernote('focus'); return false; }\n";
    } else {
        return "if (!{$id}_editor.value) { alert(\"내용을 입력해 주십시오.\"); {$id}_editor.focus(); return false; }\n";
    }
}

?>
