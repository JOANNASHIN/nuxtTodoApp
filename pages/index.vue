
<template>
    <section class="fb__todo fb__todo__feedback">
        <h2 class="fb__title--hidden">일정 확인 앱</h2>
        <div class="fb__todo__top">

            <!-- <strong class="fb__todo__today" v-text="getDateText()"></strong> -->

            <nav class="fb__todo__nav">
                <template v-if="false === editMode">
                    <button class="fb__todo__edit" @click="changeToEditMode($event)">편집</button>
                    <button class="fb__todo__add" @click="addTodoList($event)">추가</button>
                </template>

                <template v-else>
                    <button class="edit__cancel" @click="sortCancel()">취소</button>
                    <button class="edit__save" @click="sortChangeSaved()">적용</button>
                </template>
            </nav>

            <div class="fb__todo__search">
                <input type="text" v-model="searchText" @keyup="searchTodoList($event)" placeholder="일정을 검색하세요." maxlength="100">
            </div>

            <ul class="fb__todo__count">
                <li class="count__box" @click="listType = 'all'">
                    <span class="count__title">전체</span>
                    <em class="count__value count__value--gray">{{count.total}}</em>
                </li>
                <li class="count__box" @click="listType = 'ing'">
                    <span class="count__title">진행중</span>
                    <em class="count__value">{{count.ing}}</em>
                </li>
                <li class="count__box" @click="listType = 'done'">
                    <span class="count__title">진행완료</span>
                    <em class="count__value count__value--gray">{{count.end}}</em>
                </li>
            </ul>
        </div>

        <div class="fb__todo__content">
            <nav class="fb__todo__sort">
                <select v-model="sortType">
                    <option value="order">내가설정한순</option>
                    <option value="deadline">마감기한순</option>
                    <option value="priority">우선순위순</option>
                    <option value="timestamp">등록순</option>
                </select>
            </nav>

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
                    <ul class="fb__todo__list" :class="listType">
                         <draggable v-model="todoList" :options="{disabled : !editMode}" handle=".each__sort">
                            <transition-group type="transition">
                                <template v-for="(list, index) in todoList">
                                    <!-- 리스트 -->
                                    <li ref="todoEachBox" 
                                        class="fb__todo__each swiper-container" 
                                        :class="list.status ? 'done' : list.priority ? 'red' : ''" 
                                        :data-uuid="list.id"
                                        :key="index"
                                        v-touch:touchhold="changeToEditMode">
                                        
                                        <div class="each__wrapper swiper-wrapper">
                                            <div class="each__content swiper-slide" v-touch:start="hideOtherController">
                                                <span class="each__sort" v-show="editMode">정렬 바꾸기</span>

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
                            </transition-group>
                        </draggable>
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

        <add-todo-modal 
            :isShow="addModal.isOpen" 
            :addData="sendData" 
            :mode="addModal.mode"
            @touch-down="closeAddModal($event)" 
            @complete-add-todo="todoListInit('fromAddModal')" 
            @close-add-modal="closeAddModal($event)"
        ></add-todo-modal>
    </section>
</template>

<script>
    import AddTodoModal from '/components/AddTodoModal.vue';
    import draggable from 'vuedraggable';

    export default {
        name: "toodList",

        components: {
            "add-todo-modal": AddTodoModal,
            "draggable": draggable
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
                    mode: "ADD"
                },

                todoList: [],

                searchText: "",
                
                count: {
                    total: 0,
                    ing: 0,
                    end: 0,
                },

                sendData: {},

                sliders: [],

                sortType: "deadline",

                listType: "all",

                editMode: false,

            }
        },

        created() {
            this.todoListInit();
        },

        watch: {
            sortType(_value, _before) {
                this.orderBySortType(_value);
            }
        },

        methods: {
            /**
             * 기본이벤트 
             */

            // todolist 리스트 가져오기
            async todoListInit(_from) {
                try {
                    const response = await this.requestTodoList(this.sortType);

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

            // 검색하기
            async searchTodoList(e) {
                const response = await this.requestTodoList();
                const targetLists = response.filter(v => v.content.indexOf(this.searchText) != -1);

                this.todoList = targetLists;
            },

            // 추가하기 (모달 열기)
            addTodoList(e) {
                this.addModal.mode = "ADD";
                this.sendData = {
                    deadline: moment(new Date()).format("YYYY-MM-DD")
                };

                this.addModal.isOpen = true;
                this.resetSlide();
            },

            // 수정하기 (모달 열기)
            editTodoList(list, index) {
                Object.assign(this.sendData, list);
                this.addModal.mode = "EDIT";

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
            
            /**
             * 기타 이벤트
             */

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
                // return moment(date).format("YYYY.MM.DD") + " " + dayList[date.getDay()];
                return moment(date).format("YYYY.MM.DD");
            },

            //요일 들어간 날짜 구하기
            getDday(_deadline) {
                const today = moment(new Date()).format("YYYY-MM-DD");
                let dday = moment(_deadline).diff(moment(today), "days");

                if (dday == 0) dday = "D-DAY";
                else if (dday < 0) dday = `D${String(dday).replace("-", "+")}`
                else dday = `D-${dday}`;

                return dday;
            },

            //슬라이드 실행
            makeSlider() {
                const listElementList = this.$refs["todoEachBox"];

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

            // 컨트롤러 HIDE
            hideOtherController(e) {
                const $this = $(e.target);
                const _index = $this.closest(".fb__todo__each").index();

                this.sliders.forEach((slide, idx) => {
                    if (_index != idx) this.resetSlide(slide);
                });
            },      
            
            changeToEditMode() {
                this.editMode = true;
            },

            //정렬
            async orderBySortType(_value) {
                const response = await this.requestTodoList(_value);
                console.log(_value, response);
                this.todoList = response;
            },

            //편집 취소
            async sortCancel() {
                const response = await this.requestTodoList();
                this.todoList = response;
                this.editMode = false;
            },

            //편집 적용
            sortChangeSaved() {
                this.todoList.forEach((list, index) => {
                    list.order = index;
                    this.collection.doc(list.id).update(list);
                });
                
                this.sortType = "order";
                this.editMode = false;
            },
        }
    }
</script>