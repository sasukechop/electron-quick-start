'use strict'

/**
 * ゲームづくりの基本となるクラス
 */
class Game {

    /**
     * 引数
     * width : ゲームの横幅
     * height : ゲームの縦幅
     */
    constructor( width, height ) {
        //canvas要素を作成
        this.canvas = document.createElement( 'canvas' );
        //作成したcanvas要素をbodyタグに追加
        document.body.appendChild( this.canvas );
        //canvasの横幅（ゲームの横幅）を設定。もし横幅が指定されていなければ320を代入
        this.canvas.width = width || 320;
        //canvasの縦幅（ゲームの縦幅）を設定。もし縦幅が指定されていなければ320を代入
        this.canvas.height = height || 320;

        //シーンを入れておくための配列
        this.scenes = [];
        //現在のシーンをいれておくためのもの
        this.currentScene;

        //音声を入れておくためのもの
        this.sounds = [];
        //画面がすでにタッチされたかどうか
        this._isAlreadyTouched = false;
        //設定が終わったかどうか
        this._hasFinishedSetting = false;

        //プリロードは、ゲームのメイン部分が始まる前に動かしたいので、それを入れておくための配列
        this._preloadPromises = [];

        //現在のシーンを一時的に入れておくためのもの。シーンが切り替わったかどうかを判断するのに使う
        this._temporaryCurrentScene;

        //ゲームに使用するキーと、そのキーが押されているかどうかを入れるための連想配列
        //例 { up: false, down: false }
        this.input = {};
        //登録されたキーに割り当てられたプロパティ名と、キー名を、関連づけるための連想配列
        //例 { up: "ArrowUp", down: "ArrowDown" }
        this._keys = {};
    } //constructor() 終了

    /**
     * プリロードのためのメソッド
     *
     * 引数には、使いたい素材を制限なく入れることができる
     */
    preload() {
        //引数の素材を_assetsに追加
        const _assets = arguments;
        //素材の数だけ繰り返す
        for ( let i=0; i<_assets.length; i++ ) {
            //_preloadPromises[i]に、あなたはプリロードのプロミス（非同期処理をやりやすくする）だよ、と教える
            this._preloadPromises[i] = new Promise( ( resolve, reject ) => {
                //もしそのファイルの拡張子が、jpg、jpeg、png、gifのどれかのとき
                if ( _assets[i].match( /\.(jpg|jpeg|png|gif)$/i ) ) {
                    //_imgに、あなたは画像ですよ、と教える
                    let _img = new Image();
                    //img.srcに、引数で指定した画像ファイルを代入
                    _img.src = _assets[i];

                    //画像が読み込み終わったら、成功ということで、resolve()を呼び出す
                    _img.addEventListener( 'load', () => {
                        resolve();
                    }, { passive: true, once: true } );

                    //画像が読み込めなければ、エラーということで、reject()を呼び出す
                    _img.addEventListener( 'error', () => {
                        reject( `「${_assets[i]}」は読み込めないよ！` );
                    }, { passive: true, once: true } );
                }
                //もしそのファイルの拡張子が、wav、wave、mp3、oggのどれかのとき
                else if ( _assets[i].match( /\.(wav|wave|mp3|ogg)$/i ) ) {
                    //_soundに、あなたはサウンドですよ、と教える
                    let _sound = new Sound();
                    //_sound.srcに、引数で指定した音声ファイルを代入
                    _sound.src = _assets[i];
                    //this.soundsに、読み込んだ音声を入れておく
                    this.sounds[ _assets[i] ] = _sound;
                    //音声を再生する準備をする
                    this.sounds[ _assets[i] ].load();

                    //サウンドが読み込み終わったら、成功ということで、resolve()を呼び出す
                    _sound.addEventListener( 'canplaythrough', () => {
                        resolve();
                    }, { passive: true, once: true } );

                    //サウンドが読み込めなければ、エラーということで、reject()を呼び出す
                    _sound.addEventListener( 'error', () => {
                        reject( `「${_assets[i]}」は読み込めないよ！` );
                    }, { passive: true, once: true } );
                }
                //ファイルの拡張子がどれでもないとき
                else {
                    //エラーということで、reject()を呼び出す
                    reject( `「${_assets[i]}」の形式は、プリロードに対応していないよ！` );
                }
            } );
        }
    } //preload() 終了

    /**
     * プリロードなどの設定が終わったあとに実行する
     *
     * 引数
     * callback : プリロードなどの設定が終わったあとに実行したいプログラム。今回はゲームのメイン部分
     */
    main( callback ) {
        //ゲームが始まる前に実行しておきたいもの（今回はプリロード）が、すべて成功したあとに、実行したかったゲームのメイン部分「callback()」を実行
        //失敗したときはコンソールにエラーを表示
        Promise.all( this._preloadPromises ).then( result => {
            callback();
        } ).catch( reject => {
            console.error( reject );
        } );
    } //main() 終了

