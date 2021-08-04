
<template>
    <section class="fb__db">
        <h2 class="fb__title--hidden">일정 확인 앱</h2>
        <ul class="fb__db__list">
            <li v-for="(list, index) in user" :key="index">
                <em>아이디: {{list.userid}}</em>
                <p>이름: {{list.name}}</p>
            </li>
        </ul>
    </section>
</template>

<script>
    export default {
        name: "dbtest",
        async asyncData({app, query}) {
            const user = await app.$axios.$get(`/api`);
            return { user }
        },
        head() {
            return {
            }
        },

        data() {
            return {
               
            }
        },
    }
</script>

<style lang="scss">
    .fb__db {
        li {
            padding: 20px;
            border-bottom: 1px solid #ddd;
        }
    }
</style>