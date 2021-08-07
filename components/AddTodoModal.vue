<template>
    <article class="fb__addModal" :class="isShow ? 'show' : ''">
        <form class="fb__addModal__form">
            <fieldset>
                <legend>이벤트 등록하기</legend>

                <header class="fb__addModal__top">
                    <button type="button" class="fb__addModal__cancel" @click="closeModal($event)">취소</button>
                    
                    <h2 class="fb__addModal__title">이벤트 등록하기</h2>
                    
                    <button type="button" class="fb__addModal__submit" @click="addTodoList($event)">
                        {{mode == "ADD" ? "추가" : "수정"}}
                    </button>
                </header>

                <div class="fb__addModal__write">
                    <dl class="write__list">
                        <dt class="write__title">우선순위</dt>
                        <dd class="write__cont fb__toggle">
                            <label class="toggle__label">
                                <input type="checkbox" class="toggle__checkbox" v-model="addData.priority">
                                <div class="toggle__text">
                                    <span class="toggle__text--on">ON</span>
                                    <span class="toggle__text--off">OFF</span>
                                </div>  
                                <span class="toggle__icon">동그라미 아이콘</span>
                            </label>
                        </dd>
                    </dl>

                     <dl class="write__list">
                        <dt class="write__title">내용</dt>
                        <dd class="write__cont">
                            <input type="text" placeholder="일정을 입력하세요." maxlength="100" v-model="addData.content">
                        </dd>
                    </dl>

                    <dl class="write__list">
                        <dt class="write__title">마감기한</dt>
                        <dd class="write__cont">
                            <input type="date" v-model="addData.deadline">
                        </dd>
                    </dl>
                </div>
            </fieldset>
        </form>

        <div v-show="fetches.dbConnect == true" class="fb__loading__icon">
            edit loading...
        </div>
    </article>
</template>

<script>
    export default {
        name: "AddTodoModal",
        props: {
            isShow: {
                type: Boolean,
                default: true
            },

            mode: {
                type: String,
                default: "ADD"
            },

            addData: {
                type: Object,
                default: null
            },
        },

        data() {
            return {
                fetches: {
                    dbConnect: false
                },

                addData: {
                    priority: null,
                    content: null,
                    deadline: null,
                    status: false,
                    createDate: null,
                    timestamp: null,
                },

            }
        },

        created() {
        },

        watch: {
            isShow(_value) {
            }
        },

        methods: {
            closeModal(e) {
                this.$emit("close-add-modal", {
                    e
                })
            },

            addComplete() {
                this.$emit("complete-add-todo")
            },

            //추가 유효성 검사
            addValidationCheck() {
                const addData = this.addData;
                let isPass = true;
                
                if (!addData.content || addData.content.trim() == "") {
                    alert("내용은 한 글자 이상 입력해주세요.");
                    isPass = false;
                }

                else if (!addData.deadline) {
                    alert("마감기한을 선택해주세요.")
                    isPass = false;
                }

                else if (moment(addData.deadline).diff(moment(new Date()).format("YYYY-MM-DD")) < 0) {
                    alert("마감기한이 잘못 설정되었습니다.")
                    isPass = false;
                }

                return isPass;
            },

            //추가하기
            async addTodoList() {
                const isPass = this.addValidationCheck();

                if (!isPass) return ;
                this.fetches.dbConnect = true;

                try {
                    // 추가 
                    if (this.mode == "ADD") {
                        const _today = new Date();
    
                        Object.assign(this.addData, {
                            createDate: moment(_today).format("YYYY-MM-DD"),
                            timestamp: _today.getTime()
                        })
    
                        //DB연동
                        await this.collection.add(this.addData)
                            .then(result => {
                                console.log(result);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }

                    //수정
                    else {
                        const ref = this.collection.doc(this.addData.id);
                        await ref.update(this.addData);
                    }
                }
                catch(err) { 
                    console.error("addTodoList error", err)
                }

                finally {
                    this.fetches.dbConnect = false;
                    this.addComplete();
                }
            },
        }

    };
</script>