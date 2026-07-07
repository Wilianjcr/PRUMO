const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.toString()));
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
        document.getElementById('input-login-nome').value = 'wilianadm';
        // find the button that calls realizarLogin()
        const btns = Array.from(document.querySelectorAll('button'));
        const loginBtn = btns.find(b => b.getAttribute('onclick') === 'realizarLogin()');
        if (loginBtn) loginBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if we reached the menu
    const isMenu = await page.evaluate(() => {
        const menu = document.getElementById('view-menu');
        return menu && !menu.classList.contains('view-hidden');
    });
    
    if (!isMenu) errors.push('Failed to reach view-menu after login');
    
    // Now get all views and navigate
    const views = await page.evaluate(() => {
        const viewLabels = window.VIEW_LABELS || {
            'view-atividades':'Atividades','view-productivity':'Boletim','view-planejamento':'Planejamento',
            'view-os':'Nova O.S','view-requisicao':'Pedidos','view-op':'Ordem de Prod.',
            'view-percentage':'Tolerância','view-divisao-quebra':'Div. / Quebra','view-manut-adm':'Manutenção',
            'view-cronograma':'Cronograma','view-almox':'Almoxarifado'
        };
        return Object.keys(viewLabels);
    });
    
    for (const v of views) {
        await page.evaluate((viewId) => {
            if (typeof window.navigate === 'function') {
                window.navigate(viewId, '📦 Armazém');
            }
        }, v);
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('Errors found:', errors);
    await browser.close();
})();
