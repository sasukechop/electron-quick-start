'use strict'

/**
 * タイルに関してのクラス
 */
class Tile extends Sprite {

    /**
     * 引数
     * img : 画像ファイルまでのパス
     * size : タイルの大きさ
     */
    constructor( img, size ) {
        //親クラスのコンストラクタを呼び出す
        super( img, size, size );
        //引数sizeが指定されていない場合、this.sizeに32を代入
        this.size = size || 32;
        //マップ座標に0を代入。（マップ座標は、タイルマップの左上から何番目のタイルの位置にあるのか、という意味でここでは使っています）
        this.mapX = this.mapY = 0;
        //タイルマップと同期して動くかどうか
        this.isSynchronize = true;
    } //constructor() 終了

    /**
     * タイル同士が重なっているかどうかを取得できるメソッド
     *
     * 引数
     * tile : 重なっているかを判定したいタイル
     */
    isOverlapped( tile ) {
        //引数がTileのとき
        if ( tile instanceof Tile ) {
            //タイル同士が重なっているかどうか
            const _isOverlapped = ( this.mapX === tile.mapX && this.mapY === tile.mapY );
            //タイル同士が重なっているかどうかの結果を返す
            return _isOverlapped;
        }
        //引数がTileでなければ、コンソールにエラーを表示
        else console.error( 'Tilemapに追加できるのはTileだけだよ！' );
    } //isOverlapped() 終了

}