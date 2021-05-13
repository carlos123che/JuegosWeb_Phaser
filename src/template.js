GamePlayManager = {
    init: function(){ //se llama de primero, podemos inicializar variables
        game.scale.scaleMode = Phase.ScaleManager.SHOW_ALL; //para escalar la pantalla
        //para alinear horizontal y verticalmente
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    preload: function(){ //cargar los recursos necesarios
        game.load.image('background', './assets/images/background.png'); //asi se carga una imagen
        //el primer parametro es el nombre de instancia para identeificar la imagen
        //el segundo es la ruta
    },
    create: function(){// tenemos todo cargados los recursos y poderlos usar
        game.add.sprite(0, 0, 'background'); //asi se agrega una imagen, primeo debe estar cargada
        //primero se ponen las coordenadas donde se quiere cargar y luego que imagen se desea cargar
    },
    update: function(){//frame a frame se llama este metodo
        
    }
}
var game = new Phaser.Game(1136, 640, Phaser.AUTO);
// Phaser.WEBGL PERMITE USAR LA TARJETA DE VIDEO PARA EL RENDER, MAS RAPIDO
//1136, 640 son las medidas de la pantalla
// Phaser.CANVAS cuando se sabe que no hay tarjeta de video
// Phaser.AUTO intenta usar WEBGL y si no hay usa CANVAS

game.state.add('gameplay',GamePlayManager);
game.state.start('gameplay'); //en star le indicamos que estado queremos ejecutar


