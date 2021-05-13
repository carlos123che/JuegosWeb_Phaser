var AMOUNT_DIAMONDS = 29;
var AMOUNT_B = 30;
GamePlayManager = {
    init: function(){ //se llama de primero, podemos inicializar variables
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //para escalar la pantalla
        //para alinear horizontal y verticalmente
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        this.flagFirstMouseDown = false;
        //logica del juego
        this.amountDiamondCaught = 0;
        this.endGame = false;

        this.countsmile = -1;
    },
    preload: function(){ //cargar los recursos necesarios
        game.load.image('background', './assets/images/background.png'); //asi se carga una imagen
        //el primer parametro es el nombre de instancia para identeificar la imagen
        //el segundo es la ruta

        game.load.spritesheet('horse', './assets/images/horse.png', 84, 156, 2);
        //spritesheet es para dividir una imagen en dos, se ponee el identificado
        //luego la ruta, luego ancho y alto de la imagen a dividir:
        //la imagen media 168 entonce su mitad de ancho es 84  y por utlimo
        //va en cuanto lo queriamos dividir en este caso en 2

        /*********************CARGAR DIAMANTES *********************/
        game.load.spritesheet('diamonds', './assets/images/diamonds.png', 81, 84, 4);

        /** EXPLOSION CUANDO COLISIONAN EL CABALLO Y EL DIAMANTE */
        game.load.image('explosion', './assets/images/explosion.png'); //asi se carga una imagen

        //ANIMACIONES FINALES
        game.load.image('shark', './assets/images/shark.png');
        game.load.image('fishes', './assets/images/fishes.png');
        game.load.image('mollusk', './assets/images/mollusk.png');
        game.load.image('b1', './assets/images/booble1.png');
        game.load.image('b2', './assets/images/booble2.png');
    },
    create: function(){// tenemos todo cargados los recursos y poderlos usar
        game.add.sprite(0, 0, 'background'); //asi se agrega una imagen, primeo debe estar cargada
        //primero se ponen las coordenadas donde se quiere cargar y luego que imagen se desea cargar

        this.booblearray = [];
        for (let i = 0; i < AMOUNT_B; i++) {
            var xbooble = game.rnd.integerInRange(1, 1140);      
            var ybooble = game.rnd.integerInRange(600, 950);      
            var booble = game.add.sprite(xbooble, ybooble, 'b'+ game.rnd.integerInRange(1,2));
            booble.vel = 0.2 +  game.rnd.frac() * 2;
            booble.alpha = 0.85;
            booble.scale.setTo(0.2 + game.rnd.frac());
            this.booblearray.push(booble);
        }
        this.mollusk = game.add.sprite(500, 150, 'mollusk');
        this.shark = game.add.sprite(500, 20, 'shark');
        this.fishes = game.add.sprite(100, 550, 'fishes');

        this.horse = game.add.sprite(0,0, 'horse'); //guardamos una instancia del spritesheet creado
        this.horse.frame = 1; //.frame = es la imagen selecionada
        /*centramos la imagen al centro */
        this.horse.x = game.width/2;
        this.horse.y= game.height/2;

        //por el anchor, default 0,0 el caballo no esta en el centro sino en su esquina 0x 0y
        this.horse.anchor.setTo(0.5, 0.5);//con esto modifico el anchor y si esta en el centro
       /*  //***********rotar ****************
        this.horse.angle = 30;
        //**************escalado**************
        this.horse.scale.setTo(1,2)
        //********opacidad*********************
        this.horse.alpha = 0.6; */

        //capturar un click en pantalla
        game.input.onDown.add(this.onTap, this);

        /************AGREGAR DIAMANTES AL JUEGO**************/
        this.diamonds = [];
        for( var i=0; i<AMOUNT_DIAMONDS; i++){
            var diamond = game.add.sprite(100, 100, 'diamonds');
            diamond.frame = game.rnd.integerInRange(0,3); // obtenemos un random para determinar que frame usar
            diamond.scale.setTo(0.30 + game.rnd.frac()) //game.rnd.frac nos devulene un valor entre 0 y 1
            diamond.anchor.setTo(0.5);
            diamond.alpha = 0.55;
            diamond.x = game.rnd.integerInRange(50, 1050);
            diamond.y = game.rnd.integerInRange(50, 600);
            this.diamonds[i] = (diamond);
            var CURRENT_DIAMOND = this.getBoundsDiamond(diamond);
            const HORSE_RECT = this.getBoundsDiamond(this.horse);

            while(this.isOverlapOhterDiamond(i, CURRENT_DIAMOND) ||  this.isRectanglesOverlapping(HORSE_RECT, CURRENT_DIAMOND)){
                diamond.x = game.rnd.integerInRange(50, 1050);
                diamond.y = game.rnd.integerInRange(50, 600);
                CURRENT_DIAMOND = this.getBoundsDiamond(diamond);
            }
        }
        /***CREAR UN GRUOP */
        this.explosionGroup = game.add.group(); //el grupo lo podemos modificar como si fuera un sprite
            /* this.explosionGroup.create(200,200, 'explosion');

            var newExplosion = this.explosionGroup.getFirstDead();
            console.log(newExplosion); */

        for( var i=0; i<10; i++){ //crear 10 elementos del grupo
            //crear efectos de tween para sprites
            this.explosion = this.explosionGroup.create(100, 100, 'explosion');
            /* var tween = game.add.tween(this.explosion); //guardo instancia del tween
            tween.to({x:500, y:100}, 1500, Phaser.Easing.Exponential.Out); //primero va la posicion, luego velocidad
            //y luego efecto y velocidad
            tween.start();//se incia el tween */
            this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
                x: [0.4, 0.8, 0.4],
                y: [0.4, 0.8, 0.4]
            }, 600, Phaser.Easing.Exponential.Out, false, 0,0, false);
            
            //600, Phaser.Easing.Exponential.Out, false, 0,0, false) durara 600 milisengundo, efecto
            // que se incie al inicio o no, si queremos un delay, cuantas veces queremos que se repita
            //si querremos que vaya y  vuelva
            this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
                alpha: [1, 0.6, 0]
            }, 600, Phaser.Easing.Exponential.Out, false, 0,0, false);
            this.explosion.anchor.setTo(0.5);
            // this.explosion.visible = false;
            this.explosion.kill();
        }

        //agregar texto al juego
        this.currentScore = 0;
        var style = {
            font: 'bold 30pt Arial',
            fill: '#FFFF',
            align: 'center'
        }
        this.scoreText = game.add.text(game.width/2, 40, '0', style); //primero va la x luego la y y por ultimo el mensaje estilo opcional
        this.scoreText.anchor.setTo(0.5);

        this.totalTime = 13;
        this.timerText = game.add.text(1000, 40, this.totalTime, style); //primero va la x luego la y y por ultimo el mensaje estilo opcional
        this.timerText.anchor.setTo(0.5);
        /**crear un timer */
        this.timer = game.time.events.loop(Phaser.Timer.SECOND, function(){
            if(this.flagFirstMouseDown){
                this.totalTime--;
                this.timerText.text = this.totalTime;
                if(this.totalTime<=0){
                    this.showFinalMessage('GAME OVER!');
                    this.endGame = true;
                    game.time.events.remove(this.timer);
                }
            }
        }, this);

    },
    increseScore:function(){
        this.countsmile = 0;
        this.horse.frame = 1;
        this.currentScore += 100;
        this.scoreText.text = this.currentScore;

        //logica del juego
        this.amountDiamondCaught++;
        if(this.amountDiamondCaught >= AMOUNT_DIAMONDS){
            this.showFinalMessage('CONGRATULATIONS!!!');
            this.endGame = true;
            game.time.events.remove(this.timer)
        }
    },
    showFinalMessage: function(mssg){
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000';
        bgAlpha.ctx.fillRect(0,0, game.width, game.height);
        var bg = game.add.sprite(0,0,bgAlpha);
        bg.alpha = 0.5;
        var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFF',
            align: 'center'
        }
        this.textFieldFinalMSG = game.add.text(game.width/2, game.height/2, mssg, style);
        this.textFieldFinalMSG.anchor.setTo(0.5);
    },
    onTap: function(){
        if(!this.flagFirstMouseDown){
            this.tweenMollusk= game.add.tween( this.mollusk.position).to( 
                {y:-0.001}, 4000, Phaser.Easing.Cubic.InOut, true ,0, 1000, true
                ).loop(true);
        }
        this.flagFirstMouseDown = true;
    },
    getBoundsDiamond: function(currentDiamond){ //devuelce un rectangulo con las coordenadas del diamante
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    isRectanglesOverlapping: function(rect1, rect2){
        if( rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width){
            return false;
        }
        if( rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height){
            return false;
        }
        return true;
    },
    isOverlapOhterDiamond: function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1, rect2)){
                return true;
            }
        }
        return false;
    },
    getBoundsHorse: function(){
        var x0 = this.horse.x - Math.abs(this.horse.width)/4 ; //coordenad x menos la mitad de su ancho
        var width = Math.abs(this.horse.width)/2; //asegurarnos que el with no sea negativo ya que puede se puede
        //hacer negativo cuando cambia su orientacion
        var y0 = this.horse.y - this.horse.height/2; //coordenad y menos la altura
        var height = this.horse.height;
        return new Phaser.Rectangle(x0, y0, width, height);
    },
    render: function(){
       /*  game.debug.spriteBounds(this.horse);
        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            game.debug.spriteBounds(this.diamonds[i]);
        } */
    },
    update: function(){//frame a frame se llama este metodo
        // this.horse.angle += 1;  asi se rotaria un grado en caballo

        /**********Hacer que el caballo siga a nuestro mouse**********/
        
        if(this.flagFirstMouseDown && !this.endGame){

            this.booblearray.forEach(element => {
                element.y -= element.vel;
                if(element.y < -50){
                    element.y = 700;
                    element.x = game.rnd.integerInRange(1,1140);
                }
            });

            if(this.countsmile >= 0){
                this.countsmile++;
                if(this.countsmile > 40){
                        this.countsmile = -1;
                        this.horse.frame = 0;
                }
            }

            this.shark.x-= 1.5;
            if(this.shark.x < -300){
                this.shark.x = 1300
            }

            this.fishes.x += 0.9
            if(this.fishes.x > 1300){
                this.fishes.x = -300;
            }
            //game.input.x  devuele las coordenadas x del mouse y Y la de Y
            var pointerX = game.input.x;
            var pointerY = game.input.y;
            // calcular la distancia entre el caballo y el mouse
            var distX = pointerX - this.horse.x;
            var distY = pointerY - this.horse.y;
            //hacer que el caballo mire a donde a el mouse
            if(distX>0){ //el mouse esta a la derecha
                this.horse.scale.setTo(1,1);
            }else{//el mouse esta ala izquierda
                this.horse.scale.setTo(-1, 1);
            }
            //hacer que el caballo persiga al mouse
            this.horse.x  += distX * 0.02;
            this.horse.y += distY * 0.02;

            for(var i=0; i<AMOUNT_DIAMONDS; i++){
                var rectHorse = this.getBoundsHorse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                //chequeo si colisionan
                if(this.diamonds[i].visible  && this.isRectanglesOverlapping(rectHorse, rectDiamond)){
                    this.diamonds[i].visible = false;
                    this.increseScore();
                    var explosion = this.explosionGroup.getFirstDead();
                    if(explosion!=null){
                        explosion.reset(this.diamonds[i].x, this.diamonds[i].y);
                        explosion.tweenScale.start();
                        explosion.tweenAlpha.start();

                        explosion.tweenAlpha.onComplete.add(function(currentTarget, currentTween){
                            currentTarget.kill();
                        }, this);
                    }
                    
                }
            }
        }
    }
}
var game = new Phaser.Game(1136, 640, Phaser.AUTO);
// Phaser.WEBGL PERMITE USAR LA TARJETA DE VIDEO PARA EL RENDER, MAS RAPIDO
//1136, 640 son las medidas de la pantalla
// Phaser.CANVAS cuando se sabe que no hay tarjeta de video
// Phaser.AUTO intenta usar WEBGL y si no hay usa CANVAS

game.state.add('gameplay',GamePlayManager);
game.state.start('gameplay'); //en star le indicamos que estado queremos ejecutar


