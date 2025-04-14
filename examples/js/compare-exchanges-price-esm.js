// 使用ES模块语法比较多个交易所的价格
import ccxt from '../../js/ccxt.js';

(async function () {
    // 要比较的交易所列表
    const exchangeIds = ['binance', 'okx', 'bybit', 'coinbase', 'kraken'];
    // 要查询的交易对
    const symbol = 'BTC/USDT';
    
    console.log(`比较不同交易所的 ${symbol} 价格:`);
    console.log('--------------------------------------');
    
    // 为每个交易所创建一个实例
    const exchanges = exchangeIds.map(id => new ccxt[id]());
    
    try {
        // 并行获取所有交易所的价格
        const results = await Promise.all(exchanges.map(async (exchange) => {
            try {
                // 有些交易所可能不支持这个交易对
                if (!exchange.has.fetchTicker) {
                    return { 
                        exchange: exchange.id, 
                        error: '不支持 fetchTicker 方法' 
                    };
                }
                
                // 确保市场已加载
                await exchange.loadMarkets();
                
                // 确认交易对是否可用
                if (!exchange.markets[symbol]) {
                    return { 
                        exchange: exchange.id, 
                        error: `不支持交易对 ${symbol}` 
                    };
                }
                
                // 获取行情
                const ticker = await exchange.fetchTicker(symbol);
                return {
                    exchange: exchange.id,
                    price: ticker.last,
                    bid: ticker.bid,
                    ask: ticker.ask,
                    spread: ticker.ask - ticker.bid,
                    spreadPercentage: ((ticker.ask - ticker.bid) / ticker.bid) * 100,
                    timestamp: new Date(ticker.timestamp).toISOString()
                };
            } catch (e) {
                return { 
                    exchange: exchange.id, 
                    error: e.message 
                };
            }
        }));
        
        // 显示结果
        results.forEach(result => {
            if (result.error) {
                console.log(`${result.exchange.padEnd(10)}: 错误 - ${result.error}`);
            } else {
                console.log(`${result.exchange.padEnd(10)}: ${result.price} USD (买入: ${result.bid}, 卖出: ${result.ask}, 价差: ${result.spreadPercentage.toFixed(4)}%)`);
            }
        });
        
        // 找出最高和最低价格
        const validResults = results.filter(r => !r.error);
        if (validResults.length > 0) {
            const highest = validResults.reduce((max, r) => r.price > max.price ? r : max, validResults[0]);
            const lowest = validResults.reduce((min, r) => r.price < min.price ? r : min, validResults[0]);
            
            console.log('--------------------------------------');
            console.log(`最高价: ${highest.exchange} (${highest.price} USD)`);
            console.log(`最低价: ${lowest.exchange} (${lowest.price} USD)`);
            console.log(`价格差异: ${(highest.price - lowest.price)} USD (${((highest.price - lowest.price) / lowest.price * 100).toFixed(4)}%)`);
        }
    } catch (e) {
        console.error('发生错误:', e.message);
    }
})();
