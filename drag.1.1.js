/**
 * 城市拖动、位置定位
 * User: KeZhong
 * Date: 13-7-17
 * Time: 下午3:31
 * Email:co.mr.co@gmail.com
 * Version:1.1
 */
(function(w){
    var coDrag = function(settings){
        this.Setting = $.extend({
            $cityItems:$(settings.dragList),
            $mapBox:$(settings.dragContainer),
            $dragLayer:$('div.drag_layer_box'),
            $doc:$(document),
            $body:$(document.body),
            $curDrag:null,
            dragID:'dragLayer',
            left:0,
            top:0,
            dragMove:false
        },settings);
    }

    coDrag.prototype.dragLayer = function(top,left,name){
        var _setting = this.Setting,
            _layer = '<div id="'+ _setting.dragID +'" class="drag_layer_box" style=" opacity:0.5; top:'+ _setting.top +'px; left:'+ _setting.left +'px;">'+ name +'<i class="drag_box_del" title="删除" onclick="$(this).parent().remove()">×</i></div>';
        _setting.$body.append(_layer);
        _setting.$curDrag = $('#' + _setting.dragID);
    }

    coDrag.prototype.eventHandler = {
        mouseDown:function(e,drag){
            var $cur = $(this),
                _setting = drag.Setting;

            _setting.left = $cur.offset().left;
            _setting.top = $cur.offset().top;

            switch(e.target.nodeName.toLowerCase()){
                case 'li':
                    drag.dragLayer(_setting.top,_setting.left,$cur.text());
                    break;
                case 'div':
                    _setting.$curDrag = $cur;
                    $cur.children('i').hide();
                    break;
                default:
                    return;
            }
            _setting.dragMove = true;
        },
        dragBoxOver:function(e,drag){
            var _$cur = $(this),
                _setting = drag.Setting,
                _$i = _$cur.children('i');
            if(_setting.dragMove) return;
            _$i.show();
        },
        dragBoxOut:function(e,drag){
            var _$cur = $(this),
                _setting = drag.Setting,
                _$i = _$cur.children('i');
            if(_setting.dragMove) return;
            _$i.hide();
        },
        mouseMove:function(e,drag){
            var _setting = drag.Setting,
                _mapOffset = _setting.$mapBox.offset(),
                _mapLeft = _mapOffset.left,
                _mapTop = _mapOffset.top;

            if(!_setting.dragMove) return;

            if(_setting.$curDrag.attr('inbox') != 'inbox')
                _setting.$curDrag.css({ top: e.clientY - _setting.$curDrag.height() / 2 + 'px', left: e.clientX - _setting.$curDrag.width() / 2 + 'px' });
            else
                _setting.$curDrag.css({ top: e.clientY - _mapTop - _setting.$curDrag.height() / 2 + 'px', left: e.clientX - _mapLeft - _setting.$curDrag.width() / 2 + 'px' });
        },
        mouseUp:function(e,drag){
            if(!drag.Setting.$curDrag) return;
            var _setting = drag.Setting,
                _offset = _setting.$curDrag.offset(),
                _mapOffset = _setting.$mapBox.offset(),
                _mapWidth = _setting.$mapBox.width(),
                _mapHeight = _setting.$mapBox.height(),
                _mapLeft = _mapOffset.left,
                _mapTop = _mapOffset.top,
                _$drag,
                _dragOffset,
                _dragLeft,
                _dragTop;

            if(_offset.left < _mapLeft || _offset.left > (_mapWidth + _mapLeft) || _offset.top < _mapTop || _offset.top > (_mapHeight + _mapTop)){
                _setting.$curDrag.animate({ top: _setting.top + 'px', left:_setting.left + 'px' }, 200, function () {
                    if($(this).attr('inbox') != 'inbox'){ $(this).remove(); }
                });
            }else if(_setting.$curDrag.attr('inbox') != 'inbox'){
                _$drag = $('#' + _setting.dragID);
                _dragOffset = _$drag.offset();
                _dragLeft = _dragOffset.left;
                _dragTop = _dragOffset.top;
                _setting.$mapBox.append(_$drag.attr('inbox','inbox').removeAttr('id').css({ opacity:1, backgroundColor:'transparent',left:_dragLeft - _mapLeft, top:_dragTop - _mapTop }));
                $('#' + _setting.dragID).remove();
            }

            _setting.dragMove = false;
        }
    }

    coDrag.prototype.getValue = function(){
        var _setting = this.Setting,
            _$mapBox = _setting.$mapBox,
            _mapOffset = _$mapBox.offset(),
            _mapLeft = _mapOffset.left,
            _mapTop = _mapOffset.top,
            _value = [];
        _$mapBox.children('div').each(function(){
            var _$cur = $(this),
                _position = _$cur.position(),
                _left = _position.left,
                _top = _position.top,
                _name = _$cur.text().replace('×','');
            _value.push('{ NAME:"'+ _name +'", X:'+ _left +', Y:'+ _top +' }');
        });
        return _value;
    }

    coDrag.prototype.setValue = function(data){
        var _setting = this.Setting,
            _$mapBox = _setting.$mapBox,
            _nodeList = '';
        for(var i = 0,_count = data.length; i < _count; i++){
            var _tempData = data[i],
                _arrow = _tempData.STATE == '0' ? '<font color="red">·</font>' : '<font color="black">·</font>';
            _nodeList += '<div class="drag_layer_box" inbox="inbox" style=" background-color:transparent; top:'+ _tempData.Y +'px; left:'+ _tempData.X +'px;">'+ _arrow + _tempData.NAME +'</div>';
        }
        _$mapBox.append(_nodeList);
    }

    coDrag.prototype.init = function(){
        var _coThis = this;
            _event = _coThis.eventHandler,
            _setting = _coThis.Setting;
        _setting.$cityItems.children('li').bind('mousedown',function(e){ _event.mouseDown.call(this,e,_coThis); });
        _setting.$doc.bind('mousemove',function(e){ _event.mouseMove.call(this,e,_coThis); }).bind('mouseup',function(e){ _event.mouseUp.call(this,e,_coThis); });
        _setting.$dragLayer.live('mousedown',function(e){ _event.mouseDown.call(this,e,_coThis); }).live('mouseover',function(e){ _event.dragBoxOver.call(this,e,_coThis); }).live('mouseout',function(e){ _event.dragBoxOut.call(this,e,_coThis); });
        return _coThis;
    }

    w.CoDrag = function(settings){
        var _drag = new coDrag(settings).init();
        return {
            getValue:function(){ return _drag.getValue(); },
            setValue:function(data){ _drag.setValue(data); }
        }
    };
})(window)