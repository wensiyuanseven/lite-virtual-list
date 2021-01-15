
# 用法

## 安装

``` sh
npm install lite-virtual-list
```

```js
import liteVirtualList from "lite-virtual-list"

Vue.use(liteVirtualList)
```

```vue
<template>
  <lite-virtual-list type="fixed" :size="80" :remain="8" :data="items">
    <div slot-scope="{ item }" style="height: 80px">{{ item.value }}</div>
  </lite-virtual-list>
</template>
<script>
    let items = []
    let count = 1000
    for (let i = 0; i < count; i++) {
        items.push({ id: i, value: i })
    }
    export default {
        data() {
            return { items }
        }
    }
</script>
```

## Props

| Props    | Type  |Default| Required   | Description                                   |
|:---------|:------|:-----------|:------------|:----------------------------------------
| data     | Array |[ ]| ✓          | 数据源,数据源中的每个item必须是一个对象, 每个item必须传入一个唯一id值  `{ id : Number \| String }`,当type为`waterfall`时,每个item传入height字段 `{ height : Number \| String }`,即每一项item的高度|
| type | String    | | ✓ |  type可指定三种类型 `fixed` `variable` `waterfall` fixed : item的高度为固定值    variable : item的高度根据内容撑起  waterfall : 瀑布流布局                              |
| remain   | Number \| String    | |  ✓  |  每屏可见的数据条数 |
| size   | Number \| String    |  |   |  size是每一项item的高度。 当type为 `fixed`或 `variable` 时size为必传项。 type为`variable`时 size会被当做每一项的默认高度，当DOM渲染完成后会用真实高度替换此默认高度 |
| screen   | Array    | [ 1 , 1 ]|   |  可视区前后渲染的屏数。 默认值为`[1,1]`,可视区前后各渲染一屏。 例：:screen="[2,3]" 表示可视区前面渲染两屏，可视区后面渲染三屏。 |
| distance   | Number \| String    |50|    |  页面滚动时触发`loadMore`回调的距离,默认为`50` |
| interval   | Number \| String    | 0|   |  `scroll`事件触发间隔,默认为`0` |
| virtualHieght   | String    | 100%|   |  虚拟列表的高度,默认为`100%`。当type为`fixed`时，高度会根据`size`和`remain`属性动态计算出来，不用传入此值。当type为`variable`或 `waterfall`时，若不传入此属性，外部容器必须声明一个高度值。 |
| unit   | String    | px |   |  单位，默认为`px` |
| deleteId   |  Number \| String  |   |  | 动态删除某一项时需要传入当前项目的id值,当type为`fixed`时，不传deleteId,直接`this.data.splice(index,1)`删除也行,此时内部会动态计算高度
| marginBottom   |  Number \| String     |  0 |  |  每项item的间隔距离。 此属性专门为`type='waterfall'`时提供,type为`fixed`或`variable`时此属性无效 |

## Slot

 ```vue
  <lite-virtual-list >
    <!-- 默认slot,可拿到每个item数据 -->
    <template slot="default" slot-scope="{ item }" >
       <div>{{item.id}}</div>
    </template>

    <!-- 底部 -->
    <template slot="bottom">
      <div>加载中...</div>
    </template>
  </lite-virtual-list>
 ```

## Event

### scroll

  页面滚动时触发

  该回调会返回一个对象

  当type为`fixed`或`variable`时,该对象包含以下 property :

- `scrollTop` : 页面滚动的距离

- `renderScrollTop` : 渲染区域距离页面滚动的距离

- `renderData` : 滚动时渲染的数据

当type为`waterfall`时,该对象包含以下 property :

- `scrollTop` : 页面滚动的距离

- `renderLeftScrollTop` : 左列数据渲染区域距离页面滚动的距离

- `renderRightScrollTop` : 右列数据渲染区域距离页面滚动的距离
- `renderLeftData` : 左列滚动被渲染的数据
- `renderLeftData` : 右列滚动时渲染的数据

### domUpdateSuccess

 DOM渲染到页面之后触发

  当type为`fixed`或`variable`时,该回调会返回

  `renderData` : 渲染到页面上的数据

  当type为`variable`时,该回调会返回一个对象,该对象包含以下 property :

- `renderLeftData` : 左列滚动被渲染的数据
- `renderLeftData` : 右列滚动时渲染的数据

### loadMore

 页面滚动到底部时触发 ,可结合`distance`属性配置距离底部多远时触发此回调，默认为`50`

### deleteSuccess

 动态删除某一项item成功后会触发,该回调会返回当前被删除项数据
