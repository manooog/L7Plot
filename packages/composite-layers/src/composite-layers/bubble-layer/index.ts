import { clone, isEqual, isUndefined, omit } from '@antv/util';
import { CompositeLayer } from '../../core/composite-layer';
import { PointLayer } from '../../core-layers/point-layer';
import { TextLayer } from '../../core-layers/text-layer';
import { ICoreLayer, ISource, SourceOptions, MouseEvent } from '../../types';
import { getDefaultState } from './adaptor';
import { EMPTY_JSON_SOURCE } from '../common/constants';
import { DEFAULT_OPTIONS, DEFAULT_STATE } from './constants';
import { BubbleLayerOptions } from './types';
import { getLabelLayerOptions } from '../common/label-layer';

export class BubbleLayer extends CompositeLayer<BubbleLayerOptions> {
  /**
   * 默认配置项
   */
  static DefaultOptions = DEFAULT_OPTIONS;
  /**
   * 复合图层类型
   */
  public type = CompositeLayer.LayerType.BubbleLayer;
  /**
   * 主图层
   */
  protected get layer() {
    return this.fillLayer;
  }
  /**
   * 填充图层
   */
  public get fillLayer() {
    return this.subLayers.getLayer('fillLayer') as ICoreLayer;
  }
  /**
   * 高亮描边图层
   */
  public get highlightStrokeLayer() {
    return this.subLayers.getLayer('highlightStrokeLayer') as ICoreLayer;
  }
  /**
   * 高亮数据
   */
  private highlightData: any;
  /**
   * 选中填充面图层
   */
  public get selectFillLayer() {
    return this.subLayers.getLayer('selectFillLayer') as ICoreLayer;
  }
  /**
   * 选中描边图层
   */
  public get selectStrokeLayer() {
    return this.subLayers.getLayer('selectStrokeLayer') as ICoreLayer;
  }
  /**
   * 选中数据
   */
  private selectData: { feature: any; featureId: number }[] = [];
  /**
   * 标注文本图层
   */
  public get labelLayer() {
    return this.subLayers.getLayer('labelLayer') as TextLayer;
  }
  /**
   * 图层交互状态配置
   */
  private layerState = DEFAULT_STATE;
  /**
   * 图层是否具有交互属性
   */
  public interaction = true;

  constructor(options: BubbleLayerOptions) {
    super(options);
    this.initSubLayersEvent();
  }

  /**
   * 获取默认配置
   */
  public getDefaultOptions(): Partial<BubbleLayerOptions> {
    return BubbleLayer.DefaultOptions;
  }

  /**
   * 创建子图层
   */
  protected createSubLayers() {
    const source = this.source;
    this.layerState = getDefaultState(this.options.state);

    // 映射填充图层
    const fillLayer = new PointLayer({
      ...this.getFillLayerOptions(),
      id: 'fillLayer',
      shape: 'circle',
      source,
    });

    // 高亮描边图层
    const highlightStrokeLayer = new PointLayer({
      ...this.getHighlightStrokeLayerOptions(),
      id: 'highlightStrokeLayer',
      shape: 'circle',
    });

    // 选中填充图层
    const selectFillLayer = new PointLayer({
      ...this.getSelectFillLayerOptions(),
      id: 'selectFillLayer',
      shape: 'circle',
    });

    // 选中描边图层
    const selectStrokeLayer = new PointLayer({
      ...this.getSelectStrokeLayerOptions(),
      id: 'selectStrokeLayer',
      shape: 'circle',
    });

    // 标注图层
    const labelLayer = new TextLayer({
      ...getLabelLayerOptions<BubbleLayerOptions>(this.options),
      id: 'labelLayer',
      source,
    });

    const subLayers = [fillLayer, highlightStrokeLayer, selectFillLayer, selectStrokeLayer, labelLayer];

    return subLayers;
  }

  /**
   * 获取填充图层配置项
   */
  private getFillLayerOptions() {
    const {
      visible,
      minZoom,
      maxZoom,
      zIndex = 0,
      fillColor,
      radius,
      opacity,
      strokeColor,
      lineOpacity,
      lineWidth,
      ...baseConfig
    } = omit<any>(this.options, ['source']) as Omit<BubbleLayerOptions, 'source'>;
    // omit source 目前是图层共享 source，避免更新时透传 source 数据
    const defaultState = this.layerState;

    const fillState = {
      active: defaultState.active.fillColor === false ? false : { color: defaultState.active.fillColor },
      select: false,
    };
    const fillStyle = {
      opacity: opacity,
      stroke: strokeColor,
      strokeOpacity: isUndefined(lineOpacity) ? opacity : lineOpacity,
      strokeWidth: lineWidth,
    };

    const options = {
      ...baseConfig,
      visible,
      minZoom,
      maxZoom,
      zIndex,
      color: fillColor,
      size: radius,
      state: fillState,
      style: fillStyle,
    };

    return options;
  }

