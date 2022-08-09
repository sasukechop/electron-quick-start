'use strict'

/**
 * パーティに関してのクラス
 */
class Party {

    /**
     * 引数には、パーティのメンバーを制限なく入れることができる
     */
    constructor() {
        //引数をthis.memberに追加
        this.member = arguments;
        //パーティの移動速度
        this.speed = 1;
    } //constructor() 終了

    /**
     * 先頭以外のキャラの、向きを設定するためのメソッド
     */
    setMemberDirection() {
        //先頭のキャラ以外の数だけ繰り返す
        for ( let i=1; i<this.member.length; i++ ) {
            //ひとつ前のキャラよりもX座標が大きいとき、左向きにする
            if ( this.member[i-1].mapX < this.member[i].mapX ) this.member[i].direction = 1;
            //ひとつ前のキャラよりもX座標が小さいとき、右向きにする
            else if ( this.member[i-1].mapX > this.member[i].mapX ) this.member[i].direction = 2;
            //ひとつ前のキャラよりもY座標が大きいとき、後ろ向きにする
            else if ( this.member[i-1].mapY < this.member[i].mapY ) this.member[i].direction = 3;
            //ひとつ前のキャラよりもY座標が小さいとき、前向きにする
            else if ( this.member[i-1].mapY > this.member[i].mapY ) this.member[i].direction = 0;
        }
    } //setMemberDirection() 終了

    /**
     * 先頭以外のキャラの、移動速度を設定するためのメソッド
     *
     * 引数
     * direction : 先頭のキャラの移動方向
     */
    setMemberVelocity( direction ) {
        //先頭以外のキャラの数だけ繰り返す
        for ( let i=1; i<this.member.length; i++ ) {
            //ひとつ前のキャラとX座標が同じときの、計算用変数
            let _samePrevX;
            //ひとつ前のキャラとY座標が同じときの、計算用変数
            let _samePrevY;
            //ひとつ前のキャラよりもX座標が小さいときの、計算用変数
            let _lessThanPrevX;
            //ひとつ前のキャラよりもY座標が小さいときの、計算用変数
            let _lessThanPrevY;
            //ひとつ前のキャラよりもX座標大きいときの、計算用変数
            let _moreThanPrevX;
            //ひとつ前のキャラよりもY座標が大きいときの、計算用変数
            let _moreThanPrevY;
            //ひとつ前のキャラよりも、タイルひとつ分以上離れているときの計算用変数
            let _moreThanOneTile;

            //先頭のキャラの移動方向によって、それぞれの変数に値を代入する
            if ( direction === 'up' ) {
                _samePrevX = 0;
                _samePrevY = 1
                _lessThanPrevX = -1;
                _lessThanPrevY = 0;
                _moreThanPrevX = 1;
                _moreThanPrevY = 2;
                _moreThanOneTile = -1;
            }
            else if ( direction === 'down' ) {
                _samePrevX = 0;
                _samePrevY = -1;
                _lessThanPrevX = -1;
                _lessThanPrevY = -2;
                _moreThanPrevX = 1;
                _moreThanPrevY = 0;
                _moreThanOneTile = 1;
            }
            else if ( direction === 'left' ) {
                _samePrevX = 1;
                _samePrevY = 0;
                _lessThanPrevX = 0;
                _lessThanPrevY = -1;
                _moreThanPrevX = 2;
                _moreThanPrevY = 1;
                _moreThanOneTile = -1;
            }
            else if ( direction === 'right' ) {
                _samePrevX = -1;
                _samePrevY = 0;
                _lessThanPrevX = -2;
                _lessThanPrevY = -1;
                _moreThanPrevX = 0;
                _moreThanPrevY = 1;
                _moreThanOneTile = 1;
            }

            //ひとつ前のキャラとX,Y座標が同じとき
            if ( this.member[i-1].mapX === this.member[i].mapX ) this.member[i].vx = this.speed * _samePrevX;
            if ( this.member[i-1].mapY === this.member[i].mapY ) this.member[i].vy = this.speed * _samePrevY;

            //ひとつ前のキャラのほうが、X座標が小さいとき
            if ( this.member[i-1].mapX < this.member[i].mapX ) {
                this.member[i].vx = this.speed * _lessThanPrevX;
                //先頭のキャラの移動方向が左で、ひとつ前のキャラとのX座標の差が、タイルひとつよりも大きいとき
                if ( direction === 'left' && this.member[i].mapX - this.member[i-1].mapX > 1 ) this.member[i].vx = this.speed * _moreThanOneTile;
            }
            //ひとつ前のキャラのほうが、X座標が大きいとき
            if ( this.member[i-1].mapX > this.member[i].mapX ) {
                this.member[i].vx = this.speed * _moreThanPrevX;
                //先頭のキャラの移動方向が右で、ひとつ前のキャラとのX座標の差が、タイルひとつよりも大きいとき
                if ( direction === 'right' && this.member[i-1].mapX - this.member[i].mapX > 1 ) this.member[i].vx = this.speed * _moreThanOneTile;
            }
            //ひとつ前のキャラのほうが、Y座標が小さいとき
            if ( this.member[i-1].mapY < this.member[i].mapY ) {
                this.member[i].vy = this.speed * _lessThanPrevY;
                //先頭のキャラの移動方向が上で、ひとつ前のキャラとのY座標の差が、タイルひとつよりも大きいとき
                if ( direction === 'up' && this.member[i].mapY - this.member[i-1].mapY > 1 ) this.member[i].vy = this.speed * _moreThanOneTile;
            }
            //ひとつ前のキャラのほうが、Y座標が大きいとき
            if ( this.member[i-1].mapY > this.member[i].mapY ) {
                this.member[i].vy = this.speed * _moreThanPrevY;
                //先頭のキャラの移動方向が下で、ひとつ前のキャラとのY座標の差が、タイルひとつよりも大きいとき
                if ( direction === 'down' && this.member[i-1].mapY - this.member[i].mapY > 1 ) this.member[i].vy = this.speed * _moreThanOneTile;
            }
        }
    } //setMemberVelocity() 終了
}