template>
  <!--  TODO: Edit this file -->
  <v-card
    class="mx-auto"
    :loading="meta.isLoading"
    :outlined="outlined"
    :flat="flat"
    :hover="hover"
    :rounded="rounded"
    :max-width="maxWidth"
  >
    <template v-show="meta.isLoading === false">
      <v-img
        v-show="meta.image"
        height="250"
        src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
      ></v-img>

      <template v-if="meta.isLoading === false">
        <v-card-title
          >{{ meta.title }} ({{
            `${meta.number_of_pages} Pages`
          }})</v-card-title
        >

        <v-card-text>
          <v-row align="center" class="mx-0">
            <div class="grey--text">{{ meta.created_date }}</div>
          </v-row>

          <div class="my-4 subtitle-1">
            {{ meta.author }}
          </div>

          <div>
            {{ meta.abstract }}
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
      </template>

      <v-card-actions>
        <v-btn color="deep-purple lighten-2" text @click="viewDoc(meta.doc_id)">
          View Doc
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'TheInfoBox',
  props: {
    flat: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    hover: {
      type: Boolean,
      default: true
    },
    rounded: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: '100%'
    },
    meta: {
      type: Object,
      default: () => ({
        isLoading: true,
        doc_id: '',
        image: '',
        title: '',
        author: '',
        created_date: null,
        abstract: '',
        number_of_pages: 0
      })
    }
  },
  data: () => ({
    selection: 1
  }),
  methods: {
    reserve() {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
    viewDoc(docId) {
      this.$router.push('/docs/' + docId)
    }
  }
}
</script>

<style scoped></style>
