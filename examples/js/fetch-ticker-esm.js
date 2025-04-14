// 使用ES模块语法
import ccxt from '../../js/ccxt.js';

(async function () {
    // 实例化交易所
    const exchange = new ccxt.binance();

    try {
        // 获取BTC/USDT的行情数据
        const symbol = 'BTC/USDT';
        console.log('正在获取', symbol, '的行情数据...');
        const ticker = await exchange.fetchTicker(symbol);
        
        // 输出格式化的结果
        console.log('交易对:', symbol);
        console.log('最新价格:', ticker.last);
        console.log('24小时变化比例:', ticker.percentage, '%');
        console.log('24小时最高价:', ticker.high);
        console.log('24小时最低价:', ticker.low);
        console.log('24小时成交量:', ticker.volume);
        console.log('时间戳:', new Date(ticker.timestamp).toISOString());
    } catch (e) {
        console.log(e.constructor.name, e.message);
    }
})();
