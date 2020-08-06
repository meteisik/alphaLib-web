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
import TheGraph from '~/components/ConceptMap/TheGraph'
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
      // SAMPLE DATA
      const testNodes = [
        {
          _id: '493-324-662-43X-65X',
          group: 'Cited Works',
          radius: 2,
          citing_patents_count: 2,
          content:
            'lets define behavioral psychology. Behavioral psychology is the study of the connection between our minds and our behavior. Sometimes you will hear behavioral psychology referred to as behaviorism. The researchers and scientists who study behavioral psychology are trying to understand why we behave the way we do and they are concerned with discovering patterns in our actions and behaviors. The hope is that if we can use behavioral psychology to help us predict how humans will behave, we can build better habits as individuals, create better products as companies, and develop better living spaces as communities.',
          _source: {
            meta: {
              title: 'TEST 1'
            }
          }
        },
        {
          _id: '109-294-662-661-65X',
          group: 'Cited Works',
          content:
            'Before we get into the guide, I want to recommend the most comprehensive guide on how to change your habits and get 1% better every day: My new book Atomic Habits. Packed with evidence-based self-improvement strategies, Atomic Habits will teach you how to make the small changes that will transform your habits and deliver remarkable results.',
          _source: {
            meta: {
              title: 'TEST 2'
            }
          }
        },
        {
          _id: '23X-294-662-661-65X',
          group: 'Cited Works',
          radius: 2,
          content:
            'Motivation is a powerful, yet tricky beast. Sometimes it is really easy to get motivated, and you find yourself wrapped up in a whirlwind of excitement. Other times, it is nearly impossible to figure out how to motivate yourself and youre trapped in a death spiral of procrastination. This page contains the best ideas and most useful research on how to get and stay motivated. This isnt going to be some rah-rah, pumped-up motivational speech. (Thats not my style.) Instead, were going to break down the science behind how to get motivated in the first place and how to stay motivated for the long-run. Whether youre trying to figure out how to motivate yourself or how to motivate a team, this page should cover everything you need to know. You can click the links below to jump to a particular section or simply scroll down to read everything. At the end of this page, youll find a complete list of all the articles I have written on motivatio ',
          _source: {
            meta: {
              title: 'TEST 3'
            }
          }
        }
      ]
      let conceptIdCounter = 1000 // changing int which is assigned to concept nodes
      const docNodes = [] // document node array
      const conNodes = [] // concept node array
      let nodes = [] // array which holds all nodes to be passed to TheGraph.Vue
      const links = [] // link node array
      const that = this
      // make sure dataset has been defined. if not, just test nodes
      const _dataset = this.dataset
      console.log('', testNodes)
      for (const d of _dataset) {
        // _dataset.forEach(function(d) {
        // for loop, cycles through each dataset element
        // - TEST DATA LINE
        const indexOfCurrentDoc = _dataset.indexOf(d)
        // create node for current dataset element
        if (d._source.meta.title === undefined) {
          docNodes[indexOfCurrentDoc] = {
            id: d._id,
            // content: d.content, - LINE FOR CONTENT
            title: 'TITLE_UNDEFINED', // LINE FOR TITLE
            group: 'Undefined Title'
          }
        } else {
          docNodes[indexOfCurrentDoc] = {
            id: d._id,
            // content: d.content, - LINE FOR CONTENT
            title: d._source.meta.title, // LINE FOR TITLE
            group: 'Cited Works'
          }
        }
        // identify all concept words
        const conceptWordDict = that.getNoneStopWords(
          // docNodes[indexOfCurrentDoc].content.toLowerCase() - LINE FOR CONTENT
          docNodes[indexOfCurrentDoc].title.toLowerCase() // LINE FOR TITLE
        )
        // for each concept in doc
        for (const b of conceptWordDict) {
          // conceptWordDict.forEach(function(b) {
          let wordIndex = 0
          // if concept hasn't been added to conNodes
          let found = false
          if (conNodes.length !== 0) {
            for (let i = 0; i < conNodes.length; i++) {
              if (conNodes[i].conceptWord.localeCompare(b) === 0) {
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
              conceptWord: b
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
      console.log('docNodes: ', docNodes)
      console.log('conNodes: ', conNodes)
      console.log('links: ', links)
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
        'nor',
        'not',
        'of',
        'off',
        'often',
        'on',
        'only',
        'or',
        'other',
        'our',
        'own',
        'rather',
        'said',
        'say',
        'says',
        'she',
        'should',
        'since',
        'so',
        'some',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'these',
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
