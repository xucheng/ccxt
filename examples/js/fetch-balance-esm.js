// 使用ES模块语法
import ccxt from '../../js/ccxt.js';

(async function () {
    // 实例化交易所
    const exchange = new ccxt.binance({
        'apiKey': 'YOUR_API_KEY',
        'secret': 'YOUR_SECRET',
    });

    try {
        // 获取余额
        const balance = await exchange.fetchBalance();
        console.log(balance);
    } catch (e) {
        console.log(e.constructor.name, e.message);
    }
})();
