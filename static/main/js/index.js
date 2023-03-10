new Vue({
  delimiters: ["{*", "*}"],
  el: "#app",

  data: {
    // API endpoint
    diameters: [],

    coefficients: [{ id: 0, value: "Не выбрано", price: 1 }],

    logistic: 0,
    extraWorks: [],

    items: [],
    count: 0,

    // results
    result: {
      remoteness: { value: "Не указано", total: 0, range: 0 },
      extra: { value: [], total: 0 },
      total: 0,
    },

    realTotal: 0,  // тотал без минималки

    startTotalItem: 0,

    //
    currentScreen: 'screenMain',

    discount: 0, // скидка

    /* ВТОРОЙ КАЛЬКУЛЯТОР */
    diameterSecondCalc: [],
    materialSecondCalc: null,
    inputData: [{'name': 'Сторона A', 'value': 0}, {'name': 'Сторона B', 'value': 0}],
    thicknessSecondCalc: 0,
    figureArea: 0,
    figure: 0,
    circleCount: 0,
    secondCalcTotal: 0,
    circlePrice: 0,
  },
  methods: {
    // add new item
    addNewItem: async function () {
      var item = {
        diameters: { value: "Не выбрано", total: 0 },
        material: { value: "Не выбрано", price: 0 },
        thickness: { value: 0, price: 0, total: 0 },
        coefficient: { value: "Не выбрано", price: 1 },
        extra: { value: [], price: 0 }, // по сути сейчас не нужен здесь, но если удалить, придется переписывать логику вычислений
        total: 0, // цена которая начинается от startTotalItem
        price: 0, // обычная цена
        count: 1,
      };
      await this.items.push({ id: this.count, result: item });
      
      this.openItem(this.count)

      this.count++;
    },
    // delete item by id
    delItem: async function (id) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items.splice(i, 1);
        }
      }
      this.calculate();
    },
    calculate: function (id) {
      total = 0;
      for (var i in this.items) {
        total += Number(this.items[i].result.total);
      }

      this.realTotal = total;

      if (this.result.remoteness.total != 0) {

        if (Number(total) < this.startTotalItem) {
          total = this.startTotalItem
        } 

        this.result.total =
          Number(total) + Number(this.result.remoteness.total) + Number(this.result.extra.total);

        this.result.total = (this.result.total - (this.result.total / 100 * this.discount)).toFixed(0)

      } else {

        if (Number(total) < this.startTotalItem) {
          total = this.startTotalItem
        } 
        this.result.total = Number(total) + Number(this.result.extra.total);

        this.result.total = (this.result.total - (this.result.total / 100 * this.discount)).toFixed(0)
      }
    },
    // show panel item
    openItem: function (id) {
      buttons = document.getElementsByClassName(
        "btn-reset accordion hero__accordion"
      );
      panels = document.getElementsByClassName("panel hero__panel");
      for (var i in buttons) {
        if (buttons[i].id == id) {
          if (buttons[i].classList.toString().includes("active")) {
            buttons[i].classList.remove("active");
          } else {
            buttons[i].classList.add("active");
          }
        }
      }
      for (var i in panels) {
        if (panels[i].id == id) {
          if (panels[i].style.cssText.toString().includes('px')) {
            panels[i].style.cssText = "";
          } else {
            panels[i].style.maxHeight = panels[i].scrollHeight + "px";
          }
        }
      }
    },

    // изменение высоты блока 
    changeHeight: function(id) {
      panels = document.getElementsByClassName("panel hero__panel");
      for (var i in panels) {
        if (panels[i].id == id) {
            panels[i].style.maxHeight = Number(panels[i].scrollHeight) + 150 + "px";
          }
        }
    },

    // изменение диаметра отверстия
    changeDiameter: function (id, diameter) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["material"] = { value: "Не выбрано", price: 0 };
          this.items[i].result["diameters"] = diameter;
          this.items[i].result["total"] = Number(
            this.items[i].result["extra"].price
          ).toFixed(0);
          this.items[i].result["diameters"].total = 0;

          this.items[i].result["diameters"].total = (
            this.items[i].result["diameters"].total *
            this.items[i].result["coefficient"].price
          ).toFixed(0);

          this.items[i].result["price"] = this.items[i].result["total"]
          
          
        }
      }

      var materialsbtn = document.getElementsByName("material");
      for (var i in materialsbtn) {
        materialsbtn[i].checked = false;
      }
      
      this.calculate(id);

      this.changeHeight(id)
    },

    // изменение материал отверстия
    changeMaterial: function (id, material) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["diameters"].total = (
            material.price * this.items[i].result["coefficient"].price
          ).toFixed(0);



          this.items[i].result["material"] = material;

          total =
            this.items[i].result["diameters"].total *
            this.items[i].result["thickness"].total *
            this.items[i].result["count"];
          this.items[i].result["total"] = (
            total + Number(this.items[i].result["extra"].price)
          ).toFixed(0);

          this.items[i].result["price"] = this.items[i].result["total"]

          
        }
      }
      this.calculate(id);

      this.changeHeight(id)
    },

    // изменение толщины стены
    changeThickness: function (id, thickness) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["thickness"] = thickness;
          total =
            this.items[i].result["diameters"].total *
            this.items[i].result["thickness"].total *
            this.items[i].result["count"];
          this.items[i].result["total"] = (
            total + Number(this.items[i].result["extra"].price)
          ).toFixed(0);

          this.items[i].result["price"] = this.items[i].result["total"]

          
        }
      }
      this.calculate(id);

      this.changeHeight(id)
    }, 

    
    // смена коэффициента отверстия
    changeCoefficient: function (id, coefficient) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["coefficient"] = coefficient;

          // diameter
          material = this.items[i].result["material"];
          this.items[i].result["diameters"].total = (
            material.price * this.items[i].result["coefficient"].price
          ).toFixed(0);

          // // total
          total =
            this.items[i].result["diameters"].total *
            this.items[i].result["thickness"].total *
            this.items[i].result["count"];
          this.items[i].result["total"] = (
            total + Number(this.items[i].result["extra"].price)
          ).toFixed(0);

          this.items[i].result["price"] = this.items[i].result["total"]

          
        }
      }
      this.calculate(id);
      this.openSelect(id);

      this.changeHeight(id)
    },

    // логика открытия и закрытия селека коэффициента отверстия
    openSelect: function (id) {
      selectHead = document.getElementsByClassName("select__head");
      selectList = document.getElementsByClassName("select__list");

      for (headID in selectHead) {
        if (selectHead[headID].id == id) {
          if (selectHead[headID].classList.toString().includes("open")) {
            selectHead[headID].classList.remove("open");
            selectList[headID].style.display = "none";
          } else {
            selectHead[headID].classList.add("open");
            selectList[headID].style.display = "block";
          }
        }
      }
    },

    // SLIDER логика слайдера толщины
    slider: function (el, id) {
      if (el == "slider") {
        document.getElementById("amount" + id).value = document.getElementById(
          "slider" + id
        ).value;
      } else if (el == "amount") {
        document.getElementById("slider" + id).value = document.getElementById(
          "amount" + id
        ).value;
      }
      var sliderValue = document.getElementById("amount" + id).value;
      this.changeThickness(id, {
        value: sliderValue,
        price: sliderValue,
        total: sliderValue,
      });


      this.changeHeight(id)
    },

    // total item рассчет тотала отверстия
    caclulateTotalItem: function (id) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          count = this.items[i].result["count"];
          total = this.items[i].result["total"];
          total =
            this.items[i].result["diameters"].total *
            this.items[i].result["thickness"].total *
            this.items[i].result["count"];
          this.items[i].result["total"] = (
            total + Number(this.items[i].result["extra"].price)
          ).toFixed(0);

          this.items[i].result["price"] = this.items[i].result["total"]

          
        }
      }
      this.calculate(id);

      this.changeHeight(id)
    },

    // COUNT - кол-во отверстий
    btnCountMinus: function (id) {
      current = document.getElementById("count" + id).value;
      document.getElementById("count" + id).value = Number(current) - 1;

      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["count"] = document.getElementById(
            "count" + id
          ).value;
        }
      }

      this.caclulateTotalItem(id);

      this.changeHeight(id)
    },

    // COUNT + кол-во отверстий
    btnCountPlus: function (id) {
      current = document.getElementById("count" + id).value;
      document.getElementById("count" + id).value = Number(current) + 1;

      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["count"] = document.getElementById(
            "count" + id
          ).value;
        }
      }

      this.caclulateTotalItem(id);

      this.changeHeight(id)
    },

    // ввод кол-ва отверстий
    inputCount: function (id) {
      for (var i in this.items) {
        if (this.items[i].id == id) {
          this.items[i].result["count"] = document.getElementById(
            "count" + id
          ).value;
        }
      }

      this.caclulateTotalItem(id);

      this.changeHeight(id)
    },

    // input удалееность от МКАД
    inputRemotenessValue: function () {
      // Authocomplete location in input
      ymaps = window.ymaps;
      var suggestView1 = new ymaps.SuggestView("remValue");
    },
    getData: async function (url) {
      try {
        const response = await axios.get(url);
        return response;
      } catch (error) {
        console.error(error);
      }
    },

    // получение занчения из массива
    getValue: function (arr, id) {
      for (var i in arr) {
        // console.log(arr[i])
        if (arr[i].id == id) {
          // console.log(arr[i])
          return arr[i].value;
        }
      }
    },

    // получение цены из массива
    getPrice: function (arr, id) {
      for (var i in arr) {
        if (arr[i].id == id) {
          // console.log(arr[i])
          return arr[i].price;
        }
      }
    },

    // рассчет удаленности
    remoteness: function () {
      minimalValue = 10;
      coordHours = [];
      hour = 0;

      // search for the most suitable coordinates
      hours = {
        12: [55.911814, 37.581631],
        13: [55.893643, 37.701462],
        14: [55.829645, 37.828263],
        15: [55.756941, 37.842828],
        16: [55.710303, 37.837371],
        17: [55.628071, 37.798663],
        18: [55.574423, 37.638674],
        19: [55.613306, 37.491045],
        20: [55.674274, 37.425127],
        21: [55.773392, 37.372754],
        22: [55.835345, 37.396326],
        23: [55.885282, 37.458842],
      };

      // calculate remothess from MKAD to location
      let promise = new Promise((resolve, reject) => {
        loc = document.getElementById("remValue").value;

        // GET COORD
        ymaps.geocode(loc).then(function (res) {
          var newCoords = res.geoObjects.get(0).geometry.getCoordinates();

          for (var i in hours) {
            differenceLatitude = Math.abs(hours[i][0] - newCoords[0]); // разница по широте
            differenceLongitude = Math.abs(hours[i][1] - newCoords[1]); // разница по долготе
            if (minimalValue > differenceLongitude + differenceLatitude) {
              minimalValue = differenceLongitude + differenceLatitude;
              coordHours = hours[i];
              hour = i;
            }
          }

          // GET ROUTE
          ymaps.route([coordHours, newCoords]).then(function (route) {
            resolve(route.getLength());
          });
        });
      });

      promise.then((rem) => this.calcRemoteness(rem, loc));
    },

    calcRemoteness: function (rem, loc) {
      this.result.remoteness = {
        value: loc,
        total: (rem / 1000).toFixed(0) * this.logistic,
        range: (rem / 1000).toFixed(0),
      };
      this.calculate();
    },

    viewCoefficients: function (id) {
      list = document.getElementById("coefList" + id);
      if (list.style.display == "none") {
        list.style.display = "";
      } else {
        list.style.display = "none";
      }

      this.changeHeight(id)
    },

    // обработка доп работ (если число какой то доп работы > 0 прибавляем ее к итоговому результату)
    extraWorkProcessing: function() {
        resultExtra = {'value': [], 'total': 0}
        for (var i in this.extraWorks) {
            if (this.extraWorks[i].count > 0) {
                resultExtra.value.push(this.extraWorks[i])
                resultExtra.total += this.extraWorks[i].price * this.extraWorks[i].count
            }
        }

        this.result.extra = resultExtra;
    },

    // калькулятор доп работ
    extraWorkCalc: function(id, func) {
        for (var i in this.extraWorks) {
            if (this.extraWorks[i].id == id) {
                if (func == 'minus') {
                    this.extraWorks[i].count -= 1;
                } else if (func == 'plus') {
                    this.extraWorks[i].count += 1;
                }
            }
        }

        this.extraWorkProcessing();
        this.calculate();
    },

    // смена экранов (calc 1 <-> calc 2)
    switchScreen: function(screen) {
      document.getElementById(this.currentScreen).style.display = 'none'
      document.getElementById(screen).style.display = ''
      this.currentScreen = screen;
    },

    // скидка
    discountCalc: function() {
        if (this.discount == '') {
          this.discount = 0
        }

        this.calculate()
    },

    /* ПЕРИМЕТР CALC */
    changeFigure: function(figure) {
      if (figure == 0) {
        this.inputData = [{'name': 'Сторона A', 'value': 0}, {'name': 'Сторона B', 'value': 0}]
      } else if (figure == 1) {
        this.inputData = [{'name': 'Сторона A', 'value': 0}, {'name': 'Сторона B', 'value': 0}, {'name': 'Сторона C', 'value': 0}]
      } else if (figure == 2) {
        this.inputData = [{'name': 'Диаметр', 'value': 0}]
      }

      this.figure = figure;
      
    },

    // считываем толщину стены
    sliderSecondCalc: function(el) {
      if (el == "slider") {
        document.getElementById("amount").value = document.getElementById(
          "slider"
        ).value;
      } else if (el == "amount") {
        document.getElementById("slider").value = document.getElementById(
          "amount"
        ).value;
      }
      var sliderValue = document.getElementById("amount").value;
      this.thicknessSecondCalc = sliderValue

      this.calculateTotalSecondCalc()
    },

    // опредлеяем прощадб выьранной фигиры
    figureAreaCalc: function() {
      if (this.figure == 0) {
        var a = this.inputData[0].value
        var b = this.inputData[1].value

        if (a == '') {
          a = 0
        } 

        if (b == '') {
          b = 0
        } 

        a = Number(a)
        b = Number(b)

        this.figureArea = (a * b).toFixed(0)

      } else if (this.figure == 1) {
        var a = this.inputData[0].value
        var b = this.inputData[1].value
        var c = this.inputData[2].value

        if (a == '') {
          a = 0
        } 

        if (b == '') {
          b = 0
        } 

        if (c == '') {
          c = 0
        } 

        a = Number(a)
        b = Number(b)
        c = Number(c)

        const p = (a + b + c) / 2;
        console.log(p)
        const g = p * (p - a) * (p - b) * (p - c)
        console.log(g)
        const area = Math.sqrt(g);
        console.log(area)
        this.figureArea = area.toFixed(0);
        console.log(this.figureArea)

      } else if (this.figure == 2) {
        var d = this.inputData[0].value

        if (d == ''){
          d = 0
        }

        d = Number(d)

        const area = (Math.PI / 4) * d ** 2; // вычисляем площадь круга
        this.figureArea = area.toFixed(0);

      }
      this.numberHoles()
    },

    // кол-во отверстии в триугольнике
    calculateCircleCountInTriangle: function() {
      var a = this.inputData[0].value
      var b = this.inputData[1].value
      var c = this.inputData[2].value

      if (a == '') {
        a = 0
      } 

      if (b == '') {
        b = 0
      } 

      if (c == '') {
        c = 0
      } 

      a = Number(a)
      b = Number(b)
      c = Number(c)


      const triangleArea = this.figureArea;
      circleDiameter = (Number(this.diameterSecondCalc.value.split('-')[0]) / 10).toFixed(0)
    
      const radius = (2 * triangleArea) / (a + b + c);
      const circleArea = Math.PI * (circleDiameter / 2) ** 2;
    
      const circleCount = Math.ceil(radius ** 2 / circleArea);
    
      return circleCount;
    },

    // кол-во отверстии в ПРЯМОУГОЛЬНИКЕ
    calculateCircleCountInRectangle: function() {
      const rectangleArea = this.figureArea;
      circleDiameter = (Number(this.diameterSecondCalc.value.split('-')[0]) / 10).toFixed(0)
    
      const circleArea = Math.PI * (circleDiameter / 2) ** 2;
    
      const circleCount = Math.ceil(rectangleArea / (circleArea));
    
      return circleCount;
    },

    // кол-во отверстии в КРУГЕ
    calculateCircleCountInCircle: function() {
      // const bigCircleDiameter = this.figureArea;
      const smallCircleDiameter = (Number(this.diameterSecondCalc.value.split('-')[0]) / 10).toFixed(0)
    
      // const bigCircleRadius = bigCircleDiameter / 2;
      const smallCircleRadius = smallCircleDiameter / 2;
    
      const bigCircleArea = this.figureArea;
      const smallCircleArea = Math.PI * smallCircleRadius ** 2;
    
      const circleCount = Math.ceil(bigCircleArea / smallCircleArea);
    
      return circleCount;
    },

    // находим кол-во отверстии 
    numberHoles: function() {
      if (this.figure == 0) {
        this.circleCount = this.calculateCircleCountInRectangle();

      } else if (this.figure == 1) {
        this.circleCount = this.calculateCircleCountInTriangle();


      } else if (this.figure == 2) {
        this.circleCount = this.calculateCircleCountInCircle();

      }

      this.calculateTotalSecondCalc()
    },
    // рассчет тотала 2 калькулятора и цены 1 отверстия
    calculateTotalSecondCalc: function() {
      this.circlePrice = (this.thicknessSecondCalc *  this.materialSecondCalc.price)
      this.secondCalcTotal = this.circlePrice * this.circleCount
    },

    changeMaterialSecond: function() {
      this.calculateTotalSecondCalc();
    },

  },
  async mounted() {
    let script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://api-maps.yandex.ru/2.1/?apikey=334f77fd-ed61-4f8d-8b91-6b78273063bf&lang=ru_RU"
    );
    document.head.appendChild(script);

    let ajaxScript = document.createElement("script");
    ajaxScript.setAttribute(
      "src",
      "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
    );

    document.head.appendChild(ajaxScript);

    var diameters = await this.getData("/api/v1/DiameterList/");
    var coefficients = await this.getData("/api/v1/CoefficientsList/");
    var logistic = await this.getData("/api/v1/LogisticList/");
    var extraWorks = await this.getData("/api/v1/ExtraWorksList/");
    var startTotalItem = await this.getData("/api/v1/StartTotalList/");

    // получить стартовый тотал
    this.startTotalItem = Number(startTotalItem.data[0].price)


    this.logistic = logistic.data[0].price;
    for (var item in coefficients.data) {
      this.coefficients.push(coefficients.data[item]);
    }

    this.diameters = diameters.data;
    for (var index in extraWorks.data) {
      this.extraWorks.push({ 'value': extraWorks.data[index].value, 'id': extraWorks.data[index].id, 'price': extraWorks.data[index].price, 'count': 0});
    }
    // this.extraWorks = extraWorks.data;


    /* ВТОРОЙ КАЛЬКУДЯТОР */
    var diameterSecondCalc = await this.getData("/api/v1/DimeterSecondCalcList/");
    this.diameterSecondCalc = diameterSecondCalc.data[0].diameter
    this.materialSecondCalc = diameterSecondCalc.data[0].diameter.material[0]

  },
  watch: {
    // whenever question changes, this function will run
    materialSecondCalc() {
      this.calculateTotalSecondCalc();
    }
  },
});
