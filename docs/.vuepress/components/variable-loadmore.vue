<template>
  <div class="variable-loadmore">
    <lite-virtual-list type="variable" :screen="[3, 3]" :data="items" virtualHieght="500px" @loadMore="loadMore" :size="100" :remain="8" :distance="100">
      <div class="item" slot-scope="{ item }">
        <span class="index"> #{{ item.index + 1 }} </span>
        <span> {{ item.value }}</span>
      </div>
      <loading slot="bottom" style="height: 70px" color="red" v-if="isLoad"></loading>
    </lite-virtual-list>
  </div>
</template>
<script>
import loading from './loading'
import Mock from 'mockjs'
let count = 50
let items = []
for (let i = 0; i < count; i++) {
  items.push({ id: i, value: Mock.Random.cparagraph(1, 5) })
}
export default {
  name: 'variable-loadmore',
  data() {
    return { items, isLoad: false, loadindex: 0 }
  },
  components: {
    loading,
  },
  methods: {
    loadMore() {
      if (this.isLoad) return
      this.isLoad = true
      setTimeout(() => {
        let items = []
        this.loadindex++
        for (let i = this.loadindex * count; i < this.loadindex * count + count; i++) {
          items.push({ id: i, value: Mock.Random.cparagraph(1, 5) })
        }
        this.items = [...this.items, ...items]
        this.isLoad = false
      }, 400)
    },
  },
}
</script>
<style  scoped>
.variable-loadmore {
  margin-top: 30px;
  max-width: 375px;
  margin: 30px 0;
  border: 1px solid #efefef;
}
.item {
  border-bottom: 1px solid #efefef;
  padding: 15px;
  font-size: 14px;
  color: #262626;
}
.index {
  font-weight: bold;
  margin-right: 4px;
  color: red;
}
</style>

