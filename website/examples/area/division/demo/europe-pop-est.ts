import { Area } from '@antv/l7plot';

fetch('https://gw.alipayobjects.com/os/antfincdn/EIXm%24lEPD%24/europe.geo.json')
  .then((response) => response.json())
  .then((data) => {
    new Area('container', {
      map: {
        type: 'amap',
        style: 'blank',
        center: [120.19382669582967, 30.258134],
        zoom: 3,
        pitch: 0,
      },
      source: {
        data: data,
        parser: {
          type: 'geojson',
        },
      },
      autoFit: true,
      color: {
        field: 'pop_est',
        value: ['rgb(239,243,255)', 'rgb(189,215,231)', 'rgb(107,174,214)', 'rgb(49,130,189)', 'rgb(8,81,156)'],
        scale: { type: 'quantile' },
      },
      style: {
        opacity: 1,
        stroke: 'rgb(93,112,146)',
        lineWidth: 0.6,
        lineOpacity: 1,
      },
      state: {
        active: true,
      },
      label: {
        visible: true,
        field: 'name',
        style: {
          fill: '#000',
          opacity: 0.8,
          fontSize: 10,
          stroke: '#fff',
          strokeWidth: 1.5,
          textAllowOverlap: false,
          padding: [5, 5],
        },
      },
      tooltip: {
        items: ['name', 'name_zh', 'pop_est'],
      },
      zoom: {
        position: 'bottomright',
      },
      legend: {
        position: 'bottomleft',
      },
    });
  });
