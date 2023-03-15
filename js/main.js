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
            num: 0
        }
    },
    template:
        `
    <div class="list-notes">
    <div class="row-col">
        <create-card :check="check"></create-card>
        <div class="col">
        <card :cardList="cardsOne" :ChangeNote="ChangeNote"></card>
        </div>
        <div class="col">
        <card :cardList="cardsTwo" :ChangeNote="ChangeNote"></card>
        </div>
        <div class="col">
        <card :cardList="cardsThree" :ChangeNote="ChangeNote"></card>
        </div>
    </div>
    </div>
    `,
    mounted() {
        eventBus.$on('card-submitted', createCard => {
            if (this.cardsOne.length < 3) {
                this.cardsOne.push(createCard)
                if (this.cardsOne.length == 3) {
                    this.check = false
                }
            }
        })
    },
    methods: {
        ChangeNote(card, note) {

            this.count = this.countNotes(card);
            this.num = this.numNotes(card, note);


            this.checkFirstColumn(card);
            this.checkSecondColumn(card);
            if(this.cardsOne[0]) {
                this.count = this.countNotes(this.cardsOne[0]);
                this.num = this.numNotes(this.cardsOne[0], note);
                this.checkFirstColumn(this.cardsOne[0]);
                return;
            }
            if(this.cardsOne[1]) {
                this.count = this.countNotes(this.cardsOne[1]);
                this.num = this.numNotes(this.cardsOne[1], note);
                this.checkFirstColumn(this.cardsOne[1]);
                return;
            }
            if(this.cardsOne[2]) {
                this.count = this.countNotes(this.cardsOne[2]);
                this.num = this.numNotes(this.cardsOne[2], note);
                this.checkFirstColumn(this.cardsOne[2]);
                return;
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

                        if (this.check == false && this.cardsOne.length != 3) // Проверка блокировки на добавления карточки
                            this.check = true;
                    }
                } else {
                    card.arrNotes[this.num].pointStatus = false;
                    card.count_t -= 1;
                }
            }
        },
        checkSecondColumn(card) {
            if (this.cardsTwo.indexOf(card) >= 0) { // Проверка, что карточка с 2-ой колонки
                if ((100 / this.count) * card.count_t == 100) {
                    card.date_c = new Date().toLocaleString();
                    this.cardsThree.push(card);
                    this.cardsTwo.splice(this.cardsTwo.indexOf(card), 1);
                }
            }
        },
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
    <input v-model="title" id="title" type="text" placeholder="Заголовок">
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
                    arrNotes: [
                        { pointTitle: this.note1, pointStatus: false },
                        { pointTitle: this.note2, pointStatus: false },
                        { pointTitle: this.note3, pointStatus: false },
                        { pointTitle: this.note4, pointStatus: false },
                        { pointTitle: this.note5, pointStatus: false },
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
    data(){
        return{
            check: true
        }
    }
})