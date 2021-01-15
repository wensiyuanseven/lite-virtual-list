<template>
  <div class="variable">
    <lite-virtual-list type="variable" :screen="[3, 3]" :deleteId="deleteId" @deleteSuccess="deleteSuccess" :data="items" virtualHieght="500px" :size="100" :remain="8" :distance="100">
      <div class="item" slot-scope="{ item }">
        <div>
          <span class="index"> #{{ item.id + 1 }} </span>
          <span> {{ item.value }}</span>
        </div>
        <button @click="deleteItem(item)">删除</button>
      </div>
    </lite-virtual-list>
  </div>
</template>
<script>
import Mock from 'mockjs'
let count = 100
let items = []

for (let i = 0; i < count; i++) {
  items.push({ id: i, index: i, value: Mock.Random.cparagraph(1, 5) })
}
export default {
  name: 'variable-size',
  data() {
    return { items, deleteId: null }
  },
  methods: {
    deleteItem(item) {
      this.deleteId = item.id
    },
    deleteSuccess(item) {
      console.log(item)
      alert('删除成功')
    },
  },
}
</script>
<style  scoped>
.variable {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}
button {
  margin-left: 10px;
  flex-shrink: 0;
  cursor: pointer;
}
.index {
  font-weight: bold;
  margin-right: 4px;
  color: red;
}
</style>

