'use strict'

/**
 * テキストに関してのクラス
 */
class Text {

    /**
     * 引数
     * text : 表示する文字列
     */
    constructor( text ) {
        //this.textに表示する文字列を代入
        this.text = text;
        //デフォルトのフォントを指定
        this.font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
        //テキストを表示する位置
        this.x = this.y = 0;
        //数値によってテキストを移動させることができる（移動速度）
        this.vx = this.vy = 0;
        //テキストのベースラインの位置
        this.baseline = 'top';
        //テキストのサイズ
        this.size = 20;
        //テキストの色
        this.color = '#ffffff';
        //テキストの太さ
        this.weight = 'normal';
        //テキストの幅
        this._width = 0;
        //テキストの高さ
        this._height = 0;
        //テキストを左右中央の位置にするかどうか
        this._isCenter = false;
        //テキストを上下中央の位置にするかどうか
        this._isMiddle = false;
    } //constructor() 終了

    /**
     * 呼び出すと、テキストを左右中央の位置に配置できるメソッド
     */
    center() {
        //テキストを左右中央の位置に配置するかどうかのプロパティにtrueを代入
        this._isCenter = true;
        //thisを返すことで、メソッドをチェーンにすることができる
        return this;
    } //center() 終了

    /**
     * 呼び出すと、テキストを上下中央の位置に配置できるメソッド
     */
    middle() {
        //テキストのベースラインの位置を変更
        this.baseline = 'middle'
        //テキストを上下中央の位置に配置するかどうかのプロパティにtrueを代入
        this._isMiddle = true;
        //thisを返すことで、メソッドをチェーンにすることができる
        return this;
    } //middle() 終了

    /**Gameクラスのメインループからずっと呼び出され続ける
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    update( canvas ) {
        //画家さん（コンテキスト）を呼ぶ
        const _ctx = canvas.getContext( '2d' );

        //テキストの太さ、サイズ、フォントを設定
        _ctx.font = `${this.weight} ${this.size}px ${this.font}`;
        //テキストの色を設定
        _ctx.fillStyle = this.color;
        //テキストのベースラインの位置を設定
        _ctx.textBaseline = this.baseline;

        //テキストの幅を計算
        this._width = _ctx.measureText( this.text ).width;
        //テキストの高さを計算
        this._height = Math.abs( _ctx.measureText( this.text ).actualBoundingBoxAscent ) + Math.abs( _ctx.measureText( this.text ).actualBoundingBoxDescent );

        //テキストを左右中央に配置したいときの、X座標の計算
        if ( this._isCenter ) this.x = ( canvas.width - this._width ) / 2;
        //テキストを上下中央に配置したいときの、Y座標の計算
        if ( this._isMiddle ) this.y = canvas.height / 2;

        //画像などを画面に表示するためのメソッドを呼び出す
        this.render( canvas, _ctx );
        //テキストを動かしたりするために使うメソッドを呼び出す
        this.onenterframe();

        //テキストを移動する
        this.x += this.vx;
        this.y += this.vy;
    } //update() 終了

    /**
     * テキストを画面に表示するためのメソッド
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    render( canvas, ctx ) {
        //画面の外にテキストがあるとき、表示しないようにする
        if ( this.x < -1 * this._width || this.x > canvas.width ) return;
        if ( this.y < -1 * this._height || this.y > canvas.height + this._height ) return;
        //テキストを表示
        ctx.fillText( this.text, this.x, this.y );
    } //render() 終了

    /**
     * タッチした指の、相対的な位置（タッチしたオブジェクトの左上からの位置）を取得できるメソッド
     *
     * 引数
     * fingerPositionX : 指の位置の座標
     */
    getRelactiveFingerPosition( fingerPosition ) {
        //タッチしたテキストの、左上部分からの座標。テキストのbaselineによって位置を調節する
        let _relactiveFingerPosition = {
            x: fingerPosition.x - this.x,
            y: fingerPosition.y - this.y + this._height
        };
        if ( this.baseline === 'top' || this.baseline === 'hanging' ) {
            _relactiveFingerPosition = {
                x: fingerPosition.x - this.x,
                y: fingerPosition.y - this.y
            };
        }
        if ( this.baseline === 'middle' ) {
            _relactiveFingerPosition = {
                x: fingerPosition.x - this.x,
                y: fingerPosition.y - this.y + this._height/2
            };
        }

        //数値が範囲内にあるかどうかを取得できる関数
        const inRange = ( num, min, max ) => {
            //数値が範囲内にあるかどうか
            const _inRange = ( min <= num && num <= max );
            //結果を返す
            return _inRange;
        }

        //タッチした位置がオブジェクトの上の場合、相対的な位置を返す
        if ( inRange( _relactiveFingerPosition.x, 0, this._width ) && inRange( _relactiveFingerPosition.y, 0, this._height ) ) return _relactiveFingerPosition;
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
                //指の場所がテキストの上にあるとき、ontouchstartメソッドを呼び出す
                if ( _relactiveFingerPosition ) this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
            case 'touchmove' :
                //指の場所がテキストの上にあるとき、ontouchmoveメソッドを呼び出す
                if ( _relactiveFingerPosition ) this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
            case 'touchend' :
                //ontouchendメソッドを呼び出す
                this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
                break;
        }
    } //assignTouchevent() 終了

    /**
     * 常に呼び出されるメソッド。空なのはオーバーライド（上書き）して使うため
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