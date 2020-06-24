<template>
  <div>
    <div>
      <input type="text" v-model="idInput" />
      <button @click="onIdInput">CLICK HERE TO SEND REQUEST</button>
    </div>
    <p>{{ idInput }}</p>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  name: 'Analytics',
  data() {
    return {
      idInput: 'ID here'
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    onIdInput() {
      this.$router.push('/analytics/' + this.idInput)
    }
  }
}
</script>

<style scoped></style>
