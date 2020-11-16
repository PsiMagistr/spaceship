window.addEventListener("load", function(){
   //  Инициализация переменных, декларация функций и объектов.
   var info = document.querySelector("#information"); 
   var canvas = document.querySelector("#scena");
   var scena = canvas.getContext("2d");
   var asteroids = []; // Массив астероидов.
   var speedaster = 100; // Скорость генерации астероидов.
   var gun = { //Наш космический корабль.
        Name:"Покоритель зари", // Имя.
        Count:0, //Сколько мы подбили целей.
        sound:new Audio("sounds/blaster.mp3"),
        sprite:new Image(), // Спрайт.
        width:50,
        BlasterSpeed:40, //Интервал задержки выстрела
        IsShooting:true, //Флаг на разрешение стрельбы.
        X:0, // Координата по горизонтали.
        Y:550, // Координата по вертикали.        
        bullets:[], // Пульки. Массив.
        Move:function(dx){ // Метод движения
            this.X += dx;
            if(this.X < 0 || this.X > canvas.width - this.width){
               this.X -= dx;
            }
        },
        Shoot:function(){//Метод стрельбы.
            if(this.IsShooting == true){
               this.IsShooting = false;
               this.bullets.push(new Bullet());
               this.sound.play();  
            }
        }
   }

    function Rnd(min, max){//Случайное число.
        var rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    //Астероид
    function Asteroid(){ //Конструктор объекта астероид
        this.Size = 50; // Размер астероида 
        this.X = Rnd(0, canvas.width / this.Size) * this.Size; // Координаты по Х
        this.Y = -this.Size; //Начальные координаты по У
        this.Speed = Rnd(1,5);//Скорость движения астероида от 1 до 5
        this.Del = false;//Флаг удаления.
        this.colors = ["red", "blue", "green", "black", "orange"]; //Массив цветов
        this.CurrentColor = this.colors[Rnd(0, this.colors.length - 1)]; //Выбор случайного цвета        
        this.Move = function(){//Движение астероида, метод
            this.Y += this.Speed;
            if(this.Y > canvas.width - this.Size){//Если астероид улетел за экран в космос, то ставим метку удаления
                this.Del = true;
            }
        }
    }
    
    function Bullet(){ // Конструктор объекта пули.
        this.Size = 10;
        this.X = gun.X + gun.width / 2 - this.Size / 2;
        this.Y = 550;
        this.Speed = 5;
        this.Del = false;
        this.Move = function(){
            this.Y -= this.Speed;
            if(this.Y < 0){
               this.Del = true; 
            }
        }
    }

    function update(){ //Обновление мира.
        if(gun.IsShooting == false){//Механизм задержки бластерной пушки.            
            gun.BlasterSpeed--;
            if(gun.BlasterSpeed == 0){
               gun.BlasterSpeed = 40;
               gun.IsShooting = true;               
            }
        }
        speedaster--;
        if(speedaster == 0){ //Генерация астороидов.
            speedaster = 100;
            asteroids.push(new Asteroid());
        }

        for(var i in asteroids){ // Двигаем астероиды.
            asteroids[i].Move();
        }
        
        for(var i in gun.bullets){ //Двигаем все пульки
            gun.bullets[i].Move();
        }

        for(var i in gun.bullets){ // Проверка коллизий и установка коллизионных флагов.
            for(var j in asteroids){
                if((gun.bullets[i].X >= asteroids[j].X) &&
                (gun.bullets[i].X <= asteroids[j].X + asteroids[j].Size - gun.bullets[i].Size) &&
                (gun.bullets[i].Y >= asteroids[j].Y) &&
                (gun.bullets[i].Y <= asteroids[j].Y + asteroids[j].Size - gun.bullets[i].Size)){
                    gun.bullets[i].Del = true;
                    asteroids[j].Del = true;                   
                    gun.Count++;
                } 
            }
            
        }
        

       /* for(var i in asteroids){ // Очистка Вселенной от астероидов.
            if(asteroids[i].Del == true){
               asteroids.splice(i, 1);
               i--;
            }
        }
        
        for(var i in gun.bullets){ //Очистка Вселенной пуль
            if(gun.bullets[i].Del == true){
               gun.bullets.splice(i, 1);
               i--;
            }
        }*/
        asteroids = asteroids.filter(function(asteroid){
            return asteroid.Del == false;
        });
        
        gun.bullets = gun.bullets.filter(function(bullet){
            return bullet.Del == false;
        });
    }

    function render(){ // функция отрисовки
       scena.clearRect(0, 0, canvas.width, canvas.height);
       scena.drawImage(gun.sprite, gun.X, gun.Y, gun.width, gun.width);
       scena.fillStyle = "red";
       for(var i in gun.bullets){
           scena.fillRect(gun.bullets[i].X, gun.bullets[i].Y, gun.bullets[i].Size, gun.bullets[i].Size);
       }
       
       for(var i in asteroids){
           scena.fillStyle = asteroids[i].CurrentColor;
           scena.fillRect(asteroids[i].X, asteroids[i].Y, asteroids[i].Size, asteroids[i].Size);
       }
       info.innerHTML = "База безопасности: \"" + gun.Name + "\"<br>Количество объектов во Вселенной: " + asteroids.length + "<BR>" + "Количество сбитых астероидов: " + gun.Count;
    }

    function game(){ // Функция запуска игрового цикла, старт игры
      // update(); // Обновить
      // render(); // Перерисовать
       window.requestAnimationFrame(function(){ // Повторяем с каждым обновлением графической карты.
           update();
           render();
           game();
       });
    }
    
   //Начало работы программы, построение экземпляров объектов, вызова функций.
    
    gun.sprite.src = "images/gun.png";
    gun.sprite.addEventListener("load", function(){        
        window.addEventListener("keydown", function(e){            
            if(e.keyCode == 39){
                gun.Move(50);
            }
            else if(e.keyCode == 37){
                gun.Move(-50);
            }
            else if(e.keyCode == 32){ 
                gun.Shoot();                
            }
        });
       game();
    });
 });
