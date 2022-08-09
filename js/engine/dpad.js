'use strict'

/**
 * D-Padに関してのクラス
 */
class DPad extends Sprite {

    /**
     * 引数
     * img : 画像ファイルまでのパス
     * size : D-Padの大きさ
     */
    constructor( img, size ) {
        //親クラスのコンストラクタを呼び出す
        super( img, size, size );
        //this.sizeに、指定されたサイズを代入
        this.size = size;
        //方向ボタンが押されているかどうか
        this.arrow = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    } //constructor() 終了

    /**
     * 画面がタッチされたときに呼ばれるメソッド
     *
     * 引数
     * fingerPositionX: タッチされたX座標
     * fingerPositionY: タッチされたY座標
     */
    ontouchstart( fingerPositionX, fingerPositionY ) {
        //_applyToDPadメソッドを呼び出す
        this._applyToDPad( fingerPositionX, fingerPositionY );
    } //ontouchstart() 終了

    /**
     * タッチされた指が動かされたときに呼ばれるメソッド
     *
     * 引数
     * fingerPositionX: 指が触れている部分のX座標
     * fingerPositionY: 指が触れている部分のY座標
     */
    ontouchmove( fingerPositionX, fingerPositionY ) {
        //_applyToDPadメソッドを呼び出す
        this._applyToDPad( fingerPositionX, fingerPositionY );
    } //ontouchmove() 終了

    /**
     * 画面から指がはなされたときに呼ばれるメソッド
     *
     * 引数
     * fingerPositionX: 指がはなされた部分のX座標
     * fingerPositionY: 指がはなされた部分のY座標
     */
    ontouchend( fingerPositionX, fingerPositionY ) {
        //画像を切り替える
        this.frame = 0;
        //ボタンを初期化
        this.arrow = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    } //ontouchend() 終了

    /**
     * D-Padに反映させる
     *
     * 引数
     * fingerPositionX: 指が触れている部分のX座標
     * fingerPositionY: 指が触れている部分のY座標
     */
    _applyToDPad( fingerPositionX, fingerPositionY ) {
        //画像を切り替える
        this.frame = 1;
        //ボタンを初期化
        this.arrow = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        //上ボタンが押されたとき、arrow.upをtrueにし、D-Padの角度を0度にする
        if ( fingerPositionX > fingerPositionY && fingerPositionX < this.size - fingerPositionY ) {
            this.arrow.up = true;
            this.rotate = 0;
        }
        //下ボタンが押されたとき、arrow.downをtrueにし、D-Padの角度を180度にする
        else if ( fingerPositionX > this.size - fingerPositionY && fingerPositionX < fingerPositionY ) {
            this.arrow.down = true;
            this.rotate = 180;
        }
        //左ボタンが押されたとき、arrow.leftをtrueにし、D-Padの角度を270度にする
        else if ( fingerPositionY > fingerPositionX && fingerPositionY < this.size - fingerPositionX ) {
            this.arrow.left = true;
            this.rotate = 270;
        }
        //右ボタンが押されたとき、arrow.rightをtrueにし、D-Padの角度を90度にする
        else if ( fingerPositionY > this.size - fingerPositionX && fingerPositionY < fingerPositionX ) {
            this.arrow.right = true;
            this.rotate = 90;
        }
    } //_applyToDPad() 終了
}