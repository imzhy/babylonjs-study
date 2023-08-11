<template>
  <div id="app-box">
    <router-view v-slot="{Component}">
      <component :is="Component"/>
    </router-view>
  </div>
</template>

<style scoped>
#app-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
