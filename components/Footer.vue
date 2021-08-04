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
                menuOpen: "list",
            }
        },

        created() {
            console.log(window.location.pathname);
            if (window.location.pathname === "/calendar") {
                this.menuOpen = "calendar";
            }
            else {
                this.menuOpen = "list";
            }
        }
    }
</script>