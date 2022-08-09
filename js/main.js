'use strict'

//ブラウザがページを完全に読みこむまで待つ
addEventListener( 'load', () => {

    //変数gameに、あなたはゲームですよ、と教える
    const game = new Game();
    //ゲームに使う画像などの素材を先に読み込んでおく（プリロード）
    game.preload( 'img/yamada.png', 'img/rico.png', 'img/aru.png', 'img/start.png', 'img/goal.png', 'img/tile.png', 'img/dpad.png', 'sound/bgm.mp3', 'sound/start.mp3', 'sound/clear.mp3' );
    //使いたいキーとして、スペースキーを登録する
    game.keybind( 'space', ' ' );
    //ゲームを開始する準備ができたあとに実行する
    game.main( () => {

        //タイトルシーン
        const titleScene = () => {

            //変数sceneに、あなたはシーンですよ、と教える
            const scene = new Scene();

            //変数titleTextに、あなたは「くろねこラビリンス」というテキストだよ、と教える
            const titleText = new Text( 'くろねこラビリンス' );
            //テキストを上下左右中央の位置にする
            titleText.center().middle();
            //シーンにテキストを追加
            scene.add( titleText );

            //シーンが切り替わったときに、一度だけ呼ばれる
            scene.onchangescene = () => {
                //clear.mp3をストップ
                game.sounds[ 'sound/clear.mp3' ].stop();
                //start.mp3を再生
                game.sounds[ 'sound/start.mp3' ].start();
            }

            //シーンがタッチされたとき
            scene.ontouchstart = () => {
                //メインシーンに切り替える
                game.currentScene = mainScene();
            } //scene.ontouchstart() 終了

            //ループから常に呼び出される
            scene.onenterframe = () => {
                //スペースキーが押されたとき、メインシーンに切り替える
                if ( game.input.space ) game.currentScene = mainScene();
            } //scene.onenterframe() 終了

            //作ったシーンを返す
            return scene;

        } //titleScene() 終了

        //メインシーン
        const mainScene = () => {

            //タイルのサイズ
            const TILE_SIZE = 32;
            //歩く速さ
            const WALKING_SPEED = 4;

            //変数sceneに、あなたはシーンですよ、と教える
            const scene = new Scene();

            //変数tilemapに、あなたはタイルマップですよ、と教える
            const tilemap = new Tilemap( 'img/tile.png' );
            //tilemap.dataに、どんなマップなのか教える
            tilemap.data = map;
            //マップ全体の位置をずらす
            tilemap.x = TILE_SIZE*4 - TILE_SIZE/2;
            tilemap.y = TILE_SIZE*3 - TILE_SIZE/2;
            //移動できないタイルを指定する
            tilemap.obstacles = [0, 3, 6, 7, 8, 9, 10, 11];
            //マップを登録する
            scene.add( tilemap );

            //変数startに、あなたはスタートのタイルですよ、と教える
            const start = new Tile( 'img/start.png' );
            //マップ左上からの座標を指定する
            start.x = TILE_SIZE;
            start.y = TILE_SIZE*2;
            //スタートのタイルを、tilemapに追加して、とお願いする
            tilemap.add( start );

            //変数goalに、あなたはゴールのタイルですよ、と教える
            const goal = new Tile( 'img/goal.png' );
            //マップ左上からの座標を指定する
            goal.x = TILE_SIZE*98;
            goal.y = TILE_SIZE*98;
            //ゴールのタイルを、tilemapに追加して、とお願いする
            tilemap.add( goal );

            //変数yamadaに、あなたは山田先生のキャラクタータイルですよ、と教える
            const yamada = new CharacterTile( 'img/yamada.png' );
            //山田先生を画面の中央に配置
            yamada.x = yamada.y = TILE_SIZE*5 - TILE_SIZE/2;
            //タイルマップの動きと同期させない
            yamada.isSynchronize = false;
            //tilemapに、山田先生のタイルを追加して、とお願いする
            tilemap.add( yamada );

            //変数ricoに、あなたはりこちゃんのキャラクタータイルですよ、と教える
            const rico = new CharacterTile( 'img/rico.png' );
            //りこちゃんの位置を決める
            rico.x = TILE_SIZE*7 - TILE_SIZE/2;
            rico.y = TILE_SIZE*5 - TILE_SIZE/2;
            //タイルマップの動きと同期させない
            rico.isSynchronize = false;
            //tilemapに、りこちゃんのキャラクタータイルを追加して、とお願いする
            tilemap.add( rico );

            //変数aruに、あなたはアルくんのキャラクタータイルですよ、と教える
            const aru = new CharacterTile( 'img/aru.png' );
            //アルくんの位置を決める
            aru.x = TILE_SIZE*7 - TILE_SIZE/2;
            aru.y = TILE_SIZE*6 - TILE_SIZE/2;
            //タイルマップの動きと同期させない
            aru.isSynchronize = false;
            //tilemapに、アルくんのキャラクタータイルを追加して、とお願いする
            tilemap.add( aru );

            //変数partyに、あなたは山田先生とりこちゃんとアルくんのパーティですよ、と教える
            const party = new Party( yamada, rico, aru );
            //パーティの歩く速さに、WALKING_SPEEDの値を代入する
            party.speed = WALKING_SPEED;

            //変数dpadに、あなたはD-Padですよ、と教える
            const dpad = new DPad( 'img/dpad.png', 80 );
            //D-Padの位置を指定する
            dpad.x = 10;
            dpad.y = 230;
            //sceneに、D-Padを追加して、とお願いする
            scene.add( dpad );

            //シーンが切り替わったときに、一度だけ呼ばれる
            scene.onchangescene = () => {
                //start.mp3をストップ
                game.sounds[ 'sound/start.mp3' ].stop();
                //bgm.mp3をループ再生
                game.sounds[ 'sound/bgm.mp3' ].loop();
            }

            //キャラクターのアニメーションのための変数
            let toggleForAnimation = 0;
            //ゴールのテキストが表示されているかどうかの変数
            let hasDisplayedGoalText = false;
            //移動可能かどうかの変数
            let isMovable = true;

            //ループから常に呼び出される
            scene.onenterframe = () => {
                //タイルマップの位置がタイルのサイズで割り切れるとき
                if ( ( tilemap.x - TILE_SIZE/2 ) % TILE_SIZE === 0 && ( tilemap.y - TILE_SIZE/2 ) % TILE_SIZE === 0 ) {
                    //タイルマップの移動速度に0を代入する
                    tilemap.vx = tilemap.vy = 0;
                    //パーティ全員の数だけ繰り返す
                    for ( let i in party.member ) {
                        //パーティ全員の移動速度を0にする
                        party.member[i].vx = party.member[i].vy = 0;
                        //パーティ全員の画像を切り替える
                        party.member[i].animation = 1;
                    }

                    //山田先生のタイルがゴールのタイルと重なっているとき、イベントを発生させる
                    if ( yamada.isOverlapped( goal ) ) {
                        //ゴールのテキストが表示されていないとき
                        if ( !hasDisplayedGoalText ) {
                            //変数goalTextに、あなたは「ゴールだべ！」というテキストだよ、と教える
                            const goalText = new Text( 'ゴールだべ！' );
                            //テキストサイズを変更
                            goalText.size = 50;
                            //テキストを上下左右中央の位置にする
                            goalText.center().middle();
                            //シーンにテキストを追加
                            scene.add( goalText );
                            //ゴールのテキストが表示されているかどうかの変数にtrueを代入
                            hasDisplayedGoalText = true;
                            //移動ができないようにする
                            isMovable = false;
                            //bgm.mp3をストップ
                            game.sounds[ 'sound/bgm.mp3' ].stop();
                            //clear.mp3を再生
                            game.sounds[ 'sound/clear.mp3' ].start();
                            //６秒たったら、タイトルシーンに切り替える
                            setTimeout( () => {
                                game.currentScene = titleScene();
                            }, 6000 );
                        }
                    }

                    //移動可能なとき
                    if ( isMovable ) {
                        //方向キー、もしくはD-Padが押されているときは、setMemberVelocityメソッドを呼び出し、タイルマップの移動速度と、山田先生の向きに、それぞれの値を代入する
                        if ( game.input.left || dpad.arrow.left ) {
                            party.setMemberVelocity( 'left' );
                            tilemap.vx = WALKING_SPEED;
                            yamada.direction = 1;
                        }
                        else if ( game.input.right || dpad.arrow.right ) {
                            party.setMemberVelocity( 'right' );
                            tilemap.vx = -1 * WALKING_SPEED;
                            yamada.direction = 2;
                        }
                        else if ( game.input.up || dpad.arrow.up ) {
                            party.setMemberVelocity( 'up' );
                            tilemap.vy = WALKING_SPEED;
                            yamada.direction = 3;
                        }
                        else if ( game.input.down || dpad.arrow.down ) {
                            party.setMemberVelocity( 'down' );
                            tilemap.vy = -1 * WALKING_SPEED;
                            yamada.direction = 0;
                        }

                        //移動後のマップ座標を求める
                        const yamadaCoordinateAfterMoveX = yamada.mapX - tilemap.vx/WALKING_SPEED;
                        const yamadaCoordinateAfterMoveY = yamada.mapY - tilemap.vy/WALKING_SPEED;
                        //もし移動後のマップ座標に障害物があるとき
                        if ( tilemap.hasObstacle( yamadaCoordinateAfterMoveX, yamadaCoordinateAfterMoveY ) ) {
                            //移動量に0を代入する
                            tilemap.vx = tilemap.vy = 0;
                            //パーティ全員の移動速度に0を代入する
                            for ( let i in party.member ) {
                                party.member[i].vx = party.member[i].vy = 0;
                            }
                        }

                        //タイルマップが動いているとき、パーティメンバーの向きを変える
                        if ( tilemap.vx !== 0 || tilemap.vy !== 0 ) party.setMemberDirection();
                    }
                }
                //タイルマップのXとY座標両方がタイルのサイズで割り切れるとき以外で、タイルの半分のサイズで割り切れるとき
                else if ( ( tilemap.x + TILE_SIZE/2 ) % ( TILE_SIZE/2 ) === 0 && ( tilemap.y + TILE_SIZE/2 ) % ( TILE_SIZE/2 ) === 0 ) {
                    //0と1を交互に取得できる
                    toggleForAnimation ^= 1;
                    //パーティメンバーの数だけ繰り返す
                    for ( let i in party.member ) {
                        //toggleForAnimationの数値によって、パーティ全員の画像を切り替える
                        if ( toggleForAnimation === 0 ) party.member[i].animation = 2;
                        else party.member[i].animation = 0;
                    }
                }
            } //scene.onenterframe 終了

            //作ったシーンを返す
            return scene;

        } //mainScene() 終了

        //gameに、シーンを追加して、とお願いする
        game.add( titleScene() );
        game.add( mainScene() );

        //gameに、ゲームをスタートして、とお願いする
        game.start();

    } ); //main() 終了

} );