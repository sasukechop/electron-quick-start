'use strict'

/**
 * キャラクタータイルに関するクラス
 */
class CharacterTile extends Tile {

    /**
     * 引数
     * img : 画像ファイルまでのパス
     * size : タイルの一辺の長さ
     *
     * ※注意
     * directionやanimationを指定すると自動的にスプライト画像も変更されるが、画像自体を対応したものにする必要がある
     * CharacterTileクラスで、frameを使うことはできない
     */
    constructor( img, size ) {
        //親クラスのコンストラクタを呼び出す
        super( img, size );
        //キャラクターの向き（0:正面 1:左 2:右 3:後ろ）
        this.direction = 0;
        //スプライトのアニメーション。1が通常。0~2を切り替えることで、歩いているアニメーションを作ることができる
        this.animation = 1;
    } //constructor() 終了

    /**
     * 画像などを画面に表示するためのメソッド
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    render( canvas ) {
        //画面の外にスプライトがあるとき、表示しないようにする
        if ( this.x + this.shiftX < -1 * this.size || this.x + this.shiftX > canvas.width ) return;
        if ( this.y + this.shiftY < -1 * this.size || this.y + this.shiftY > canvas.height ) return;
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
            this.size * this.animation,
            this.size * this.direction,
            this.size,
            this.size,
            this.x + this.shiftX,
            this.y + this.shiftY,
            this.size,
            this.size
        );
        //保存しておいた描画状態に戻す
        _ctx.restore();
    } //render() 終了

}