let eventBus = new Vue()

Vue.component('columns', {
    props: {
        check: {
            type: Boolean
        }
    },
    data() {
        return {
            cardsOne: [],
            cardsTwo: [],
            cardsThree: [],
            count: 0,
            num: 0,
            disableFirstColumn: false // Флаг блокировки первой колонки
        }
    },
    template:
        `
    <div class="list-notes">
    <div class="row-col">
        <create-card :check="check"></create-card>
        <div class="col">
        <card :cardList="cardsOne" :disableFirstColumn="disableFirstColumn" :ChangeNote="ChangeNote"></card>
        </div>
        <div class="col">
        <card :cardList="cardsTwo" :ChangeNote="ChangeNote"></card>
        </div>
        <div class="col">
        <card :cardList="cardsThree" :ChangeNote="ChangeNote" :saveCard3="saveCard3"></card>
        </div>
    </div>
    </div>
    `,
    mounted() {
        this.cardsOne = JSON.parse(localStorage.getItem("cardsOne")) || [];
        this.cardsTwo = JSON.parse(localStorage.getItem("cardsTwo")) || [];
        this.cardsThree = JSON.parse(localStorage.getItem("cardsThree")) || [];
        this.count = JSON.parse(localStorage.getItem("count")) || [];
        this.num = JSON.parse(localStorage.getItem("num")) || [];

        eventBus.$on('card-submitted', createCard => {
            if (this.cardsOne.length < 3) {
                this.cardsOne.push(createCard)
                this.saveCard1()
                if (this.cardsOne.length == 3) {
                    this.check = false
                }
            }
        })
    },
    watch: {
        cardsOne(newValue) {
            localStorage.setItem("cardsOne", JSON.stringify(newValue));
        },
        cardsTwo(newValue) {
            localStorage.setItem("cardsTwo", JSON.stringify(newValue));
        },
        cardsThree(newValue) {
            localStorage.setItem("cardsThree", JSON.stringify(newValue));
        },
        count(newValue) {
            localStorage.setItem("count", JSON.stringify(newValue));
        },
        num(newValue) {
            localStorage.setItem("num", JSON.stringify(newValue));
        }
    },
    methods: {
        saveCard1() {
            localStorage.setItem('cardsOne', JSON.stringify(this.cardsOne));
        },
        saveCard2() {
            localStorage.setItem('cardsTwo', JSON.stringify(this.cardsTwo));
        },
        saveCard3() {
            localStorage.setItem('cardsThree', JSON.stringify(this.cardsThree));
        },
        saveCount() {
            localStorage.setItem('count', JSON.stringify(this.count));
        },
        saveNum() {
            localStorage.setItem('num', JSON.stringify(this.num));
        },


        ChangeNote(card, note) {
            this.count = this.countNotes(card);
            this.saveCount()
            this.num = this.numNotes(card, note);
            this.saveNum()

            this.checkFirstColumn(card);
            this.checkSecondColumn(card);
            if (this.cardsOne[0]) {
                this.count = this.countNotes(this.cardsOne[0]);
                this.saveCount()
                this.num = this.numNotes(this.cardsOne[0], note);
                this.saveNum()
                this.checkFirstColumn(this.cardsOne[0]);
                return;
            }
            if (this.cardsOne[1]) {
                this.count = this.countNotes(this.cardsOne[1]);
                this.saveCount()
                this.num = this.numNotes(this.cardsOne[1], note);
                this.saveNum()
                this.checkFirstColumn(this.cardsOne[1]);
                return;
            }
            if (this.cardsOne[2]) {
                this.count = this.countNotes(this.cardsOne[2]);
                this.saveCount()
                this.num = this.numNotes(this.cardsOne[2], note);
                this.saveNum()
                this.checkFirstColumn(this.cardsOne[2]);
                return;
            } else if (this.cardsTwo.length <= 4) {
                this.disableFirstColumn = false;
            }


            if (this.cardsThree.indexOf(card) >= 0) { // Проверка, что карточка с 3-ей колонки
                card.count_t -= 1;
                return;
            }
        },
        countNotes(card) {
            let count = 0
            for (let i in card.arrNotes) {
                if (card.arrNotes[i].pointTitle != null) // Проверка заметки на null
                    count++;
            }
            return count;
        },
        numNotes(card, note) {
            let num = 0
            for (let i in card.arrNotes) {
                if (card.arrNotes[i].pointTitle == note) // Поис номера заметки по названию
                    num = i;
            }
            return num;
        },

        checkFirstColumn(card) {
            if (this.cardsOne.indexOf(card) >= 0) { // Проверка, что карточка с 1-ой колонки
                if (this.cardsTwo.length < 5) { // Првоерка длинны 2-ой колонки для редактирования заметок
                    if ((100 / this.count) * card.count_t > 50) {
                        this.cardsTwo.push(card);
                        this.cardsOne.splice(this.cardsOne.indexOf(card), 1)

                        if (this.cardsTwo.length === 5) { // проверка, что вторая колонка заполнена && проверка что выполненные задачи превышают сумму задач поделённое на 2
                            this.disableFirstColumn = true; // блокировка первой колонки
                        }

                        if (this.check == false && this.cardsOne.length != 3) // Проверка блокировки на добавления карточки
                            this.check = true;
                    }
                }
            }
            this.saveCard2()
        },
        checkSecondColumn(card) {
            if (this.cardsTwo.indexOf(card) >= 0) { // Проверка, что карточка с 2-ой колонки
                if ((100 / this.count) * card.count_t == 100) {
                    card.date_c = new Date().toLocaleString();

                    this.cardsThree.push(card);
                    this.saveCard3()
                    this.cardsTwo.splice(this.cardsTwo.indexOf(card), 1);

                    if (this.cardsTwo.length === 4 && this.cardsTwo.length <= 4) {
                        this.disableFirstColumn = false;
                    }
                }
            }
        },
    },
})


