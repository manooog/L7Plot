---
title: 图表 - Plot
order: 0
redirect_from:
  - /zh/docs/api
---

`Plot` 是所有图表的基类，定义了地图图表的通用属性和方法。

```js
constructor(container: string | HTMLDivElement, options: PlotOptions)
```

## 一、配置

### container

`string|HTMLDivElement` required

图表渲染的 DOM 容器。

### options

`PlotOptions` required

图表的所有配置项。

### `options.`width

`number` optional default: `null`

设置图表容器宽度。

### `options.`height

`number` optional default: `null`

设置图表容器高度。

`markdown:docs/common/attribute/map.zh.md`

### `options.`antialias

`boolean` optional default: `true`

是否开启抗锯齿。

### `options.`preserveDrawingBuffer

`boolean` optional default: `false`

是否保留缓冲区数据。

### `options.`logo

`bool` optional default: `true`

是否显示 logo。

### `options.`source

`ISource` required

数据配置，详见 [Source](/zh/docs/api/source)。

### `options.`autoFit

`bool` optional default: `false`

图层完成初始化之后，地图是否自动缩放到图层的数据边界范围，注意 <tag color="red" text="开启"></tag>后图表数据发生更新时，地图也会自动缩放到图层的数据边界范围。

### `options.`theme

`string|object` optional default: `'light'`

图表主题，详见 [Theme](/zh/docs/api/theme)。

`markdown:docs/common/attribute/components.zh.md`

## 二、属性

### DefaultOptions

`object` **static**

### container

`HTMLDivElement`

图表渲染的 DOM 容器。

### options

`PlotOptions`

图表的所有配置项。

### scene

`Scene`

图表的地图场景实例。

### type

`string`

图表所属类型。

### layerGroup

`LayerGroup`

图表的图层组。

### sceneLoaded

`boolean`

图表的地图场景是否加载完成。

### layersLoaded

`boolean`

图表的图层是否加载完成。

### zoomControl

`undefined｜Zoom`

放缩器控件实例。

### scaleControl

`undefined｜Scale`

比例尺控件实例。

### layerMenuControl

`undefined｜Layers`

图层列表控件实例。

### legendControl

`undefined｜Legend`

图例控件实例。

### tooltip

`undefined｜Tooltip`

悬浮提示组件实例。

## 三、方法

### update

更新配置且重新渲染。

```js
plot.update(options: Partial<PlotOptions>);
```

### changeData

更新数据源。

```js
plot.changeData(data: any, cfg?: SourceOptions);
```

### changeSize

修改容器大小。

```js
plot.changeSize(width: number, height: number);
```

### getScene

获取图表的地图 scene 实例。

```js
plot.getScene() : Scene;
```

### getMap

获取图表的 map 实例。

```js
plot.getMap() : MapboxInstance | AMapInstance;
```

### addLayer

添加图层。

```js
plot.addLayer(layer: PlotLayer);
```

### getLayers

获取所有图层。

```js
plot.getLayers(): PlotLayer[];
```

### getLayerByName

根据图层名称获取图层。

```js
plot.getLayerByName(name: string): PlotLayer | undefined;
```

### removeLayer

移除图层。

```js
plot.removeLayer(layer: PlotLayer);
```

### removeAllLayer

移除容器内所有的图层。

```js
plot.removeAllLayer();
```

### zoomIn

地图放大一级。

```js
plot.zoomIn();
```

### zoomOut

地图缩小一级。

```js
plot.zoomOut();
```

### setPitch

设置地图倾角。

```js
plot.setPitch(pitch: number);
```

### fitBounds

设置地图缩放范围。

```js
plot.fitBounds(bound: Bounds);
```

### setMapStatus

设置地图交互操作状态，可用来关闭地图的一些交互操作，缩放、平移、旋转等。

```js
plot.setMapStatus(status: MapStatusOptions);
```

### setBgColor

设置容器的背景色。

```js
plot.setBgColor(color: string);
```

### addZoomControl

添加地图缩放器控件。

```js
plot.addZoomControl(options: ZoomControlOptions);
```

### removeZoomControl

移除地图缩放器控件。

```js
plot.removeZoomControl();
```

### addScaleControl

添加地图比例尺控件。

```js
plot.addScaleControl(options: ScaleControlOptions);
```

### removeScaleControl

移除地图比例尺控件。

```js
plot.removeScaleControl();
```

### addLayerMenuControl

添加地图图层列表控件。

```js
plot.addLayerMenuControl(options: LayerMenuControlOptions);
```

### removeLayerMenuControl

移除地图图层列表控件。

```js
plot.removeLayerMenuControl();
```

### addLegendControl

添加图例控件。

```js
plot.addLegendControl(options: LegendOptions);
```

### removeLegendControl

移除图例控件。

```js
plot.removeLegendControl();
```

### exportPng

导出地图，目前仅支持导出可视化层，不支持底图导出。

```js
plot.exportPng(type?: 'png' | 'jpg'): string;
```

### addToScene

添加到容器，用于 L7 Scene 与图表混合使用场景。

```js
plot.addToScene(scene: Scene);
```

