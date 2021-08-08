import $ from "jquery";

const mixin = {
    data() {
        return {
            collection: database.collection("todolist"),
        }
    },
    methods: {
        /**
         * api통신
         * @param {*} object 
         */
        requestApi (object) {
            if (!object.url) return ;
            
            return new Promise((resolve, reject) => {
                try {
                    $.ajax({
                        type: object.type ? object.type : "POST",
                        url: object.url,
                        data: object.data ? object.data : "",
                        success (result) {
                            resolve(result);
                        },
            
                        error(error) {
                            reject(error)
                        }
                    });
                }
            
                catch(error) {
                    reject(error)
                }
            })
        },

        getJsondata(url) {
            if (!url) return ;

            return new Promise((resolve, reject) => {
                try {
                    $.getJSON(url, (data) => {
                        resolve(data);
                    })
                }

                catch(error) {
                    reject("getJsondata has exception...", error)
                }
            })
           
        },

        // todolist 데이터 요청
        requestTodoList(_orderBy) {
            return new Promise((resolve, reject) => {
                try {
                    this.collection.orderBy(_orderBy || "timestamp").get().then((result) => {
                        const customData = [];

                        result.forEach(list => {
                            customData.push(Object.assign(list.data(), {
                                id: list.id
                            }));
                        })

                        if (_orderBy != "deadline"
                            && _orderBy != "order"
                        ) {
                            customData.reverse();
                        }

                        resolve(customData);
                    })
                }

                catch (error) {
                    reject(error);
                }
            })
        },
    }
}

export default mixin;