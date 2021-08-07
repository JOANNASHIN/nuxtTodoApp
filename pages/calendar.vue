
<template>
    <section class="fb__calendar">
        <h2 class="fb__title--hidden">일정 확인 앱</h2>

        <div class="fb__calendar__wrapper">
            <span class="fb__calendar__type" @click="calendar.rows == 1 ? calendar.rows = 2 : calendar.rows = 1">
                {{calendar.rows == 1 ? 2 : 1}}달씩보기
            </span>
            <date-picker
                :value="null"
                color= "orange"
                title-position="left"
                is-white
                is-expanded
                :rows="calendar.rows"
                :attributes="attributes"
            />
        </div>

        <section class="fb__calendar__list" v-show="false">
            <h3 class="list__title">
                <em>{{getDateText()}}</em>
                <span>일정</span>
            </h3>
            <template v-if="todoList && todoList.length">
                <ul class="list__wrapper">
                    <template v-for="(list, index) in todoList">
                        <template v-if="list.content">
                            <li class="list__box" :class="list.status ? 'done' : list.priority ? 'red' : ''" :key="index" :data-uuid="list.id">
                                <p class="list__text">
                                    {{list.content}}
                                </p>
                            </li>
                        </template>
                    </template>
                </ul>
            </template>
        </section>

    </section>
</template>


<script>
    import Calendar from 'v-calendar/lib/components/calendar.umd'
    import DatePicker from 'v-calendar/lib/components/date-picker.umd'

    export default {
        name: "calendar",
        head() {
            return {
            }
        },

        components: {
            "calendar": Calendar,
            "date-picker": DatePicker,
        },

        data() {
            return {
                todoList: [],

                count: {
                    total: 0,
                    ing: 0,
                    end: 0,
                },

                attrs: [
                    {
                        key: "today",
                        highlight: {
                            color: "red",
                            fillMode: "solid"
                        },
                        dates: new Date(),
                    }
                ],

                calendar: {
                    rows: 1,
                }
            }
        },

        created() {
            this.calendarInit();
        },

        mounted(){
            
        },

        computed: {
            attributes() {
                return [
                    ...this.todoList.map(todo => ({
                        dates: todo.deadline,

                        dot: todo.key === "today" ? false : {
                            color: todo.status ? "gray" : todo.priority ? "red" : "green"
                        },

                        highlight: todo.key === "today" ? "red" : "",
                        
                        popover: todo.key === "today" ? false : {
                            label: todo.content
                        },

                        customData: todo,
                    }))
                ]
            }
        },

        methods: {
            async calendarInit() {
                const response = await this.requestTodoList();
                this.todoList = response; 
                // this.todoList.push(
                //     {
                //         key: "today",
                //         dates: new Date(),
                //     }
                // )
            },

            getDateText() {
                const today = new Date();
                return moment(today).format("YYYY.MM.DD");
            },
        }
    }
</script>