
<template>
    <section class="fb__todo fb__todo__feedback">
        <h2 class="fb__title--hidden">일정 확인 앱</h2>
        <div class="fb__todo__top">
            <nav class="top__nav">
                <strong class="fb__todo__today" v-text="getDateText()"></strong>
                <button class="fb__todo__add" @click="addTodoList($event)">추가</button>
            </nav>

            <div class="fb__todo__search">
                <input type="text" v-model="searchText" @keyup="searchTodoList($event)" placeholder="일정을 검색하세요." maxlength="100">
            </div>

            <ul class="fb__todo__count">
                <li class="count__box" @click="sortType = 'all'">
                    <span class="count__title">전체</span>
                    <em class="count__value count__value--gray">{{count.total}}</em>
                </li>
                <li class="count__box" @click="sortType = 'ing'">
                    <span class="count__title">진행중</span>
                    <em class="count__value">{{count.ing}}</em>
                </li>
                <li class="count__box" @click="sortType = 'done'">
                    <span class="count__title">진행완료</span>
                    <em class="count__value count__value--gray">{{count.end}}</em>
                </li>
            </ul>
        </div>

        <div class="fb__todo__content">
            <!-- 로딩중 -->
            <template v-if="false === fetches.todo">
                <ul class="fb__loading__shimmer">
                    <template v-for="index in 5">
                        <li class="shimmer__list" :key="index">
                            <span class="shimmer__box w80"></span>
                            <span class="shimmer__box"></span>
                        </li>
                    </template>
                </ul>
            </template>

            <!-- 리스트 -->
            <template v-else-if="true === fetches.todo">
                <!-- 라스트 있는 케이스 -->
                <template v-if="todoList && todoList.length">
                    <ul class="fb__todo__list" :class="sortType">
                        <template v-for="(list, index) in todoList">
                            <!-- 리스트 -->
                            <li ref="jsTodoEachBox" class="fb__todo__each swiper-container" :class="list.status ? 'done' : list.priority ? 'red' : ''" :key="index" :data-uuid="list.id">
                                <div class="each__wrapper swiper-wrapper">
                                    <!-- 콘텐츠 -->

                                    <!-- ($event, index) -->
                                    <div class="each__content swiper-slide" v-touch:start="hideOtherController">
                                        <div class="each__content__inner">
                                            <time class="each__date fb__todo__date">
                                                {{getDday(list.deadline)}}
                                            </time>

                                            <p class="each__text fb__todo__text">
                                                {{list.content}}
                                            </p>
                                        </div>

                                        <div class="fb__toggle each__toggle">
                                            <label class="toggle__label" @click="updateStatus(list, index)">
                                                <input type="checkbox" class="toggle__checkbox" :checked="list.status ? false : true">
                                                <div class="toggle__text">
                                                    <span class="toggle__text--on">ON</span>
                                                    <span class="toggle__text--off">OFF</span>
                                                </div>  
                                                <span class="toggle__icon">동그라미 아이콘</span>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- 컨트롤러 -->
                                    <div class="swiper-slide each__controller">
                                        <!-- :disabled="list.status ? true : false" -->
                                        <button class="each__controller__rewrite" @click.stop="editTodoList(list, index)">
                                            <span>수정</span>
                                        </button>
                                        <button class="each__controller__delete" @click.stop="deleteFromList(list.id, index);">
                                            <span>삭제</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>

                    <div class="fb__todo__bottom">
                        <button class="fb__todo__deleteAll" @click="deleteAll($event)">전체 삭제</button>
                    </div>

                    <div v-show="fetches.dbConnect == true" class="fb__loading__icon">
                        edit loading...
                    </div>
                </template>

                    <!-- 없는케이스 -->
                <template v-else>
                    <div class="fb__todo__empty">
                        등록된 일정이 없습니다.
                    </div>
                </template>
            </template>

            <!-- 오류 케이스 -->
            <template v-else-if="'error' === fetches.todo">
                오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
            </template>
        </div>

        <add-todo-modal :isShow="addModal.isOpen" :sendData="sendData" @complete-add-todo="todoListInit('fromAddModal')" @close-add-modal="closeAddModal($event)" v-if="addModal.isOpen"></add-todo-modal>
    </section>
</template>