    /**
     * startメソッドを呼び出すことで、メインループが開始される
     */
    start() {
        //デフォルトのキーバインドを登録する（使いたいキーを登録する）
        this.keybind( 'up', 'ArrowUp' );
        this.keybind( 'down', 'ArrowDown' );
        this.keybind( 'right', 'ArrowRight' );
        this.keybind( 'left', 'ArrowLeft' );

        //現在のシーン（currentScene）になにも入っていないときは、scenes[0]を代入
        this.currentScene = this.currentScene || this.scenes[0];

        //ゲームがはじまったときと、ブラウザのサイズが変わったときに呼ばれる。縦横の比を変えずに、canvasを拡大縮小できる
        const _resizeEvent = () => {
            //ブラウザとcanvasの比率の、縦と横を計算し、小さいほうを_ratioに代入する
            const _ratio = Math.min( innerWidth / this.canvas.width, innerHeight / this.canvas.height );
            //canvasのサイズを、ブラウザに合わせて変更する
            this.canvas.style.width = this.canvas.width*_ratio + 'px';
            this.canvas.style.height = this.canvas.height*_ratio + 'px';
        } //_resizeEvent() 終了

        //ブラウザのサイズが変更されたとき、_resizeを呼び出す
        addEventListener( 'resize', _resizeEvent, { passive: true } );
        //_resizeを呼び出す
        _resizeEvent();

        //メインループを呼び出す
        this._mainLoop();

        //ユーザーの操作を待つためのメソッドを呼び出す
        this._waitUserManipulation();
        //イベントリスナーをセットする（削除）
        //this._setEventListener();（削除）
    } //start() 終了

    /**
     * イベントリスナーをセットするためのメソッド
     */
    _setEventListener() {
        //なにかキーが押されたときと、はなされたときに呼ばれる
        const _keyEvent = e => {
            //デフォルトのイベントを発生させない
            e.preventDefault();
            //_keysに登録された数だけ繰り返す
            for ( let key in this._keys ) {
                //イベントのタイプによって呼び出すメソッドを変える
                switch ( e.type ) {
                    case 'keydown' :
                        //押されたキーが、登録されたキーの中に存在するとき、inputのそのキーをtrueにする
                        if ( e.key === this._keys[key] ) this.input[key] = true;
                        break;
                    case 'keyup' :
                        //押されたキーが、登録されたキーの中に存在するとき、inputのそのキーをfalseにする
                        if ( e.key === this._keys[key] ) this.input[key] = false;
                        break;
                }
            }
        }
        //なにかキーが押されたとき
        addEventListener( 'keydown', _keyEvent, { passive: false } );
        //キーがはなされたとき
        addEventListener( 'keyup', _keyEvent, { passive: false } );

        //画面がタッチされたり、指が動いたりしたときなどに呼ばれる
        //シーンや、スプライトなどのオブジェクトの左上端から見た、それぞれの指の位置を取得できるようになる
        const _touchEvent = e => {
            //デフォルトのイベントを発生させない
            e.preventDefault();
            //タッチされた場所などの情報を取得
            const _touches = e.changedTouches[0];
            //ターゲット（今回はcanvas）のサイズ、ブラウザで表示されている部分の左上から見てどこにあるか、などの情報を取得
            const _rect = _touches.target.getBoundingClientRect();
            //タッチされた場所を計算
            const _fingerPosition = {
                x: ( _touches.clientX - _rect.left ) / _rect.width * this.canvas.width,
                y: ( _touches.clientY - _rect.top ) / _rect.height * this.canvas.height
            };
            //イベントのタイプを_eventTypeに代入
            const _eventType = e.type;
            //タッチイベントを割り当てるためのメソッドを呼び出す
            this.currentScene.assignTouchevent( _eventType, _fingerPosition );
        } //_touchEvent() 終了

        //タッチされたとき
        this.canvas.addEventListener( 'touchstart', _touchEvent, { passive: false } );
        //指が動かされたとき
        this.canvas.addEventListener( 'touchmove', _touchEvent, { passive: false } );
        //指がはなされたとき
        this.canvas.addEventListener( 'touchend', _touchEvent, { passive: false } );
    } //_setEventListener() 終了

