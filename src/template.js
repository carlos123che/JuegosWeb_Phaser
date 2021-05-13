GamePlayManager = {
    init: function(){ //se llama de primero, podemos inicializar variables
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //para escalar la pantalla
        //para alinear horizontal y verticalmente
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        this.flagFirstMouseDown = false;
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
    },
    create: function(){// tenemos todo cargados los recursos y poderlos usar
        game.add.sprite(0, 0, 'background'); //asi se agrega una imagen, primeo debe estar cargada
        //primero se ponen las coordenadas donde se quiere cargar y luego que imagen se desea cargar

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

    },
    onTap: function(){
        this.flagFirstMouseDown = true;
    },
    update: function(){//frame a frame se llama este metodo
        // this.horse.angle += 1;  asi se rotaria un grado en caballo

        /**********Hacer que el caballo siga a nuestro mouse**********/
        
        if(this.flagFirstMouseDown){
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


