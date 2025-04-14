// 使用ES模块语法
import ccxt from '../../js/ccxt.js';

(async function main() {
    try {
        // 连接到okx交易所
        const exchange = new ccxt.okx();
        
        // 获取BTC/USDT的K线数据
        console.log('获取BTC/USDT的K线数据...');
        const symbol = 'BTC/USDT';
        const timeframe = '15m';  // 15分钟K线
        const ohlcv = await exchange.fetchOHLCV(symbol, timeframe);
        
        // 提取收盘价
        const closingPrices = ohlcv.map(candle => candle[4]);  // [timestamp, open, high, low, close, volume]
        const lastPrice = closingPrices[closingPrices.length - 1];
        
        // 输出简单的字符图形
        console.log('\n当前BTC价格: $' + lastPrice);
        console.log('\n最近15个周期的价格走势:');
        
        // 简单的ASCII图表
        const height = 10;
        let min = Math.min(...closingPrices.slice(-15));
        let max = Math.max(...closingPrices.slice(-15));
        let range = max - min;
        let ratio = height / range;
        
        // 创建简易图表
        for (let i = height - 1; i >= 0; i--) {
            let line = '';
            let price = max - (i / ratio);
            if (i === 0) {
                line += price.toFixed(0) + ' ';
            } else if (i === height - 1) {
                line += price.toFixed(0) + ' ';
            } else {
                line += '    ';
            }
            
            for (let j = closingPrices.length - 15; j < closingPrices.length; j++) {
                let current = closingPrices[j];
                if (current >= price && current < price + range / height) {
                    line += '*';
                } else {
                    line += ' ';
                }
            }
            console.log(line);
        }
        
        console.log('\n----------------------------------------');
        console.log('时间范围: ' + new Date(ohlcv[0][0]).toLocaleString() + ' 到 ' + 
                    new Date(ohlcv[ohlcv.length - 1][0]).toLocaleString());
    } catch (e) {
        console.error('错误:', e.message);
    }
})();