### removeFromScene

从容器上移除，用于 L7 Scene 与图表混合使用场景。

```js
plot.removeFromScene();
```

### on

绑定事件。

```js
plot.on(event: string, callback: (...args) => void);
```

### once

绑定一次事件。

```js
plot.once(event: string, callback: (...args) => void);
```

### off

解绑事件。

```js
plot.off(event: string, callback: (...args) => void);
```

### destroy

```js
plot.destroy();
```

## 四、事件

### 事件监听

#### 绑定事件

```js
plot.on(event: string, callback: (...args) => void);
```

#### 绑定一次事件

```js
plot.once(event: string, callback: (...args) => void);
```

#### 解绑事件

```js
plot.off(event: string, callback: (...args) => void);
```

### 事件类别

#### 地图事件

##### 生命周期事件

| 事件名       | 类型         | 描述               |
| ------------ | ------------ | ------------------ |
| loaded       | 生命周期事件 | 加载完成事件       |
| scene-loaded | 生命周期事件 | scene 加载完成事件 |
| destroy      | 生命周期事件 | 销毁事件           |

##### 地图容器事件

| 事件名     | 类型     | 描述                                                                                         |
| ---------- | -------- | -------------------------------------------------------------------------------------------- |
| resize     | 容器事件 | 地图容器大小改变事件                                                                         |
| mapmove    | 地图事件 | 地图平移时触发事件                                                                           |
| movestart  | 地图事件 | 地图平移开始时触发事件                                                                       |
| moveend    | 地图事件 | 地图移动结束后触发，包括平移，以及中心点变化的缩放。如地图有拖拽缓动效果，则在缓动结束后触发 |
| zoomchange | 地图事件 | 地图缩放级别更改后触发                                                                       |
| zoomstart  | 地图事件 | 缩放开始时触发                                                                               |
| zoomend    | 地图事件 | 缩放停止时触发                                                                               |

##### 点击事件

| 事件名      | 类型     | 描述         |
| ----------- | -------- | ------------ |
| click       | 左键事件 | 点击事件     |
| dblclick    | 双击事件 | 双击事件     |
| contextmenu | 右键事件 | 右键点击事件 |

##### 鼠标事件

| 事件名     | 类型     | 描述                                                                 |
| ---------- | -------- | -------------------------------------------------------------------- |
| mousemove  | 鼠标事件 | 鼠标在地图上移动时触发                                               |
| mousewheel | 鼠标事件 | 鼠标滚轮开始缩放地图时触发                                           |
| mouseover  | 鼠标事件 | 鼠标移入地图容器内时触发                                             |
| mouseout   | 鼠标事件 | 鼠标移出地图容器时触发                                               |
| mouseup    | 鼠标事件 | 鼠标在地图上单击抬起时触发                                           |
| mousedown  | 鼠标事件 | 鼠标在地图上单击按下时触发                                           |
| dragstart  | 滑动事件 | 开始拖拽地图时触发                                                   |
| dragging   | 滑动事件 | 拖拽地图过程中触发                                                   |
| dragend    | 滑动事件 | 停止拖拽地图时触发，如地图有拖拽缓动效果，则在拽停止，缓动开始前触发 |

#### 图层事件

详见[图层事件](/zh/docs/api/layers/plot-layer#四事件)，使用方式如下：

```js
plot.on('layerName:click', (...args) => void);
```

#### 组件事件

详见各组件事件，使用方式如下：

```js
plot.on('tooltip:change', (...args) => void);
```

## 五、资源注册

### 注册图片资源

#### registerImage(id: string, image: IImage)

注册单个图片。

params:

- id: `string`
- image: `HTMLImageElement|File|string`

```js
import { registerImage } from '@antv/l7plot';

registerImage('01', 'https://l7plot.antv.vision/xxx.svg');
```

#### registerImages(images)

注册多个图片。

params:

- images: `Array`
  - id: `string`
  - image: `HTMLImageElement|File|string`

```js
import { registerImages } from '@antv/l7plot';

const images = [{ id: '01', image: 'https://l7plot.antv.vision/xxx.svg' }];
registerImages(images);
```

### 注册字体资源

#### registerFontFace(fontFamily: string, fontPath: string)

注册字体。

params:

- fontFamily: `string`
- fontPath: `string`

```js
import { registerFontFace } from '@antv/l7plot';

registerFontFace('iconfont', 'https://l7plot.antv.vision/xxx.woff2');
```

### 注册 iconfont 映射

#### registerIconFont(name: string, fontUnicode: string)

注册单个 iconfont 映射。

params:

- name: `string`
- fontUnicode: `string`

```js
import { registerIconFont } from '@antv/l7plot';

registerIconFont('icon1', '&#xe64b;');
```

#### registerIconFonts(iconFonts)

注册多个 iconfont 映射。

params:

- iconFonts
  - name: `string`
  - fontUnicode: `string`

```js
import { registerIconFonts } from '@antv/l7plot';

const iconFonts = [{ name: 'icon1', fontUnicode: '&#xe64b;' }];
registerIconFonts(iconFonts);
```
