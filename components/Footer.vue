<template>
  <footer class="fb__footer">
       <div class="fb__footer__wrapper">
           <div class="fb__footer__menus">
                <NuxtLink to="/" class="fb__footer__menu fb__footer__menu--list" :class="menuOpen=='list' ? 'active' : ''" @click.native="menuActive('list')">리스트</NuxtLink>
                <NuxtLink to="/calendar" class="fb__footer__menu fb__footer__menu--calendar" :class="menuOpen=='calendar' ? 'active' : ''" @click.native="menuActive('calendar')">달력</NuxtLink>
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
           this.menuActive(window.location.pathname)
        },

        methods: {
            menuActive(type) {
                if (type.indexOf("calendar") != -1) {
                    this.menuOpen = "calendar";
                }
                else {
                    this.menuOpen = "list";
                }
            }
        }
    }
</script>