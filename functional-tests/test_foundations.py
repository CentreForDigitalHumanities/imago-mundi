def test_finding_imago_mundi_frontend(browser, base_address):
    browser.get(base_address)
    assert 'finding imago mundi' in browser.title


def test_finding_imago_mundi_admin(browser, admin_address):
    browser.get(admin_address)
    assert 'Django' in browser.title


def test_finding_imago_mundi_api(browser, api_address):
    browser.get(api_address)
    assert 'Api Root' in browser.title


def test_finding_imago_mundi_api_auth(browser, api_auth_address):
    browser.get(api_auth_address + 'login/')
    assert 'Django REST framework' in browser.title
