import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { priceData } from './priceData';
import { volumeData } from './volumeData';
import { useContext } from 'react';
import { DataContext } from '../../context/DataProvider';

const Graph = ({ pair }) => {
	const chartContainerRef = useRef<any>();
	const chart = useRef<any>();
	const resizeObserver = useRef<any>();

	const { pairData } = useContext(DataContext);

	const [_candleSeries, setCandleSeries] = React.useState<any>();

	if (chart.current) {
		_candleSeries.setData(pairData[pair?.id] ?? []);
	}
	useEffect(() => {
		chart.current = createChart(chartContainerRef.current, {
			width: chartContainerRef.current.clientWidth,
			height: 500, //"300px", //chartContainerRef.current.clientHeight,
			layout: {
				backgroundColor: '#161616',
				textColor: 'rgba(255, 255, 255, 0.9)',
			},
			grid: {
				vertLines: {
					color: '#334158',
				},
				horzLines: {
					color: '#334158',
				},
			},
			crosshair: {
				mode: CrosshairMode.Normal,
			},
			// priceScale: {
			// 	borderColor: '#485c7b',
			// },
			timeScale: {
				borderColor: '#485c7b',
			},
		});

		const candleSeries = chart.current.addCandlestickSeries({
			upColor: '#4bffb5',
			downColor: '#ff4976',
			borderDownColor: '#ff4976',
			borderUpColor: '#4bffb5',
			wickDownColor: '#838ca1',
			wickUpColor: '#838ca1',
		});
		setCandleSeries(candleSeries);

		candleSeries.setData(pairData[pair?.id] ?? []);

		// const areaSeries = chart.current.addAreaSeries({
		//   topColor: 'rgba(38,198,218, 0.56)',
		//   bottomColor: 'rgba(38,198,218, 0.04)',
		//   lineColor: 'rgba(38,198,218, 1)',
		//   lineWidth: 2
		// });

		// areaSeries.setData(areaData);

		const volumeSeries = chart.current.addHistogramSeries({
			color: '#182233',
			lineWidth: 2,
			priceFormat: {
				type: 'volume',
			},
			overlay: true,
			scaleMargins: {
				top: 0.8,
				bottom: 0,
			},
		});

		volumeSeries.setData(volumeData);
	}, []);

	// Resize chart on container resizes.
	useEffect(() => {
		resizeObserver.current = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			chart.current.applyOptions({ width, height });
			setTimeout(() => {
				chart.current.timeScale().fitContent();
			}, 0);
		});

		resizeObserver.current.observe(chartContainerRef.current);

		return () => resizeObserver.current.disconnect();
	}, []);

	return (
		<div className="App">
			<div
				ref={chartContainerRef}
				className="chart-container"
				style={{ height: '100%' }}
			/>
		</div>
	);
};

export default Graph;