  private getHighlightStrokeLayerOptions() {
    const { visible, minZoom, maxZoom, zIndex = 0, radius } = this.options;
    const defaultState = this.layerState;
    const strokeStyle = {
      opacity: 0,
      stroke: defaultState.active.strokeColor || undefined,
      strokeOpacity: defaultState.active.lineOpacity,
      strokeWidth: defaultState.active?.lineWidth,
    };

    const options = {
      visible: visible && Boolean(defaultState.active.strokeColor),
      zIndex: zIndex + 0.1,
      minZoom,
      maxZoom,
      source: EMPTY_JSON_SOURCE,
      size: radius,
      style: strokeStyle,
    };

    return options;
  }

  private getSelectFillLayerOptions() {
    const { visible, minZoom, maxZoom, zIndex = 0, radius, opacity } = this.options;
    const defaultState = this.layerState;
    const color = defaultState.select.fillColor || undefined;
    const fillStyle = { opacity: opacity };

    const option = {
      visible: visible && Boolean(color),
      zIndex: zIndex + 0.1,
      minZoom,
      maxZoom,
      source: EMPTY_JSON_SOURCE,
      color,
      size: radius,
      style: fillStyle,
      state: { select: false, active: false },
    };

    return option;
  }

  private getSelectStrokeLayerOptions() {
    const { visible, minZoom, maxZoom, zIndex = 0, radius } = this.options;
    const defaultState = this.layerState;
    const strokeStyle = {
      opacity: 0,
      stroke: defaultState.select.strokeColor || undefined,
      strokeOpacity: defaultState.select.lineOpacity,
      strokeWidth: defaultState.select.lineWidth,
    };

    const option = {
      visible: visible && Boolean(strokeStyle.stroke),
      zIndex: zIndex + 0.1,
      minZoom,
      maxZoom,
      source: EMPTY_JSON_SOURCE,
      size: radius,
      style: strokeStyle,
    };

    return option;
  }

  /**
   * 设置子图层数据
   */
  protected setSubLayersSource(source: SourceOptions | ISource) {
    if (this.isSourceInstance(source)) {
      this.source = source;
      this.fillLayer.setSource(source);
      this.labelLayer.setSource(source);
    } else {
      const { data, ...option } = source;
      this.source.setData(data, option);
    }

    this.highlightStrokeLayer.changeData(EMPTY_JSON_SOURCE);
    this.selectFillLayer.changeData(EMPTY_JSON_SOURCE);
    this.selectStrokeLayer.changeData(EMPTY_JSON_SOURCE);
  }

  /**
   * 设置高亮描边子图层数据
   */
  protected setHighlightLayerSource(feature?: any, featureId = -999) {
    if (this.highlightData === featureId) {
      return;
    }
    const features = feature ? [feature] : [];
    const parser = this.source.parser;
    const data = parser.type === 'geojson' ? { type: 'FeatureCollection', features } : features;

    // if (!Array.isArray(this.options.radius) && typeof this.options.radius === 'object' && this.options.radius.field) {
    //   const scale = this.fillLayer.layer.getScale(this.options.radius.field);
    //   console.log('this.options.radius.field): ', this.options.radius.field);
    //   console.log('scale: ', scale);
    // }

    this.highlightStrokeLayer.changeData({ data, parser });
    this.highlightData = featureId;
  }

  /**
   * 设置选中描边与填充子图层数据
   */
  protected setSelectLayerSource(selectData: any[] = []) {
    if (
      this.selectData.length === selectData.length &&
      isEqual(
        this.selectData.map(({ featureId }) => featureId),
        selectData.map(({ featureId }) => featureId)
      )
    ) {
      return;
    }
    const features = selectData.map(({ feature }) => feature);
    const parser = this.source.parser;
    const data = parser.type === 'geojson' ? { type: 'FeatureCollection', features } : features;
    this.selectFillLayer.changeData({ data, parser });
    this.selectStrokeLayer.changeData({ data, parser });
    this.selectData = selectData;
  }

  /**
   * 初始化子图层事件
   */
  protected initSubLayersEvent() {
    // 初始化主图层交互事件
    this.fillLayer.off('mousemove', this.onHighlighHandle);
    this.fillLayer.off('mouseout', this.onHighlighHandle);
    this.fillLayer.off('click', this.onSelectHandle);
    this.selectData = [];
    this.highlightData = null;
    if (!this.options.state) return;
    // active
    if (this.options.state.active) {
      this.fillLayer.on('mousemove', this.onHighlighHandle);
      this.fillLayer.on('mouseout', this.onUnhighlighHandle);
    }
    // select
    if (this.options.state.select) {
      this.fillLayer.on('click', this.onSelectHandle);
    }
  }

  /**
   * 图层高亮回调
   */
  private onHighlighHandle = (event: MouseEvent) => {
    const { feature, featureId } = event;
    this.setHighlightLayerSource(feature, featureId);
  };

  /**
   * 图层取消高亮回调
   */
  private onUnhighlighHandle = () => {
    this.setHighlightLayerSource();
  };

