'use strict'

/**
 * シーンに関してのクラス
 */
class Scene {

    constructor() {
        this.objs = [];
    } //constructor() 終了

    /**
     * シーンにオブジェクトを追加するときに呼び出されるメソッド
     *
     * 引数
     * obj : スプライトやテキストなど（オブジェクト）
     */
    add( obj ) {
        //引数がSprite、Text、Tilemapのとき、this.objsの末尾にobjを追加
        if ( obj instanceof Sprite || obj instanceof Text || obj instanceof Tilemap ) this.objs.push( obj );
        //引数がSprite、Text、Tilemapでなければ、コンソールにエラーを表示
        else console.error( 'Sceneに追加できるのはSprite、Text、Tilemapだけだよ！' );
    } //add() 終了

    /**Gameクラスのメインループからずっと呼び出され続ける
     *
     * 引数
     * canvas : 紙（キャンバス）
     */
    update( canvas ) {
        //スプライトを動かしたり、なにかのきっかけでイベントを発生させたりするために使うメソッドを呼び出す
        this.onenterframe();
    } //update() 終了

    /**
     * タッチイベントを割り当てるためのメソッド
     *
     * 引数
     * eventType : イベントのタイプ
     * fingerPosition : 指の位置
     */
    assignTouchevent( eventType, fingerPosition ) {
        //イベントのタイプによって呼び出すメソッドを変える
        switch ( eventType ) {
            case 'touchstart' :
                //現在のシーンのtouchstartメソッドを呼び出す
                this.ontouchstart( fingerPosition.x, fingerPosition.y );
                break;
            case 'touchmove' :
                //現在のシーンのtouchmoveメソッドを呼び出す
                this.ontouchmove( fingerPosition.x, fingerPosition.y );
                break;
            case 'touchend' :
                //現在のシーンのtouchendメソッドを呼び出す
                this.ontouchend( fingerPosition.x, fingerPosition.y );
                break;
        }

        //シーンにあるオブジェクトの数だけ繰り返す
        for ( let i=0; i<this.objs.length; i++ ) {
            //シーンにあるオブジェクトの、タッチイベントを割り当てるためのメソッドを呼び出す
            this.objs[i].assignTouchevent( eventType, fingerPosition );
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

    /**
     * シーンが切り替わったときに呼び出される
     */
    onchangescene() {}

}