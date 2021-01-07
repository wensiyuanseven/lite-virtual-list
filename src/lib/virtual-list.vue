<template>
  <div class="virtual-list" ref="virtualList" @scroll.passive="getScrollFn">
    <div class="scroll-bar" ref="scrollBar"></div>

    <div class="scroll-list" ref="scrollList" :class="{ 'waterfall-list': isWaterfall }" :style="transform">
      <template v-if="isWaterfall">
        <div class="left-wrap" :style="{ transform: `translate3d(0,${leftOffset}px,0)` }">
          <div v-for="item in renderLeft" class="left-item" :vid="item.id" :style="setStyle(item)" :key="item.id">
            <slot :item="item"></slot>
          </div>
        </div>

        <div class="right-wrap" :style="{ transform: `translate3d(0,${rightOffset}px,0)` }">
          <div v-for="item in renderRight" class="right-item" :vid="item.id" :style="setStyle(item)" :key="item.id">
            <slot :item="item"></slot>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="item in renderData" :key="item.id" :vid="item.id" ref="nodes">
          <slot :item="item"></slot>
        </div>
      </template>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
import { getCurrentIndex, virtualType } from './../utils'
export default {
  name: 'lite-virtual-list',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // fixed variable waterfall
    type: {
      type: String,
      required: true,
    },
    // 每屏可见的数据条数
    remain: {
      type: [Number, String],
      required: true,
    },
    size: {
      type: [Number, String],
      required: false,
    },
    // 前后各渲染几屏
    screen: {
      type: Array,
      required: false,
      default: () => [1, 1],
    },
    //加载更多 触底距离
    distance: {
      type: [Number, String],
      required: false,
      default: 50,
    },
    // 截流函数触发间隔
    interval: {
      type: Number,
      required: false,
      default: 0,
    },
    virtualHieght: {
      type: String,
      required: false,
      default: '100%',
    },
    unit: {
      type: String,
      required: false,
      default: 'px',
    },
    marginBottom: {
      type: [Number, String],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      start: 0,
      end: 0,
      offset: 0,
      leftOffset: 0,
      rightOffset: 0,
      leftStart: 0,
      rightStart: 0,
      leftEnd: 0,
      rightEnd: 0,
      leftHeight: 0,
      rightHieght: 0,
      scrollTop: 0,
    }
  },
  computed: {
    isWaterfall() {
      return this.type === virtualType.WATERFALL
    },
    transform() {
      if (!this.isWaterfall) {
        return {
          transform: `translate3d(0,${this.offset}px,0)`,
        }
      }
      return null
    },
    renderLeft() {
      return this.waterfallInfo ? this.waterfallInfo.left.slice(this.leftStart - this.leftPrevCount, this.leftEnd + this.leftNextCount) : 0
    },
    renderRight() {
      return this.waterfallInfo ? this.waterfallInfo.right.slice(this.rightStart - this.rightPrevCount, this.rightEnd + this.rightNextCount) : 0
    },
    renderData() {
      return this.formatData.slice(this.start - this.prevCount, this.end + this.nextCount)
    },
    formatData() {
      return this.data.map((item, index) => ({ ...item, index }))
    },
    prevScreen() {
      return this.remain * this.screen[0]
    },
    nextScreen() {
      return this.remain * this.screen[1]
    },
    prevCount() {
      return Math.min(this.start, this.prevScreen)
    },
    leftPrevCount() {
      return Math.min(this.leftStart, this.prevScreen)
    },
    rightPrevCount() {
      return Math.min(this.rightStart, this.prevScreen)
    },
    nextCount() {
      return Math.min(this.data.length - this.end, this.nextScreen)
    },
    leftNextCount() {
      return this.waterfallInfo ? Math.min(this.waterfallInfo.left.length - this.leftEnd, this.nextScreen) : 0
    },
    rightNextCount() {
      return this.waterfallInfo ? Math.min(this.waterfallInfo.right.length - this.rightEnd, this.nextScreen) : 0
    },
  },
  watch: {
    data(newData, oldData) {
      // 防止组件外部单个item更改状态后触发watch 例
      // item.visible = true
      // this.$set(this.items, item.id, item)
      if (newData.length === oldData.length) return
      let prevLength, newLoadData
      switch (this.type) {
        case virtualType.FIXED:
          this.$refs.scrollBar.style.height = newData.length * this.size + this.unit
          break
        case virtualType.VARIABLE:
          prevLength = this.variableData.length
          newLoadData = newData.slice(prevLength)
          // pushData 此数据并没有偏移量  页面通过renderData更新之后 会触发update 在updated中通过渲染的节点会主动更新后面数据的偏移量
          this.variableData = [...this.variableData, ...this.getVisiblePosition(newLoadData)]
          break
        case virtualType.WATERFALL:
          prevLength = this.waterfallInfo.left.length + this.waterfallInfo.right.length
          newLoadData = newData.slice(prevLength)
          this.handleWaterfallData(newLoadData)
          break
      }
      // 当滚动时未触发回弹时会造成$emit('scroll')事件不执行 会导致懒加载处理的dom时获取到的是老数据
      this.$nextTick(() => {
        this.$emit('domUpdateSuccess', this.type === virtualType.WATERFALL ? { renderLeftData: this.renderLeft, renderRightData: this.renderRight } : this.renderData)
        this.emitScrollEvent()
      })
    },
  },
  created() {
    if (this.type === virtualType.WATERFALL) {
      this.waterfallInfo = { left: [], right: [] }
    }
    this.getScrollFn = throttle(this.handleScroll, this.interval, { leading: false })
  },
  mounted() {
    if (this.type !== virtualType.WATERFALL) {
      if (!this.size) {
        throw new Error(`type为${this.type}时，请传入size属性`)
      }
      this.$refs.scrollBar.style.height = this.data.length * this.size + this.unit
      this.end = this.start + this.remain
    }
    switch (this.type) {
      case virtualType.FIXED:
        this.$refs.virtualList.style.height = this.remain * this.size + this.unit
        break
      case virtualType.VARIABLE:
        this.variableData = []
        this.$refs.virtualList.style.height = this.virtualHieght
        this.variableData = this.getVisiblePosition(this.data)
        break
      case virtualType.WATERFALL:
        // 必须设置scrollList高度否则scrollList的高度会被 容器内容撑起造成高度与virtualList不同 则会出现滚动条偏移问题
        this.$refs.virtualList.style.height = this.$refs.scrollList.style.height = this.virtualHieght
        this.leftEnd = this.leftStart + this.remain
        this.rightEnd = this.rightStart + this.remain
        if (this.data && this.data.length) {
          this.handleWaterfallData(this.data)
        }
        break
    }
  },
  updated() {
    this.$nextTick(() => {
      const nodes = this.$refs.nodes
      if (this.type === virtualType.VARIABLE && nodes && nodes.length) {
        //用节点更新缓存
        nodes.forEach((node) => {
          let { height } = node.getBoundingClientRect()
          let index = +node.getAttribute('vid')
          let oldHeight = this.variableData[index].height
          let difference = oldHeight - height
          if (difference) {
            this.variableData[index].height = height
            this.variableData[index].bottom = this.variableData[index].bottom - difference
            for (let i = index + 1; i < this.variableData.length; i++) {
              this.variableData[i].top = this.variableData[i - 1].bottom
              this.variableData[i].bottom = this.variableData[i].bottom - difference
            }
          }
        })
        this.$refs.scrollBar.style.height = this.variableData[this.variableData.length - 1].bottom + this.unit
      }
    })
  },
  methods: {
    setStyle(item) {
      if (this.marginBottom === 0) {
        return { height: item.height + this.unit }
      } else {
        return { marginBottom: item.marginBottom + this.unit, height: item.height + this.unit }
      }
    },
    handleWaterfallData(data) {
      if (!data.length) return
      if (this.waterfallInfo.left.length) {
        this.waterfallInfo.left[this.waterfallInfo.left.length - 1].marginBottom = this.marginBottom
      }
      if (this.waterfallInfo.right.length) {
        this.waterfallInfo.right[this.waterfallInfo.right.length - 1].marginBottom = this.marginBottom
      }
      const { left: leftData, right: rightData } = this.waterfallGroup(data)
      const left = [...this.waterfallInfo.left, ...this.getWaterfallPosition(leftData, 'left')]
      const right = [...this.waterfallInfo.right, ...this.getWaterfallPosition(rightData, 'right')]
      left[left.length - 1].marginBottom = 0
      right[right.length - 1].marginBottom = 0
      this.waterfallInfo = { left, right }
      this.setWaterfallBarHeight()
    },
    // 分组
    waterfallGroup(data) {
      const left = []
      const right = []
      for (let i = 0, item; (item = data[i++]); ) {
        item.marginBottom = this.marginBottom
        const size = Number(item.height) + Number(item.marginBottom)
        if (this.leftHeight <= this.rightHieght) {
          this.leftHeight += size
          left.push(item)
        } else {
          right.push(item)
          this.rightHieght += size
        }
      }
      return { left, right }
    },
    setWaterfallBarHeight() {
      if (this.leftHeight >= this.rightHieght) {
        this.$refs.scrollBar.style.height = this.leftHeight - this.marginBottom + this.unit
      } else {
        this.$refs.scrollBar.style.height = this.rightHieght - this.marginBottom + this.unit
      }
    },
    getVisiblePosition(data) {
      if (!data.length) return []
      const prevLength = this.variableData.length
      let result = data.map((item, index) => ({
        index: prevLength + index,
        height: this.size,
        top: (prevLength + index) * this.size,
        bottom: (prevLength + index + 1) * this.size,
      }))
      return result
    },
    getWaterfallPosition(data, type) {
      if (!data.length) return []
      const prevData = this.waterfallInfo[type]
      for (let i = 0; i < data.length; i++) {
        data[i].index = prevData.length + i
        const size = Number(data[i].height) + Number(this.marginBottom)
        if (i == 0) {
          if (prevData.length) {
            data[i].top = prevData[prevData.length - 1].bottom
            data[i].bottom = prevData[prevData.length - 1].bottom + size
          } else {
            data[i].top = 0
            data[i].bottom = size
          }
        } else {
          data[i].top = data[i - 1].bottom
          data[i].bottom = data[i - 1].bottom + size
        }
      }
      return data
    },
    initVariablePosition() {
      this.variableData = this.data.map((item, index) => ({
        index,
        height: this.size,
        top: index * this.size,
        bottom: (index + 1) * this.size,
      }))
    },
    emitScrollEvent() {
      if (this.type === virtualType.WATERFALL) {
        this.$emit('scroll', {
          scrollTop: this.scrollTop,
          renderLeftScrollTop: this.scrollTop - this.leftOffset,
          renderRightScrollTop: this.scrollTop - this.rightOffset,
          renderLeftData: this.renderLeft,
          renderRightData: this.renderRight,
        })
      } else {
        this.$emit('scroll', {
          scrollTop: this.scrollTop,
          renderScrollTop: this.scrollTop - this.offset,
          renderData: this.renderData,
        })
      }
    },
    handleScroll() {
      // this.$parent.$emit.apply(this.$parent, ['abc', '触发'])
      const scrollTop = (this.scrollTop = this.$refs.virtualList.scrollTop)
      switch (this.type) {
        case virtualType.FIXED:
          this.start = Math.floor(scrollTop / this.size)
          this.end = this.start + this.remain
          this.offset = this.start * this.size - this.prevCount * this.size
          break
        case virtualType.VARIABLE:
          this.start = getCurrentIndex(scrollTop, this.variableData)
          this.end = this.start + this.remain
          this.offset = this.variableData[this.start - this.prevCount].top || 0
          break
        case virtualType.WATERFALL:
          this.leftStart = getCurrentIndex(scrollTop, this.waterfallInfo.left)
          this.rightStart = getCurrentIndex(scrollTop, this.waterfallInfo.right)
          // 渲染的屏幕数量
          this.leftEnd = this.leftStart + this.remain
          this.rightEnd = this.rightStart + this.remain
          this.leftOffset = this.waterfallInfo.left[this.leftStart - this.leftPrevCount].top || 0
          this.rightOffset = this.waterfallInfo.right[this.rightStart - this.rightPrevCount].top || 0
          break
      }
      this.$nextTick(() => {
        this.emitScrollEvent()
        if (scrollTop + this.$refs.virtualList.clientHeight >= this.$refs.virtualList.scrollHeight - this.distance) {
          this.$emit('loadMore')
        }
      })
    },
  },
}
</script>
<style>
.virtual-list {
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.virtual-list * {
  box-sizing: border-box;
}
.scroll-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.waterfall-list {
  display: flex;
  justify-content: space-between;
}
.left-wrap,
.right-wrap {
  width: 50%;
}
.left-item,
.right-item {
  overflow: hidden;
}
</style>