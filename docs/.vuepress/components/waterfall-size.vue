<template>
  <div class="waterfall">
    <lite-virtual-list  type="waterfall" :screen="[2, 2]" :marginBottom="12" @deleteSuccess="deleteSuccess" :deleteId='deleteId' :remain="8" virtualHieght="500px"  :data="items" :distance="100">
      <div class="item" slot-scope="{ item }" @click='deletItem(item)'>
        <span class="index">#{{ item.id + 1 }}</span>&nbsp;<span>{{ item.value }}</span>
      </div>
    </lite-virtual-list>
    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'

export default {
  name: 'waterfall-size',
  data() {
    return { items: [], deleteId: null }
  },
  mounted() {
    let count = 1000
    let items = []
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
    deletItem(item) {
      this.deleteId = item.id
    },
    deleteSuccess(item) {
      console.log(item)
    },
    getValueHeight(value, index) {
      let node = document.createElement('div')
      node.innerHTML = `#${index} ${value}`
      node.style.cssText = 'width:175px;padding:15px;font-size:14px;box-sizing:border-box;'
      document.body.appendChild(node)
      let height = node.clientHeight
      document.body.removeChild(node)
      return height
    },
  },
}
</script>
<style  scoped>
.waterfall {
  background-color: #f9f9f9;
  padding: 10px 0;
  width: 375px;
  margin: 30px 0;
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
</style>

