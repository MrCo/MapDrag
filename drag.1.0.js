/**
 * 城市拖动、位置定位
 * User: KeZhong
 * Date: 13-7-17
 * Time: 下午3:31
 * Email:co.mr.co@gmail.com
 * Version:1.0
 */
(function(w){
    var $cityItems = $('ul#cityItems'),
        $mapBox = $('#mapBox'),
        $dragLayer = $('div.drag_layer_box'),
        $doc = $(document),
        $body = $(document.body),
        $curDrag,
        _dragID = 'dragLayer',
        _left = 0,
        _top = 0,
        _dragMove = false;

    var dragLayer = function(top,left,name){
        var _layer = '<div id="'+ _dragID +'" class="drag_layer_box" style=" opacity:0.5; top:'+ top +'px; left:'+ left +'px;">'+ name +'<i class="drag_box_del" title="删除" onclick="$(this).parent().remove()">×</i></div>';
        $body.append(_layer);
        $curDrag = $('#' + _dragID);
    }

    var mouseDownHandler = function(e){
        var $cur = $(this);
            _left = $cur.offset().left;
            _top = $cur.offset().top;
        switch(e.target.nodeName.toLowerCase()){
            case 'li':
                dragLayer(_top,_left,$cur.text());
                break;
            case 'div':
                $curDrag = $cur;
                $cur.children('i').hide();
                break;
            default:
                return;
        }
        _dragMove = true;
    }

    var dragBoxOverHandler = function(){
        var _$cur = $(this),
            _$i = _$cur.children('i');
        if(_dragMove) return;
        _$i.show();
    }

    var dragBoxOutHandler = function(){
        var _$cur = $(this),
            _$i = _$cur.children('i');
        if(_dragMove) return;
        _$i.hide();
    }

    var mouseMoveHandler = function(e){
        if(!_dragMove) return;
        $curDrag.css({ top: e.clientY - $curDrag.height() / 2 + 'px', left: e.clientX - $curDrag.width() / 2 + 'px' });
    }

    var mouseUpHandler = function(e){
        var _offset =$curDrag.offset(),
            _mapOffset = $mapBox.offset(),
            _mapWidth = $mapBox.width(),
            _mapHeight = $mapBox.height(),
            _mapLeft = _mapOffset.left,
            _mapTop = _mapOffset.top;
        if(_offset.left < _mapLeft || _offset.left > (_mapWidth + _mapLeft) || _offset.top < _mapTop || _offset.top > (_mapHeight + _mapTop)){
            $curDrag.animate({ top: _top + 'px', left: _left + 'px' }, 200, function () {
                if($(this).attr('inbox') != 'inbox'){ $(this).remove(); }
             });
        }else{
            $mapBox.append($('#' + _dragID).attr('inbox','inbox').removeAttr('id').css({ opacity:1, backgroundColor:'transparent' }));
            $('#' + _dragID).remove();
        }
        _dragMove = false;
    }

    $cityItems.children('li').bind('mousedown',mouseDownHandler);
    $doc.bind('mousemove',mouseMoveHandler).bind('mouseup',mouseUpHandler);
    $dragLayer.live('mousedown',mouseDownHandler).live('mouseover',dragBoxOverHandler).live('mouseout',dragBoxOutHandler);
})(window)