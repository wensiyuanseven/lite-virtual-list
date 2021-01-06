<template>
  <div class="waterfall">
    <lite-virtual-list  type="waterfall" :screen="[2, 2]" :marginBottom="12" :remain="8" @loadMore="loadMore" virtualHieght="500px"  :data="items" :distance="100">
      <div class="item" slot-scope="{ item }">
        <span class="index">#{{ item.id + 1 }}</span>&nbsp;<span>{{ item.value }}</span>
      </div>
    <loading slot="bottom"  class="loading" color="red" v-if="isLoad"></loading>
    </lite-virtual-list>

    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'
import loading from './loading'
let count = 20
let items = []
export default {
  name: 'waterfall-loadmore',
  components: {
    loading,
  },
  data() {
    return { items: [], isLoad: true, loadindex: 0 }
  },
  mounted() {
    for (let i = 0; i < count; i++) {
      let value = Mock.Random.cparagraph(3, 7)
      items.push({
        id: i, //必须设置id
        height: this.getValueHeight(value, i + 1), //必须设置height
        value: value,
      })
    }
    this.items = items
  },
  methods: {
    getValueHeight(value, index) {
      let node = document.createElement('div')
      node.innerHTML = `#${index} ${value}`
      node.style.cssText = 'width:175px;padding:15px;font-size:14px;box-sizing:border-box;'
      document.body.appendChild(node)
      let height = node.clientHeight
      document.body.removeChild(node)
      return height
    },
    loadMore() {
      this.isLoad = true
      setTimeout(() => {
        let items = []
        this.loadindex++
        for (let i = this.loadindex * count; i < this.loadindex * count + count; i++) {
          let value = Mock.Random.cparagraph(3, 7)
          items.push({
            id: i, //必须设置id
            height: this.getValueHeight(value, i + 1), //必须设置height
            value: value,
          })
        }
        this.items = [...this.items, ...items]
        this.isLoad = false
      }, 300)
    },
  },
}
</script>
<style  scoped>
.waterfall {
  background-color: #f9f9f9;
  width: 375px;
  margin: 30px 0;
  padding-top: 10px;
}
/deep/ .waterfall-list {
  padding: 6px;
}
.item {
  width: 95%;
  height: 100%;
  background-color: #ffffff;
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 13px;
  font-size: 14px;
}
.index {
  font-weight: bold;
  color: red;
}
.loading {
  margin-top: 10px;
  height: 70px;
}
</style>

