<template>
  <footer class="fb__footer">
       <div class="fb__footer__wrapper">
           <div class="fb__footer__menus">
                <NuxtLink to="/" class="fb__footer__menu" :class="menuOpen=='list' ? 'active' : ''" @click="menuOpen='list'">리스트</NuxtLink>
                <NuxtLink to="/calendar" class="fb__footer__menu" :class="menuOpen=='calendar' ? 'active' : ''" @click="menuOpen='calendar'">달력</NuxtLink>
           </div>
       </div>
  </footer>
</template>
<script>
    export default {
        data() {
            return {
                menuOpen: "calendar",
            }
        },

        created() {
            if (window.location.pathname === "/") {
                this.menuOpen = "list";
            }
            else {
                this.menuOpen = "calendar";
            }
        }
    }
</script>