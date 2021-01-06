<template>
  <div class="fixed">
    <lite-virtual-list type="fixed" :screen="[3, 3]" :size="80" :remain="8" :data="items" @loadMore="loadMore" :interval="100" :distance="200">
      <div class="item" slot-scope="{ item }" style="height: 80px; font-size: 25px">
        {{ item.index + 1 }}
      </div>
      <loading slot="bottom" style="height: 70px" color="red" v-if="isLoad"></loading>
    </lite-virtual-list>
  </div>
</template>

<script>
import loading from './../components/loading'
let items = []
// 十万条数据
let count = 100000
for (let i = 0; i < count; i++) {
  items.push({ id: i, value: i })
}
Object.freeze(items)
export default {
  name: 'index',
  components: {
    loading,
  },
  data() {
    return { items, isLoad: false, loadindex: 0 }
  },
  methods: {
    loadMore() {
      if (this.isLoad) return
      this.isLoad = true
      setTimeout(() => {
        let items = []
        this.loadindex++
        for (let i = this.loadindex * count; i < this.loadindex * count + count; i++) {
          items.push({ id: i, value: i })
        }
        this.isLoad = false
        this.items = Object.freeze([...this.items, ...items])
      }, 600)
    },
  },
}
</script>
<style scoped>
.fixed {
  border: 1px solid red;
}
.item {
  border-bottom: 1px solid red;
  text-align: center;
  line-height: 80px;
  font-weight: bold;
}
</style>