Vue.component('time-interval-form', {
    template: `
    <form class="text-form-card" @submit.prevent="onSubmit">    
        <label for="startT">Начало подзадачи</label>
        <input id="startT" v-model="startT" type="time" placeholder="Первая точка временного интервала">
        
        <label for="endT">Конец подзадачи</label>
        <input id="endT" v-model="endT" type="time" placeholder="Вторая точка временного интервала">     
               
        <button type="submit">Отправить</button>        
    </form>
  `,
    data() {
        return {
            startT: null,
            endT: null,
        }
    },
    methods: {
        onSubmit() {
            if (this.startT && this.endT) {
                let start = new Date(`1970-01-01T${this.startT}:00Z`);
                let end = new Date(`1970-01-01T${this.endT}:00Z`);
                let diffMs = end - start;
                let diff = new Date(diffMs);
                let hours = diff.getUTCHours();
                let minutes = diff.getUTCMinutes();
                let seconds = diff.getUTCSeconds();
                let formattedDiff = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // Обновление общей суммы времени
                this.createCard.interval = addTime(this.createCard.interval, formattedDiff);

                // Обновление времени начала и окончания заметки
                this.subtask.startTime = this.startT;
                this.subtask.endTime = this.endT;
                this.saveCard3();

                this.startT = '';
                this.endT = '';
            }
        }
    },
    props: {
        createCard: {
            type: Object
        },
        subtask: {
            type: Object
        },
        saveCard3: {
            type: Function
        },
    },
    computed: {
        calculation() {
        }
    }
});

