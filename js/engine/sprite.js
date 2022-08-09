'use strict'

/**
 * スプライトに関してのクラス
 */
class Sprite {

    /**
     * 引数
     * img : 画像ファイルまでのパス
     * width : 画像の表示する範囲（横幅）
     * height : 画像の表示する範囲（縦幅）
     */
    constructor( img, width, height ) {
        //this.imgに、あなたは画像ですよ、と教える
        this.img = new Image();
        //this.img.srcに画像ファイルまでのパスを代入
        this.img.src = img;
        //画像の初期位置
        this.x = this.y = 0;
        //画像を表示する範囲の横幅。引数widthが指定されていない場合、this.widthに32を代入
        this.width = width || 32;
        //画像を表示する範囲の縦幅。引数heightが指定されていない場合、this.heightに32を代入
        this.height = height || 32;
        //何番目の画像を表示するか
        this.frame = 0;
        //数値によってスプライトを移動させることができる（移動速度）
        this.vx = this.vy = 0;
        //スプライトの位置を、数値の分、ずらすことができる
        this.shiftX = this.shiftY = 0;
        //スプライトの角度
        this.rotate = 0;
    } //constructor() 終了

    /**Gameクラスのメインループからずっと呼び出され続ける
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    update( canvas ) {
        //画像などを画面に表示するためのメソッドを呼び出す
        this.render( canvas );
        //スプライトを動かしたり、なにかのきっかけでイベントを発生させたりするために使うメソッドを呼び出す
        this.onenterframe();
        //スプライトを移動する
        this.x += this.vx;
        this.y += this.vy;
    } //update() 終了

    /**
     * 画像などを画面に表示するためのメソッド
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    render( canvas ) {
        //キャンバスの外にスプライトがあるとき、ここでこのメソッドを終了する
        if ( this.x + this.shiftX < -1 * this.width || this.x + this.shiftX > canvas.width ) return;
        if ( this.y + this.shiftY < -1 * this.height || this.y + this.shiftY > canvas.height ) return;

        //X,Y方向に、何番目の画像か
        const _frameX = this.frame % ( this.img.width / this.width );
        const _frameY = ~~( this.frame / ( this.img.width / this.width ) );

        //画家さん（コンテキスト）を呼ぶ
        const _ctx = canvas.getContext( '2d' );
        //スプライトを回転させるときの中心位置を変更するための、canvasの原点の移動量
        const _translateX = this.x + this.width/2 + this.shiftX;
        const _translateY = this.y + this.height/2 + this.shiftY;
        //描画状態を保存する
        _ctx.save();
        //canvasの原点の移動
        _ctx.translate( _translateX, _translateY );
        //canvasを回転
        _ctx.rotate( this.rotate * Math.PI / 180 );
        //移動したcanvasの原点を戻す
        _ctx.translate( -1*_translateX, -1*_translateY );
        //画家さんに、絵を描いてとお願いする
        _ctx.drawImage(
            this.img,
            this.width * _frameX,
            this.height * _frameY,
            this.width,
            this.height,
            this.x + this.shiftX,
            this.y + this.shiftY,
            this.width,
            this.height
        );
        //保存しておいた描画状態に戻す
        _ctx.restore();
    } //render() 終了

    /**
     * タッチした指の、相対的な位置（タッチしたオブジェクトの左上からの位置）を取得できるメソッド
     *
     * 引数
     * fingerPosition : 指の位置の座標
     */
    getRelactiveFingerPosition( fingerPosition ) {
        //タッチしたものの、左上部分からの座標
        const _relactiveFingerPosition = {
            x: fingerPosition.x - this.x - this.shiftX,
            y: fingerPosition.y - this.y - this.shiftY
        };

        //数値が範囲内にあるかどうかを取得できる関数
        const inRange = ( num, min, max ) => {
            //数値が範囲内にあるかどうか
            const _inRange = ( min <= num && num <= max );
            //結果を返す
            return _inRange;
        }

        //タッチした位置がオブジェクトの上の場合、相対的な位置を返す
        if ( inRange( _relactiveFingerPosition.x, 0, this.width ) && inRange( _relactiveFingerPosition.y, 0, this.height ) ) return _relactiveFingerPosition;
        //オブジェクトから外れていれば、falseを返す
        return false;
    } //getRelactiveFingerPosition() 終了

    /**
     * タッチイベントを割り当てるためのメソッド
     *
     * 引数
     * eventType : イベントのタイプ
     * fingerPosition : 指の位置
     */
    assignTouchevent( eventType, fingerPosition ) {
        //相対的な座標（タッチしたオブジェクトの、左上からの座標）を取得
        const _relactiveFingerPosition = this.getRelactiveFingerPosition( fingerPosition );

        //イベントのタイプによって呼び出すメソッドを変える
        switch ( eventType ) {
            case 'touchstart' :
                //指の場所がスプライトの上にあるとき、ontouchstartメソッドを呼び出す
                if ( _relactiveFingerPosition ) this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
            case 'touchmove' :
                //指の場所がスプライトの上にあるとき、ontouchmoveメソッドを呼び出す
                if ( _relactiveFingerPosition ) this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
            case 'touchend' :
                //ontouchendメソッドを呼び出す
                this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
        }
    } //assignTouchevent() 終了

    /**
     * 常に呼び出され、スプライトの移動やイベントの発生などに使うメソッド。空なのはオーバーライド（上書き）して使うため
     */
    onenterframe() {}

    /**
     * タッチされたときに呼び出される
     */
    ontouchstart() {}

    /**
     * 指が動かされたときに呼び出される
     */
    ontouchmove() {}

    /**
     * 指がはなされたときに呼び出される
     */
    ontouchend() {}

}