<script>
    import AddTodoModal from '/components/AddTodoModal.vue';

    export default {
        name: "toodList",

        component: {
            "add-todo-modal": AddTodoModal
        },

        head() {
            return {
            }
        },

        data() {
            return {
                fetches: {
                    todo: false,
                    dbConnect: false
                },

                addModal: {
                    isOpen: false,
                },

                todoList: [],

                searchText: "",
                
                count: {
                    total: 0,
                    ing: 0,
                    end: 0,
                },

                sliders: [],

                sortType: "all",

                sendData: {},

            }
        },

        created() {
            console.clear();

            this.todoListInit();
        },

        methods: {
            //슬라이드 실행
            makeSlider() {
                const listElementList = this.$refs["jsTodoEachBox"];

                if (listElementList && listElementList.length) {
                    listElementList.forEach((el, idx) => {
                        this.sliders[idx] = new Swiper(el, {
                            loop: false,
                            initSlide: 0,
                            slidesPerView: "auto",
                        })
                    })
                }
            },

            //이벤트 추가 모달 닫기
            closeAddModal() {
                this.addModal.isOpen = false;
            },

            //DB > DOC 구하기
            getDocument (uuid) {
                return this.collection.doc(uuid);
            },

            //날짜 데이터
            getDate() {
                return moment(new Date()).format("YYYY-MM-DD");
            },
            
            //요일 들어간 날짜 구하기
            getDateText() {
                const date = new Date()
                const dayList = ["일", "월", "화", "수", "목", "금", "토"];
                return moment(date).format("YYYY.MM.DD") + " " + dayList[date.getDay()];
            },

            //요일 들어간 날짜 구하기
            getDday(_deadline) {
                const today = moment(new Date()).format("YYYY-MM-DD");
                let dday = moment(_deadline).diff(moment(today), "days");

                if (dday == 0) dday = "D-DAY";
                else if (dday < 0) dday = `D+${dday}`
                else dday = `D-${dday}`;

                return dday;
            },

            //슬라이드 리셋
            resetSlide(slide) {
                if (slide) {
                    slide.slideTo(0);
                }
                else {
                    if (this.sliders && this.sliders.length) {
                        this.sliders.forEach(slide => {
                            slide.slideTo(0);
                        })
                    }
                }
            },

            // todolist 뿌리기
            async todoListInit(_from) {
                try {
                    const response = await this.requestTodoList();

                    this.todoList = response;
                    this.fetches.todo = true;
                    this.updateCount();

                    this.$nextTick(() => {
                        //최초 생성
                        if (!this.sliders.length) {
                            this.makeSlider();
                        }
                        //슬라이드 다 이동
                        else {
                            this.sliders.forEach(slide => {
                                slide.slideTo(0)
                            })
                        }
                        
                        if (_from == "fromAddModal") this.closeAddModal();
                    })
                }

                catch (error) {
                    console.error("error", error)
                    this.fetches.todo = "error";
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },
            
            // 상단 개수 수정
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

            // 컨트롤러 HIDE
            hideOtherController(e) {
                const $this = $(e.target);
                const _index = $this.closest(".fb__todo__each").index();

                this.sliders.forEach((slide, idx) => {
                    if (_index != idx) this.resetSlide(slide);
                });
            },

            // 검색하기
            async searchTodoList(e) {
                const response = await this.requestTodoList();
                const targetLists = response.filter(v => v.content.indexOf(this.searchText) != -1);

                this.todoList = targetLists;
            },

            // 추가하기 (모달 열기)
            addTodoList(e) {
                this.sendData = {type: "ADD"};
                this.addModal.isOpen = true;
                this.resetSlide();
            },

            // 수정하기 (모달 열기)
            editTodoList(list, index) {
                Object.assign(this.sendData, list);
                this.sendData.type = "EDIT";

                this.resetSlide(this.sliders[index]);
                this.addModal.isOpen = true;
            },

            // 삭제하기
            async deleteFromList(uuid, index) {
                try {
                    this.fetches.dbConnect = true;
                    const ref = this.getDocument(uuid);
    
                    if (ref) {
                        await ref.delete()
                    }

                    this.todoList.splice(index, 1);
    
                    this.resetSlide();
                    this.updateCount();
                }
                catch(error) {
                    console.error("deleteFromList error", error);
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },

            // 상태 변경하기 (진행중 / 완료)
            async updateStatus({id, status}, index) {
                try {
                    this.fetches.dbConnect = true;
                    const ref = this.getDocument(id);

                    await ref.update({
                        status: status ? false : true,
                    });

                    this.todoList[index].status = status ? false : true;
                    this.updateCount();
                }

                catch(error) {
                    console.error("updateStatus error", error);
                }

                finally {
                    this.fetches.dbConnect = false;
                }
            },

            //전체삭제
            async deleteAll(e) {
                try {
                    this.fetches.dbConnect = true;
        
                    await this.collection.get().then(result => {
                        result.docs.forEach(doc => {
                            console.log("doc.id", doc.id)
                            this.collection.doc(doc.id).delete();
                        });

                        this.todoList = [];
                        this.updateCount();
                    })
                }

                catch(error) {
                    console.error("deleteAll error", error);
                }
            },           
        }
    }
</script>