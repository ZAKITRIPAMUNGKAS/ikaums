import json
import sys
from playwright.sync_api import sync_playwright

ROUTES = [
    '/', '/tentang', '/syarat', '/privasi', '/peta', '/peluang', '/kegiatan',
    '/kepengurusan', '/cerita', '/gabung', '/masuk', '/direktori', '/app', '/admin',
]
ALL_VIEWPORTS = {
    'mobile': {'width': 390, 'height': 844},
    'desktop': {'width': 1440, 'height': 900},
}
BASE_URL = 'http://127.0.0.1:3002'

def inspect_page(page, route):
    try:
        response = page.goto(
            f'{BASE_URL}{route}', wait_until='domcontentloaded', timeout=1500
        )
        page.wait_for_timeout(100)
        return {
            'route': route,
            'status': response.status if response else None,
            'title': page.title(),
            'horizontalOverflow': page.evaluate('document.documentElement.scrollWidth > window.innerWidth'),
            'missingAltImages': page.locator('img:not([alt])').count(),
            'unlabeledButtons': page.locator('button').evaluate_all("""buttons => buttons.filter(
              button => !button.getAttribute('aria-label') && !button.textContent.trim()
            ).length"""),
        }
    except Exception as error:
        return {'route': route, 'error': str(error)}

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    report = {'viewports': {}, 'consoleErrors': [], 'pageErrors': [], 'mobileMenu': None}

    selected = sys.argv[1] if len(sys.argv) > 1 else None
    viewports = {selected: ALL_VIEWPORTS[selected]} if selected else ALL_VIEWPORTS
    for name, viewport in viewports.items():
        page = browser.new_page(viewport=viewport)
        page.set_default_navigation_timeout(1500)
        page.on('console', lambda message: report['consoleErrors'].append({
            'viewport': name, 'type': message.type, 'text': message.text
        }) if message.type == 'error' else None)
        page.on('pageerror', lambda error: report['pageErrors'].append({
            'viewport': name, 'text': str(error)
        }))
        report['viewports'][name] = [inspect_page(page, route) for route in ROUTES]

        page.close()

    browser.close()
    print(json.dumps(report, ensure_ascii=False, indent=2))
