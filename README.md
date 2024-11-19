### План разработки

 - &#x2611; Шаблон для блоков
 - &#x2611; Рабочая область
 - &#x2611; Блок с объявлением переменных
 - &#x2610; Блок с переменной
 - &#x2610; Обновление шаблона блока для поддержки вложенности
 - &#x2610; Блок с функцией pinMode (содержит 2 поля - поле для вложения переменной с пином, выпадающий список типа работы пина)
 - &#x2610; Блок с функцией digitalRead (содержит 1 поле для вложения)
 - &#x2610; Блок с функцией digitalWrite(содержит 2 поля: поле для вложения, поле для ввода\вложения того, что пишем)
 - &#x2610; Блок с функциями setup/loop
 - &#x2610; Блок для условий (содержит 3 поля - первое для вложения блок с переменной, второе выпадающий список математических сравнений, третий - поля для вложения блока с переменной)
 - &#x2610; Блоки for, while
 - &#x2610; Блоки для работы с Serial Port 
    - &#x2610; Блок для инициализации (1 поле с выпадающим списком скорости)
    - &#x2610; Блок для вывода информации (1 поле)

---

### Расширение на React для vs code с блочным программированием
На текущий момент добавил шаблон блока, который позволяет перетаскивать блок - но работает не оч круто, достаточно быстро сбивается и перестает перетаскиваться. Есть возможность перетаскивать рабочее пространство. Шаблон для блоков позволяет создавать новые блоки не сильно запариваясь над чем-то: есть все необходимые поля для будущего. Там хранится в том числе айдишник и код, который потом превратится в то, что будем заливать на Рудирон. 

### Как этим пользоваться?
В папке react-app как это ни странно, лежит просто реактовское приложение. 
```
npm install
npm start
```
этого хватит для разработки. Чтобы затестить расширение, необходимо сначала все собрать
```
npm build run
```
далее просто нажать на `f5` в vs code и откроется другое окно с vs code, в которм нужно будет через `ctrl shift P` ввести название `Hello world`. Нажав на него, откроется расширение внутри vs code.