    /**
     * ユーザーからの操作を待つためのメソッド
     */
    _waitUserManipulation() {
        //すべての音声を再生する
        const _playAllSounds = e => {
            //デフォルトのイベントを発生させない
            e.preventDefault();
            //画面にタッチされたかどうかの変数をtrueにする
            this._isAlreadyTouched = true;

            //音声を再生するためのプロミスを入れておく配列
            const _playPromises = [];

            //this.soundsの数だけ繰り返す
            //この繰り返しは、読み込まれた音声を、最初に全て同時に再生してしまおうというもの
            //こうすることで、スマホのブラウザなどの、音声を自動で流せないという制限を解決できる
            for ( let sound in this.sounds ) {
                //音声を再生する準備をする
                this.sounds[ sound ].load();
                //音声をミュートにする
                this.sounds[ sound ].muted = true;
                //音声を再生するメソッドはPromiseを返してくれるので、soundPromiseに追加
                _playPromises.push( this.sounds[ sound ].play() );
            }

            //Promiseが成功か失敗かのチェーン
            Promise.all( _playPromises ).then( () => {
                //成功した場合は全ての音をストップする
                for ( let sound in this.sounds ) {
                    this.sounds[ sound ].stop();
                }
            } ).catch( err => {
                //失敗した場合はエラーを表示
                console.log( err );
            } );

            //音声を再生するときのエラーを防ぐために、すこしだけ待つ
            setTimeout( () => {
                //イベントリスナーをセットする
                this._setEventListener();
                this._hasFinishedSetting = true;
            }, 2000 );
        } //_playAllSounds() 終了

        //タッチされたときや、なにかキーが押されたとき、_playAllSoundsを呼び出す
        this.canvas.addEventListener( 'touchstart', _playAllSounds, { passive: false, once: true } );
        addEventListener( 'keydown', _playAllSounds, { passive: false, once: true } );
    } //_waitUserManipulation() 終了

    /**
     * メインループ
     */
    _mainLoop() {
        //画家さん（コンテキスト）を呼ぶ
        const ctx = this.canvas.getContext( '2d' );
        //塗りつぶしの色に、黒を指定する
        ctx.fillStyle = '#000000';
        //左上から、画面のサイズまでを、塗りつぶす
        ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

        //もし、ユーザーがまだ画面をタッチしていない（画面を操作していない）とき、スタートパネルを表示
        if ( !this._isAlreadyTouched ) this.startPanel();
        //設定がすでに終了しているとき
        else if ( this._hasFinishedSetting ) {
            //現在のシーンのupdateメソッドを呼び出す
            this.currentScene.update();

            //一時的に入れておいたシーンが現在のシーンではないとき（シーンが切り替わったとき）、現在のシーンのonchangesceneメソッドを呼び出す
            if ( this._temporaryCurrentScene !== this.currentScene ) this.currentScene.onchangescene();

            //現在のシーンの、ゲームに登場する全てのもの（オブジェクト）の数だけ繰り返す
            for ( let i=0; i<this.currentScene.objs.length; i++ ) {
                //現在のシーンの、すべてのオブジェクトのupdateメソッドを呼び出す
                this.currentScene.objs[i].update( this.canvas );
            }

            //現在のシーンを覚えておいてもらう
            this._temporaryCurrentScene = this.currentScene;
        }

        //自分自身（_mainLoop）を呼び出して、ループさせる
        requestAnimationFrame( this._mainLoop.bind( this ) );
    } //_mainLoop() 終了

    /**
     * ゲームを開始して一番最初に表示される画面をつくるメソッド。ここでユーザーに操作してもらい、音声を出せるようにする
     */
    startPanel() {
        //表示したいテキストを_textに代入
        const _text = 'タップ、またはなにかキーを押してね！'
        //表示したいテキストのフォントを_fontに代入
        const _font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
        //フォントサイズは、ゲーム画面の横幅を20で割ったもの。（今回は表示したい文字が18文字なので、左右の余白も考え、20で割る）
        const _fontSize = this.canvas.width/20;
        //画家さん（コンテキスト）を呼ぶ
        const _ctx = this.canvas.getContext( '2d' );
        //テキストの横幅を取得
        const _textWidth = _ctx.measureText( _text ).width;
        //フォントの設定
        _ctx.font = `normal ${_fontSize}px ${_font}`;
        //ベースラインを文字の中央にする
        _ctx.textBaseline = 'middle';
        //テキストの色をグレーに設定
        _ctx.fillStyle = '#aaaaaa';
        //テキストを上下左右中央の位置に表示
        _ctx.fillText( _text, ( this.canvas.width - _textWidth )/2, this.canvas.height/2 );
    } //startPanel() 終了

    /**
     * ゲームにシーンに追加できるようになる、addメソッドを作成
     *
     * 引数
     * scene : 追加したいシーン
     */
    add( scene ) {
        //引数がSceneのとき、this.scenesの末尾にsceneを追加
        if ( scene instanceof Scene ) this.scenes.push( scene );
        //引数がSceneでなければ、コンソールにエラーを表示
        else console.error( 'Gameに追加できるのはSceneだけだよ！' );
    } //add()終了

    /**
     * 使いたいキーを登録できるようになる、keybindメソッドを作成
     *
     * 引数
     * name : キーにつける名前
     * key : キーコード
     */
    keybind( name, key ) {
        //キーの名前と、キーコードを関連づける
        this._keys[name] = key;
        //キーが押されているかどうかを入れておく変数に、まずはfalseを代入しておく
        this.input[name] = false;
    } //keybind() 終了

}