# lite-virtual-list

 ![version](https://img.shields.io/github/package-json/v/wensiyuanseven/lite-virtual-list) ![last commit](https://img.shields.io/github/last-commit/wensiyuanseven/lite-virtual-list)  ![issues](https://img.shields.io/github/issues/wensiyuanseven/lite-virtual-list)

## Virtual list component library supporting waterfall flow based on Vue

- **Support fixed height**

- **Support variable height**

- **Support two column waterfall flow layout**

- **Support DOM multi screen configuration**

- **Support status selection**

- **Support data dynamic appending**

- **Support dynamic deletion of data**

[中文文档](https://github.com/wensiyuanseven/lite-virtual-list/blob/master/README_zh-CN.md)

 Document：<https://wensiyuanseven.github.io/lite-virtual-list>

 Example：<https://wensiyuanseven.github.io/lite-virtual-list/example>

## Use

### Install

``` sh
npm install lite-virtual-list
```

### Use

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
| data     | Array |[ ]| ✓          | Data source: each item in the data source must be an object, and each item must pass in a unique ID value `{ID: number \| string}`. When the type is`waterfall`, each item passes in the height field `{height: number | string}`, that is, the height of each item|
| type | String    | | ✓ |  Type: three types can be specified: `fixed` ,`variable`, `waterfall`. Fixed: the height of the item is a fixed value. Variable: the height of the item supports the waterfall layout according to the content                             |
| remain   | Number \| String    | |  ✓  |  Number of visible data per screen |
| size   | Number \| String    |  |   |  Size is the height of each item. When type is `fixed` or `variable`, size is required. When type is `variable`, size will be used as the default height of each item. After DOM rendering, the default height will be replaced by the real height |
| screen   | Array    | [ 1 , 1 ]|   |  The number of screens rendered before and after the viewable area. The default value is `[1,1]`, rendering one screen before and one screen after the viewable area. Example: `screen = [2,3]` means that two screens are rendered in front of the viewable area and three screens are rendered behind the viewable area. |
| distance   | Number \| String    |50|    |  The distance to trigger the `loadmore` callback when the page scrolls. The default is `50` |
| interval   | Number \| String    | 0|   | `Scroll` event trigger interval, default is `0`  |
| virtualHieght   | String    | 100%|   |  The height of the virtual list is' 100% 'by default. When the type is `fixed`, the height will be calculated dynamically according to the `size` and `remain` attributes. This value is not required to be passed in. When the type is `variable` or `waterfall`, if this property is not passed in, the external container must declare a height value. |
| unit   | String    | px |   | Unit, default is `PX` |
| deleteId   |  Number \| String  |   |  | When dynamically deleting an item, the ID value of the current item needs to be passed in. When the type is `fixed`, the deletion ID is not passed in, and the current item is deleted directly `this.data.splice (index, 1)`delete is OK. At this time, the high value will be calculated dynamically
| marginBottom   |  Number \| String     |  0 |  |  The distance between items. This property is provided only when type is `waterfall`. It is invalid when type is `fixed` or `variable` |

## Slot

 ```vue
  <lite-virtual-list >
    <!-- The default slot can get the data of each item-->
    <template slot="default" slot-scope="{ item }" >
       <div>{{item.id}}</div>
    </template>

    <!-- bottom -->
    <template slot="bottom">
      <div>Loading...</div>
    </template>
  </lite-virtual-list>
 ```

## Event

### scroll

  Triggered when page scrolls

  The callback returns an object

  When the type is `fixed` or `variable`, the object contains the following properties:

- `scrollTop` : How far the page scrolls

- `renderScrollTop` :  Distance between the render area and the page scroll

- `renderData` : Data rendered while scrolling

When the type is `waterfall`, the object contains the following properties:

- `scrollTop` : How far the page scrolls
- `renderLeftScrollTop` :  Distance between the data rendering area in the left column and the page scrolling
- `renderRightScrollTop` :  Distance between the right column data rendering area and the page scrolling
- `renderLeftData` :  Left column scrolls the rendered data
- `renderLeftData` : Right column scrolls the rendered data

### domUpdateSuccess

 Trigger after DOM rendering to page

  When the type is `fixed` or `variable`, the callback will return

  `renderData` : Data rendered to the page

  When the type is `variable`, the callback will return an object containing the following properties:

- `renderLeftData` : Left column scrolls the rendered data
- `renderLeftData` : Right column scrolls the rendered data

### loadMore

 This callback is triggered when the page scrolls to the bottom. You can configure how far it is from the bottom in combination with the 'distance' property. The default value is `50`

### deleteSuccess

 Dynamic deletion of an item will be triggered after success, and the callback will return the data of the currently deleted item
