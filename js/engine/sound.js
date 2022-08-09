'use strict'

/**
 * Audioを使いやすくしたSoundクラス
 * Gameクラスから呼び出して使うので、普段は使わない
 */
class Sound extends Audio {

    /**
     * 引数
     * src : 音声ファイルまでのパス
     */
    constructor( src ) {
        //親クラスのコンストラクタを呼び出す
        super( src );
        //autoplayを無効にする
        this.autoplay = false;
    } //constructor() 終了

    /**
     * 音声を再生するためのメソッド
     */
    start() {
        //ミュートを無効にする
        this.muted = false;
        //音声を再生
        this.play();
    } //start() 終了

    /**
     * 音声をループで再生するためのメソッド
     */
    loop() {
        //ループ再生されるようにする（superを使っているのは、Soundクラスにloopメソッドがあるため）
        super.loop = true;
        //音声を再生するメソッドを呼び出す
        this.start();
    } //loop() 終了

    /**
     * 音声をストップするためのメソッド
     */
    stop() {
        //音声を一時停止する
        this.pause();
        //再生場所を最初に戻す
        this.currentTime = 0;
    } //stop() 終了

}