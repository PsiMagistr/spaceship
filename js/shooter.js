window.addEventListener("load", function(){
   //  Инициализация переменных, декларация функций и объектов.
   var info = document.querySelector("#information"); 
   var canvas = document.querySelector("#scena");
   var scena = canvas.getContext("2d");
   var asteroids = []; // Массив астероидов.
   var astsprt = new Image();
   var fon = new Image();
   var bum = new Audio("sounds/bum.mp3");
   var pause = true;
   var speedaster = 100; // Скорость генерации астероидов.
   var gun = { //Наш космический корабль.
        Name:"Покоритель зари", // Имя.       
        MaxLife:100,
        CurrentLife:100,
        MaxEnergy:100,
        CurrentEnergy:100,
        PowerСonsumption:1,
        BarLifeY:canvas.width - 50 + 33,
        BarEnergyY:canvas.width - 50 + 40,
        Count:0, //Сколько мы подбили целей.
        blasterSounds:[new Audio("sounds/blaster.mp3"), new Audio("sounds/blasterstop.mp3")],        
        sprite:new Image(), // Спрайт.
        width:50,
        BlasterInterval:40, //40 Интервал задержки выстрела
        IsShooting:false, //Флаг на разрешение стрельбы.
        X:0, // Координата по горизонтали.
        Y:canvas.width - 50 - 20, // Координата по вертикали.        
        bullets:[], // Пульки. Массив.
        SetDirection:function(){
            this.X+=2;
        },
        Move:function(dx){ // Метод движения
            this.X += dx;
            if(this.X < 0 || this.X > canvas.width - this.width){
               this.X -= dx;
            }
        },
        Shoot:function(){//Метод стрельбы.
            if(this.IsShooting == false && this.CurrentEnergy >= this.PowerСonsumption){
               this.IsShooting = true;
               this.bullets.push(new Bullet(9, 545), new Bullet(33, 545));
               this.blasterSounds[0].play();
               this.CurrentEnergy -= this.PowerСonsumption;
            }
            else if(this.CurrentEnergy < this.PowerСonsumption){
                this.blasterSounds[1].play();
            }
        },
        BlasterDelay:function(){//Механизм задержки бластерной пушки.
            if(this.IsShooting == true){            
                this.BlasterInterval--;
                if(this.BlasterInterval == 0){
                   this.BlasterInterval = 40;
                   this.IsShooting = false;               
                }
            }
        }
   }
   
   function start(){//Функция обнуления игровых параметров
       pause = false;
       gun.Count = 0;
       asteroids = [];
       gun.bullets = [];
       gun.CurrentLife = gun.MaxLife;
       gun.CurrentEnergy = gun.MaxEnergy;
       gun.X = 0;
   }

    function Rnd(min, max){//Случайное число.
        var rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
    
    function clearAll(array){ //Очистка от космического мусора
        var temp = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].Del == false){
               temp.push(array[i]); 
            }
        }
        return temp;
    }

    //Астероид
    function Asteroid(){ //Конструктор объекта астероид
        this.Size = 50; // Размер астероида 
        this.X = Rnd(0, canvas.width / this.Size -1) * this.Size; // Координаты по Х
        this.Y = -this.Size; //Начальные координаты по У
        this.Speed = Rnd(1,5);//Скорость движения астероида от 1 до 5
        this.isShoot = false;
        this.Del = false;//Флаг удаления.
        this.KadrIndex = 0;
        this.Move = function(){//Движение астероида, метод
            this.Y += this.Speed;
            if(this.Y > canvas.width - this.Size){//Если астероид улетел за экран в космос, то ставим метку удаления
                this.Del = true;
            }
        }
    }
    
    function Bullet(dx, y){ // Конструктор объекта пули.
        this.Size = 8;
        this.X = gun.X + dx; //9;//dx; /*gun.width / 2 - this.Size / 2*/;
        this.Y = y;//545;
        this.Speed = 3;
        this.Del = false;
        this.Move = function(){
            this.Y -= this.Speed;
            if(this.Y < 0){
               this.Del = true; 
            }
            else{
                for(var i = 0; i < asteroids.length; i++){
                   if((this.X >= asteroids[i].X) &&
                   (this.X <= asteroids[i].X + asteroids[i].Size - this.Size) &&
                   (this.Y >=  asteroids[i].Y ) &&
                   (this.Y <= asteroids[i].Y + asteroids[i].Size - this.Size)){
                      asteroids[i].isShoot = true;  
                      asteroids[i].Del = true;
                      this.Del = true;                      
                      bum.play();                                          
                      break;
                   } 
                }               
            }            
        }
    }
    
    function generatorAsteroids(){
        speedaster--;
        if(speedaster == 0){ //Генерация астероидов.
            speedaster = 100;
            asteroids.push(new Asteroid());
        }
    }
    
    function actionToAll(action, items){
        for(var i in items){
           items[i][action](); 
        }
    }

    function update(){ //Обновление мира.
        gun.BlasterDelay(); //Задержка выстрела бластерной пушки.
        generatorAsteroids();
        actionToAll("Move", asteroids);
        actionToAll("Move", gun.bullets);
        
        for(var i in asteroids){ 
            if(asteroids[i].isShoot){                             
               gun.Count++;                       
            }   
        }        
        asteroids = clearAll(asteroids);        
        gun.bullets = clearAll(gun.bullets);       
        
        
    }

    function render(){ // функция отрисовки
       scena.drawImage(fon, 0, 0, canvas.width, canvas.height);
       scena.drawImage(gun.sprite, gun.X, gun.Y, gun.width, gun.width);
       scena.fillStyle = "PaleGreen";
       scena.fillRect(gun.X, gun.BarLifeY, gun.width, 5);
       scena.fillRect(gun.X, gun.BarEnergyY, gun.width, 5);
       scena.fillStyle = "red";
       scena.fillRect(gun.X, gun.BarLifeY, Math.floor(gun.width / gun.MaxLife * gun.CurrentLife), 5);
       scena.fillStyle = "blue";
       scena.fillRect(gun.X, gun.BarEnergyY, Math.floor(gun.width / gun.MaxEnergy * gun.CurrentEnergy), 5);
       scena.fillStyle = "#00FA9A";
       for(var i in gun.bullets){
          scena.fillRect(gun.bullets[i].X, gun.bullets[i].Y, gun.bullets[i].Size, gun.bullets[i].Size);
       }
       
       for(var i in asteroids){           
           scena.drawImage(astsprt, asteroids[i].KadrIndex * asteroids[i].Size, 0, asteroids[i].Size, asteroids[i].Size, asteroids[i].X, asteroids[i].Y, asteroids[i].Size, asteroids[i].Size);
       }
       info.innerHTML = `База безопасности: "${gun.Name}"<br>Количество объектов во Вселенной: ${asteroids.length}<br> Количество сбитых астероидов: ${gun.Count}`;
    }

    function game(){ // Функция запуска игрового цикла, старт игры
      // update(); // Обновить
      // render(); // Перерисовать
       window.requestAnimationFrame(function(){ // Повторяем с каждым обновлением графической карты.
           if(pause == false){
              update(); 
           }        
           render();
           game();
       });
    }
    
   //Начало работы программы, построение экземпляров объектов, вызова функций.
    astsprt.src = "images/kadriki33.png";
    gun.sprite.src = "images/gun.png";
    fon.src = "images/space33.jpg";
    fon.addEventListener("load", function(){        
        window.addEventListener("keydown", function(e){             
            if(pause == false){
                if(e.keyCode == 39){
                    gun.Move(50);
                }
                else if(e.keyCode == 37){
                    gun.Move(-50);
                }
                else if(e.keyCode == 32){ 
                    gun.Shoot();                
                }
            }
            if(e.keyCode == 27){
                pause = !pause;
            }
            else if(e.keyCode == 112){
                if(confirm("Начать новую игру?")){
                    start();
                }
            }
           
        });
       game();
    });
 });
