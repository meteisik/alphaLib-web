<template>
  <div>
    <slot v-for="item in items" :item="item">
      <!--fallback content-->
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style></style>
