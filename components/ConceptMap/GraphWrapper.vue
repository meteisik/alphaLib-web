<template>
  <v-card
    class="mx-auto"
    :outlined="null"
    :flat="flat"
    :hover="hover"
    :rounded="rounded"
    :max-width="maxWidth"
  >
    <v-card-title>
      {{ label }}
    </v-card-title>
    <v-card-text :id="divId">
      <TheGraph
        :svg-id="svgId"
        :width="chartWidth"
        :height="chartHeight"
        :links="transformDataset.links"
        :nodes="transformDataset.nodes"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import TheGraph from '@/components/ConceptMap/TheGraph'
export default {
  name: 'GraphWrapper',
  components: { TheGraph },
  props: {
    id: {
      type: String,
      default: 'heatmap'
    },
    divId: {
      type: String,
      default: 'heatmap-div'
    },
    svgId: {
      type: String,
      default: 'heatmap-svg-element'
    },
    chartHeight: {
      type: Number,
      default: 100
    },
    chartWidth: {
      type: Number,
      default: 100
    },
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
    label: {
      type: String,
      default: 'This Amazing HeatMap'
    },
    dataset: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      HeatMapData: {
        que: '',
        docName: '',
        value: 0,
        id: ''
      },
      // TODO: remove the sample data and replace it with docs
      sample: {
        nodes: [
          {
            id:
              'Structural basis of PROTAC cooperative recognition for selective protein degradation.',
            group: 'Cited Works',
            radius: 2,
            citing_patents_count: 2
          },
          { id: '109-294-662-661-65X', group: 'Citing Patents' }
        ],
        links: [
          {
            source:
              'Structural basis of PROTAC cooperative recognition for selective protein degradation.',
            target: '109-294-662-661-65X',
            value: 2
          }
        ]
      }
    }
  },
  computed: {
    transformDataset() {
      // console.log('QUERIES', this.$store.state.searchQueries)
      let conceptIdCounter = 1000 // changing int which is assigned to concept nodes
      const docNodes = [] // document node array
      const conNodes = [] // concept node array
      let nodes = [] // array which holds all nodes to be passed to TheGraph.Vue
      const links = [] // link node array
      const that = this
      // make sure dataset has been defined. if not, just test nodes
      const _dataset = this.dataset
      for (const d of _dataset) {
        if (d.highlight === undefined) {
          console.log('')
        } else {
          let highlightString = ''
          const indexOfCurrentDoc = _dataset.indexOf(d)
          // create node for current dataset element
          for (const c of d.highlight.content) {
            highlightString += c
          }
          highlightString = highlightString.split('<mark>').join('') // cleaning up highlights
          highlightString = highlightString.split('</mark>').join('')
          highlightString = highlightString.replace(/[0-9]/g, '')
          if (d._source.meta.title === undefined) {
            docNodes[indexOfCurrentDoc] = {
              id: d._id,
              content: highlightString,
              title: 'TITLE_UNDEFINED',
              group: 'Undefined Title',
              radius: 5
            }
          } else {
            docNodes[indexOfCurrentDoc] = {
              id: d._id,
              content: highlightString,
              title: d._source.meta.title,
              group: 'Cited Works',
              radius: 6
            }
          }
          // identify all concept words
          const conceptWordDict = that.getNoneStopWords(
            docNodes[indexOfCurrentDoc].content.toLowerCase()
          )
          // for each concept in doc
          for (const b of conceptWordDict) {
            // conceptWordDict.forEach(function(b) {
            let wordIndex = 0
            // if concept hasn't been added to conNodes
            let found = false
            if (conNodes.length !== 0) {
              for (let i = 0; i < conNodes.length; i++) {
                if (conNodes[i].title.localeCompare(b) === 0) {
                  wordIndex = i
                  found = true
                  break
                }
              }
            }
            if (!found) {
              // add concept to conNodes array
              conNodes[conNodes.length] = {
                id: conceptIdCounter,
                group: 'Concept Nodes',
                title: b,
                radius: 5
              }
              wordIndex = conNodes.length - 1
              conceptIdCounter++
              // create link between concept node and doc node
              links[links.length] = {
                source: docNodes[indexOfCurrentDoc].id,
                target: conNodes[wordIndex].id,
                value: 2
              }
            } else {
              links[links.length] = {
                source: docNodes[indexOfCurrentDoc].id,
                target: conNodes[wordIndex].id,
                value: 2
              }
            }
          }
        }
      }
      // console.log('docNodes: ', docNodes)
      // console.log('conNodes: ', conNodes)
      // console.log('links: ', links)
      nodes = docNodes.concat(conNodes)
      return { nodes, links }
    }
  },
  methods: {
    // method which returns all uncommon words to be used as the concepts of a document
    getNoneStopWords(sentence) {
      // method to remove common words
      const common = this.getStopWords()
      const wordArr = sentence.match(/\w+/g)
      const commonObj = {}
      const uncommonArr = []
      let word, i
      for (i = 0; i < common.length; i++) {
        commonObj[common[i].trim()] = true
      }
      for (i = 0; i < wordArr.length; i++) {
        word = wordArr[i].trim().toLowerCase()
        if (!commonObj[word]) {
          uncommonArr.push(word)
        }
      }
      return uncommonArr
    },
    getStopWords() {
      // list of common words
      return [
        'a',
        'able',
        'about',
        'across',
        'after',
        'all',
        'almost',
        'also',
        'am',
        'among',
        'an',
        'and',
        'any',
        'are',
        'as',
        'at',
        'be',
        'because',
        'been',
        'but',
        'by',
        'can',
        'cannot',
        'could',
        'dear',
        'did',
        'do',
        'does',
        'either',
        'else',
        'ever',
        'every',
        'for',
        'from',
        'get',
        'got',
        'had',
        'has',
        'have',
        'he',
        'her',
        'hers',
        'him',
        'his',
        'how',
        'however',
        'i',
        'if',
        'in',
        'into',
        'is',
        'it',
        'its',
        'just',
        'least',
        'let',
        'like',
        'likely',
        'may',
        'me',
        'might',
        'most',
        'must',
        'my',
        'neither',
        'no',
        'those',
        'nor',
        'not',
        'whether',
        'bit',
        'consider',
        'of',
        'upon',
        'off',
        'often',
        'on',
        'b',
        'only',
        'thousand',
        'ten',
        'or',
        'other',
        'our',
        'own',
        'rather',
        'said',
        'each',
        'say',
        'says',
        'she',
        'should',
        'since',
        'well',
        'possible',
        'so',
        'some',
        'than',
        'that',
        'the',
        'their',
        'through',
        'them',
        'then',
        'there',
        'these',
        'having',
        'many',
        'one',
        'they',
        'this',
        'tis',
        'to',
        'too',
        'twas',
        'us',
        'wants',
        'was',
        'we',
        'were',
        'what',
        'when',
        'where',
        'which',
        'while',
        'who',
        'whom',
        'why',
        'will',
        'with',
        'would',
        'yet',
        'you',
        'your',
        "ain't",
        "aren't",
        "can't",
        "could've",
        "couldn't",
        "didn't",
        "doesn't",
        "don't",
        "hasn't",
        "he'd",
        "he'll",
        "he's",
        "how'd",
        "how'll",
        "how's",
        "i'd",
        "i'll",
        "i'm",
        "i've",
        "isn't",
        "it's",
        "might've",
        "mightn't",
        "must've",
        "mustn't",
        "shan't",
        "she'd",
        "she'll",
        "she's",
        "should've",
        "shouldn't",
        "that'll",
        "that's",
        "there's",
        "they'd",
        "they'll",
        "they're",
        "they've",
        "wasn't",
        "we'd",
        "we'll",
        "we're",
        "weren't",
        "what'd",
        "what's",
        "when'd",
        "when'll",
        "when's",
        "where'd",
        "where'll",
        "where's",
        "who'd",
        "who'll",
        "who's",
        "why'd",
        "why'll",
        "why's",
        "won't",
        "would've",
        "wouldn't",
        "you'd",
        "you'll",
        "you're",
        "you've"
      ]
    }
  }
}
</script>
<style scoped></style>
