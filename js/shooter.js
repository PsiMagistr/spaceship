window.addEventListener("load", function(){
   var info = document.querySelector("#information"); 
   var canvas = document.querySelector("#scena");
   var scena = canvas.getContext("2d");
   var asteroids = [];
   var timer = 100;
   var gun = { //Наш космический корабль.
        Name:"Покоритель зари", // Имя
        Count:0,
        sprite:new Image(), // Спрайт
        X:0, // Координата по горизонтали
        Y:550, // Координата по вертикали
        width:50, // Ширина картинки
        bullets:[], // Пульки
        Move:function(dx){ // Метод движения
            this.X += dx;
            if(this.X < 0 || this.X > canvas.width - this.width){
               this.X += -dx;
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
        this.X = Rnd(0, 11) * this.Size; // Координаты по Х
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

    function update(){ //
        timer--;
        if(timer == 0){
            timer = 100;
            asteroids.push(new Asteroid());
        }

        for(var i in asteroids){ // Двигаем астероиды.
            asteroids[i].Move();
        }
        
        for(var i in gun.bullets){ //Двигаем все пульки
            gun.bullets[i].Move();
        }

        for(var i in gun.bullets){ // Проверка коллизий
            for(var j in asteroids){
                if((gun.bullets[i].X == asteroids[j].X + asteroids[j].Size / 2 - gun.bullets[i].Size / 2) && gun.bullets[i].Y <= asteroids[j].Y + asteroids[j].Size - gun.bullets[i].Size){
                    gun.bullets[i].Del = true;
                    asteroids[j].Del = true;                   
                    gun.Count++;
                } 
            }
            
        }
        

        for(var i in asteroids){ // Очистка Вселенной от астероидов.
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
        }        
    }

    function render(){ // функция отрисовки
       scena.clearRect(0, 0, canvas.width, canvas.height);
       scena.drawImage(gun.sprite, gun.X, gun.Y, gun.width, gun.width);
       scena.fillStyle = "black";
       for(var i in gun.bullets){
           scena.fillRect(gun.bullets[i].X, gun.bullets[i].Y, gun.bullets[i].Size, gun.bullets[i].Size);
       }
       
       for(var i in asteroids){
           scena.fillStyle = asteroids[i].CurrentColor;
           scena.fillRect(asteroids[i].X, asteroids[i].Y, asteroids[i].Size, asteroids[i].Size);
       }
       info.innerHTML = "Количество объектов во Вселенной: " + asteroids.length + "<BR>" + "Количество сбитых астероидов: " + gun.Count;
    }

    function game(){ // Функция запуска игрового цикла, старт игры
       update(); // Обновить
       render(); // Перерисовать
       window.requestAnimationFrame(function(){ // Повторяем с каждым обновлением графической карты.
           game();
       });
    }
    
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
                gun.bullets.push(new Bullet());
            }
        });
       game();
    });
 });