// Функция для суммирования двух временных интервалов в формате HH:MM:SS
function addTime(time1, time2) {
    let [hours1, minutes1, seconds1] = time1.split(':').map(Number);
    let [hours2, minutes2, seconds2] = time2.split(':').map(Number);

    let totalSeconds = seconds1 + seconds2;
    let additionalMinutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = totalSeconds % 60;

    let totalMinutes = minutes1 + minutes2 + additionalMinutes;
    let additionalHours = Math.floor(totalMinutes / 60);
    let remainingMinutes = totalMinutes % 60;

    let totalHours = hours1 + hours2 + additionalHours;

    return `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

Vue.component('card', {
    template: `
    <div>
      <div v-for="createCard in cardList">
        <div class="cardOne">
          <p>{{ createCard.title }}</p>
          <ul>
              <li class="container" v-for="point in createCard.arrNotes">
              <div  @click="createCard.count_t = Check(point.pointStatus, createCard.count_t),
              point.pointStatus = true,
              ChangeNote(createCard, point.pointTitle)"
              :class="{ disabled: disableFirstColumn }"
                >
                    {{point.pointTitle}}
                </div>
                   <time-interval-form
                       v-if="point.pointTitle && createCard.date_c && !point.startTime"
                       :createCard="createCard"
                       :subtask="point"
                       :saveCard3="saveCard3"                     
                       >                     
                   </time-interval-form>
                <div v-if="point.startTime">             
                   {{ point.startTime }} -
                   {{ point.endTime }}
                </div>
                <div v-if="point.pointStatus">✔️</div>
              </li>
          </ul>
          <div v-if="createCard.date_c">
          <p>Дата: {{ createCard.date_c }}</p>
          </div>
          <div v-if="createCard.interval != '00:00:00'">
            <p>Трата времени: {{ createCard.interval }}</p>
          </div>
        </div>
      </div>
    </div>
    `,
    props: {
        subtask: {
            type: Object
        },
        calculation: {
            type: Function
        },
        startTime: {
            type: Object
        },
        createCard: {
            type: Object
        },
        cardList: [],
        ChangeNote: {
            type: Function
        },
        disableFirstColumn: {
            type: Boolean,
        },
        saveCard3: {
            type: Function,
        },
    },
    methods: {
        Check(status, count_t) {
            if (status == false) {
                count_t++;
                return count_t;
            }
            return count_t;
        }
    },
})


Vue.component('create-card', {
    props: {
        check: {
            type: Boolean
        }
    },
    template: `
    <div class="forms-create-card">
    <form class="text-form-card" @submit.prevent="onSubmit">
    <label for="title">Заголовок</label>
    <input required v-model="title" id="title" type="text" placeholder="Заголовок">
        <input v-model="note1" type="text" placeholder="1 пункт">
        <input v-model="note2" type="text" placeholder="2 пункт">
        <input v-model="note3" type="text" placeholder="3 пункт">
        <input v-model="note4" type="text" placeholder="4 пункт">
        <input v-model="note5" type="text" placeholder="5 пункт">
    <button type="submit" :disabled = "!check">Создать</button>
    <p v-if="errors.length">
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
    </form>
    </div>
    `,
    data() {
        return {
            title: null,
            note1: null,
            note2: null,
            note3: null,
            note4: null,
            note5: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.note1 && this.note2 && this.note3) {
                let createCard = {
                    title: this.title,
                    interval: '00:00:00',
                    arrNotes: [
                        {pointTitle: this.note1, pointStatus: false, startTime: null, endTime: null},
                        {pointTitle: this.note2, pointStatus: false, startTime: null, endTime: null},
                        {pointTitle: this.note3, pointStatus: false, startTime: null, endTime: null},
                        {pointTitle: this.note4, pointStatus: false, startTime: null, endTime: null},
                        {pointTitle: this.note5, pointStatus: false, startTime: null, endTime: null},
                    ],
                    count_t: 0,
                    date_c: null
                }
                eventBus.$emit('card-submitted', createCard)

                this.title = null
                this.arrNotes = null
                this.note1 = null
                this.note2 = null
                this.note3 = null
                this.note4 = null
                this.note5 = null
            } else {
                if (!this.note1) this.errors.push("Заполните первый пункт!")
                if (!this.note2) this.errors.push("Заполните второй пункт!")
                if (!this.note3) this.errors.push("Заполните третий пункт!")
            }
        }
    }
})


let app = new Vue({
    el: '#app',
    data() {
        return {
            check: true
        }
    }
})