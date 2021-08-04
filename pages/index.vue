
<template>
    <section class="fb__todo fb__todo__feedback">
        <h2 class="fb__title--hidden">일정 확인 앱</h2>
        <div class="fb__todo__header">
            <ul class="fb__todo__count"> 
                <li class="count__box">
                    <span class="count__title">전체</span>
                    <em class="count__value count__value--gray">{{count.total}}</em>
                </li>
                <li class="count__box">
                    <span class="count__title">진행중</span>
                    <em class="count__value">{{count.ing}}</em>
                </li>
                <li class="count__box">
                    <span class="count__title">진행완료</span>
                    <em class="count__value count__value--gray">{{count.end}}</em>
                </li>
            </ul>
             <!-- <p class="fb__todo__today" v-text="getDateText()"></p> -->
            <div class="fb__todo__addlist">
                <input ref="todoInput" type="text" value="" @keyup.enter="addToList()" placeholder="일정을 입력하세요." maxlength="100">
                <button class="fb__todo__add" @click="addToList()">추가</button>
            </div>
        </div>

        <div class="fb__todo__content">
            <!-- 라스트 있는 케이스 -->
            <template v-if="todoList && todoList.length">
                <ul class="fb__todo__case fb__todo__scroll">
                    <template v-for="(list, index) in todoList">
                        <li class="fb__todo__each" :class="list.status ? 'done' : ''" :key="index" :data-uuid="list.id">
                            <div class="each__wrapper">
                                <div class="each__content" @click.stop="updateStatus(list)">
                                    <p class="each__text fb__todo__text">
                                        {{list.content}}
                                    </p>
                                    
                                    <span class="each__date fb__todo__date">{{getDateText(list.dates)}}</span>
                                </div>

                                <div class="each__controller">
                                    <button class="each__controller__rewrite" :disabled="list.status ? true : false" @click.stop="list.isEdit = true;">수정</button>
                                    <button class="each__controller__delete" @click.stop="deleteFromList(list.id);">삭제</button>
                                </div>
                            </div>
                            <div class="each__update" :class="list.isEdit ? 'show' : ''">
                                <input :ref="'editInput' + list.id" type="text" :value="list.content">
                                <button class="fb__button" @click.stop="editListContent(list.id);">수정</button>
                                <button class="fb__button" @click.stop="list.isEdit = false;">취소</button>
                            </div>
                        </li>
                    </template>
                </ul>
            </template>

             <!-- 없는케이스 -->
            <template v-else>
                <div class="fb__todo__case fb__todo__empty">
                        등록된 일정이 없습니다.
                </div>
            </template>
        </div>
    </section>
</template>

<script>
    import moment from "moment";

    moment.lang('ko', {
        weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
        weekdaysShort: ["일","월","화","수","목","금","토"],
    });

    export default {
        name: "list",
        head() {
            return {
            }
        },

        data() {
            return {
                todoList: [],

                count: {
                    total: 0,
                    ing: 0,
                    end: 0,
                },
            }
        },

        created() {
            console.clear();

            this.requestTodoList();
        },

        methods: {
            async requestTodoList() {
                const response = [];

                database.collection("todolist").get().then((result) => {
                    result.forEach(list => {
                        response.push(Object.assign(list.data(), {
                            id: list.id
                        }));
                    })
                })

                this.todoList = response;
                this.updateCount();
            },
            
            getDate() {
                return moment(new Date()).format("YYYY-MM-DD");
            },
            
            getDateText(date) {
                const dayList = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                return moment(date).format("YYYY.MM.DD") + " " + dayList[new Date(date).getDay()];
            },

            updateCount() {
                const count = this.count;

                let _ingCount = 0;
                let _endCount = 0;
                
                this.todoList.forEach(todo => {
                    if (todo.status === true) {
                        _endCount++;
                    }
                    else {
                        _ingCount++;
                    }
                })

                count.total = this.todoList.length;
                count.ing = _ingCount;
                count.end = _endCount;
            },

            addToList() {
                const $input = this.$refs.todoInput;
                
                if ($input.value.trim() == "") {
                    alert("한글자 이상 입력해주세요.");
                    return ;
                }

                const todoData = {
                    id: this.todoList.length + 1,
                    content: $input.value,
                    dates: this.getDate(),
                    status: false,
                    isEdit: false,
                }
                
                // database.collection("todolist").doc("이름").set(todoData);

                database.collection("todolist")
                        .add(todoData)
                        .then(result => {
                            console.log(result);
                        })
                        .catch(err => {
                            console.error(err);
                        });

                this.requestTodoList();
                this.updateCount();

                $input.value = "";
                
                return false;
            },

            deleteFromList(uuid) {
                const ref = database.collection('todolist').doc(uuid);

                if (ref) ref.delete();

                this.requestTodoList();
                this.updateCount();
            },

            async editListContent(uuid) {
                const $editInputs = this.$refs[`editInput${uuid}`][0];
                const ref = database.collection('todolist').doc(uuid);
                
                if (!$editInputs || !ref) return ;

                const res = await ref.update({
                    content:  $editInputs.value,
                    isEdit: false,
                    dates: this.getDate()
                });

                console.log("res", res)

                this.requestTodoList();
            },

            async updateStatus({id, status}) {
                const ref = database.collection('todolist').doc(id);

                const res = await ref.update({
                    status: status ? false : true,
                });

                console.log("res", res)
                this.requestTodoList();
                
                this.updateCount();
            }
        }
    }
</script>