  /**
   * 图层选中回调
   */
  private onSelectHandle = (event: MouseEvent) => {
    const { feature, featureId } = event;
    this.handleSelectData(featureId, feature);
  };

  private handleSelectData(featureId: number, feature: any) {
    const enabledMultiSelect = this.options.enabledMultiSelect;
    let selectData = clone(this.selectData);
    const index = selectData.findIndex((item) => item.featureId === featureId);

    if (index === -1) {
      if (enabledMultiSelect) {
        selectData.push({ feature, featureId });
      } else {
        selectData = [{ feature, featureId }];
      }
      this.emit('select', feature, clone(selectData));
    } else {
      const unselectFeature = selectData[index];
      if (enabledMultiSelect) {
        selectData.splice(index, 1);
      } else {
        selectData = [];
      }
      this.emit('unselect', unselectFeature, clone(selectData));
    }

    this.setSelectLayerSource(selectData);
  }

  /**
   * 更新
   */
  public update(options: Partial<BubbleLayerOptions>) {
    super.update(options);

    this.initSubLayersEvent();
  }

  /**
   * 更新: 更新配置
   */
  public updateOption(options: Partial<BubbleLayerOptions>) {
    super.updateOption(options);
    this.layerState = getDefaultState(this.options.state);
  }

  /**
   * 更新子图层
   */
  protected updateSubLayers(options: Partial<BubbleLayerOptions>) {
    // 映射填充面图层
    this.fillLayer.update(this.getFillLayerOptions());

    // 高亮图层
    this.highlightStrokeLayer.update(this.getHighlightStrokeLayerOptions());

    // 选中填充图层
    this.selectFillLayer.update(this.getSelectFillLayerOptions());

    // 选中描边图层
    this.selectStrokeLayer.update(this.getSelectStrokeLayerOptions());

    // 标注图层
    this.labelLayer.update(getLabelLayerOptions<BubbleLayerOptions>(this.options));

    // 重置高亮/选中状态
    if (this.options.visible) {
      if (!isUndefined(options.state) && !isEqual(this.lastOptions.state, this.options.state)) {
        this.updateHighlightSubLayers();
      }

      if (this.layerState.active.strokeColor) {
        this.setHighlightLayerSource();
      }
      if (this.layerState.select.fillColor || this.layerState.select.strokeColor) {
        this.setSelectLayerSource();
      }
    }
  }

  /**
   * 更新高亮及选中子图层
   */
  private updateHighlightSubLayers() {
    const defaultState = this.layerState;
    const lasetDefaultState = getDefaultState(this.lastOptions.state);

    if (lasetDefaultState.active.strokeColor !== defaultState.active.strokeColor) {
      defaultState.active.strokeColor ? this.highlightStrokeLayer.show() : this.highlightStrokeLayer.hide();
    }

    if (lasetDefaultState.select.fillColor !== defaultState.select.fillColor) {
      defaultState.select.fillColor ? this.selectFillLayer.show() : this.selectFillLayer.hide();
    }

    if (lasetDefaultState.select.strokeColor !== defaultState.select.strokeColor) {
      defaultState.select.strokeColor ? this.selectStrokeLayer.show() : this.selectStrokeLayer.hide();
    }
  }

  /**
   * 设置图层 zIndex
   */
  public setIndex(zIndex: number) {
    this.fillLayer.setIndex(zIndex);
    this.highlightStrokeLayer.setIndex(zIndex + 0.1);
    this.selectFillLayer.setIndex(zIndex + 0.1);
    this.selectStrokeLayer.setIndex(zIndex + 0.1);
    this.labelLayer.setIndex(zIndex + 0.1);
  }

  /**
   * 设置图层高亮状态
   */
  public setActive(field: string, value: number | string) {
    const source = this.fillLayer.source;
    const featureId = source.getFeatureId(field, value);
    if (isUndefined(featureId)) {
      throw new Error('Feature non-existent' + field + value);
    }

    if (this.layerState.active.fillColor) {
      this.fillLayer.layer.setActive(featureId);
    }

    if (this.layerState.active.strokeColor) {
      const feature = source.getFeatureById(featureId);
      this.setHighlightLayerSource(feature, featureId);
    }
  }

  /**
   * 设置图层选中状态
   */
  public setSelect(field: string, value: number | string) {
    const source = this.fillLayer.source;
    const featureId = source.getFeatureId(field, value);
    if (isUndefined(featureId)) {
      throw new Error('Feature non-existent' + field + value);
    }

    if (this.layerState.select.strokeColor === false || this.layerState.select.fillColor === false) {
      return;
    }

    const feature = source.getFeatureById(featureId);
    this.handleSelectData(featureId, feature);
  }

  /**
   * 图层框选数据
   */
  public boxSelect(bounds: [number, number, number, number], callback: (...args: any[]) => void) {
    this.fillLayer.boxSelect(bounds, callback);
  }
}
