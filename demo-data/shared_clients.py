"""
Общая база клиентов для демо сверки.
Генерирует 1000 уникальных клиентов (700 B2C + 300 B2B).
Используется как основа для gen_billing.py, gen_crm.py, gen_portal.py.
"""

import os
import pickle
import random
from datetime import date, timedelta
from faker import Faker

fake = Faker('ru_RU')

REGIONS = {
    'Москва': '77',
    'Санкт-Петербург': '78',
    'Новосибирск': '54',
    'Екатеринбург': '66',
    'Казань': '16',
    'Нижний Новгород': '52',
    'Ростов-на-Дону': '61',
}

TARIFFS_B2B = ['Бизнес-100', 'Бизнес-500', 'Бизнес-1000', 'Корпоративный', 'Корпоративный+']
TARIFFS_B2C = ['Домашний-100', 'Домашний-300', 'Домашний-500', 'Игровой', 'Всё включено']

MANAGERS = [
    'Петров А.С.', 'Сидорова Е.В.', 'Козлов Д.И.', 'Михайлова О.Н.',
    'Волков К.А.', 'Новикова Т.М.', 'Морозов И.П.', 'Фёдорова Л.С.',
    'Алексеев В.Р.', 'Лебедева Н.Г.',
]

B2B_COMPANY_FORMS = ['ООО', 'ЗАО', 'АО', 'ПАО', 'ИП']
B2B_DOMAINS = ['tech', 'group', 'pro', 'corp', 'biz', 'company', 'solutions']
EMAIL_DOMAINS_B2C = ['mail.ru', 'yandex.ru', 'gmail.com', 'inbox.ru', 'bk.ru']


def _generate_inn(is_b2b: bool) -> str:
    length = 10 if is_b2b else 12
    first_digit = str(random.randint(1, 9))
    rest = ''.join([str(random.randint(0, 9)) for _ in range(length - 1)])
    return first_digit + rest


def _generate_phone() -> str:
    code = random.choice(['903', '905', '906', '909', '910', '915', '916', '917', '925', '926', '950', '951', '960', '961', '980', '981'])
    n1 = random.randint(100, 999)
    n2 = random.randint(10, 99)
    n3 = random.randint(10, 99)
    return f'+7({code}){n1}-{n2}-{n3}'


def _generate_account_number(region_code: str) -> str:
    digits = ''.join([str(random.randint(0, 9)) for _ in range(7)])
    return f'ЛС-{region_code}{digits}'


def _transliterate(text: str) -> str:
    mapping = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    result = ''
    for ch in text.lower():
        result += mapping.get(ch, ch)
    return result


def _make_email_b2c(last_name: str) -> str:
    domain = random.choice(EMAIL_DOMAINS_B2C)
    translit = _transliterate(last_name)
    suffix = random.randint(1, 999)
    return f'{translit}{suffix}@{domain}'


def _make_email_b2b(last_name: str, company_name: str) -> str:
    translit_name = _transliterate(last_name)
    # Извлечь "чистое" название компании
    clean = company_name
    for form in B2B_COMPANY_FORMS:
        clean = clean.replace(form, '').strip()
    clean = clean.strip(' "«»')
    translit_company = _transliterate(clean).replace(' ', '').replace('-', '')
    if not translit_company:
        translit_company = 'company'
    domain_suffix = random.choice(B2B_DOMAINS)
    return f'{translit_name}@{translit_company}.{domain_suffix}'


def generate_shared_clients(n_b2c=700, n_b2b=300, seed=42) -> list:
    """Генерирует базу клиентов. Seed для воспроизводимости."""
    random.seed(seed)
    Faker.seed(seed)

    clients = []
    client_counter = 0

    # --- B2B ---
    for _ in range(n_b2b):
        client_counter += 1
        region_name = random.choice(list(REGIONS.keys()))
        region_code = REGIONS[region_name]

        form = random.choice(B2B_COMPANY_FORMS)
        if form == 'ИП':
            raw_name = fake.last_name_male() + ' ' + fake.first_name_male()[0] + '.' + fake.middle_name_male()[0] + '.'
            company_name = f'ИП {raw_name}'
        else:
            company_word = fake.company().split(',')[0].split(' ')[-1]
            company_name = f'{form} "{company_word}"'

        contact_name = fake.last_name() + ' ' + fake.first_name() + ' ' + fake.middle_name()
        inn = _generate_inn(is_b2b=True)
        phone = _generate_phone()

        n_accounts = random.randint(1, 5)
        accounts = [_generate_account_number(region_code) for _ in range(n_accounts)]

        email = _make_email_b2b(contact_name.split()[0], company_name)
        manager = random.choice(MANAGERS)
        tariff = random.choice(TARIFFS_B2B)

        start_date = date(2018, 1, 1)
        end_date = date(2024, 12, 31)
        contract_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

        clients.append({
            'client_id': f'CLT-{client_counter:06d}',
            'segment': 'B2B',
            'company_name': company_name,
            'contact_name': contact_name,
            'inn': inn,
            'phone': phone,
            'email': email,
            'region': region_name,
            'manager': manager,
            'contract_date': contract_date.isoformat(),
            'accounts': accounts,
            'tariff': tariff,
        })

    # --- B2C ---
    for _ in range(n_b2c):
        client_counter += 1
        region_name = random.choice(list(REGIONS.keys()))
        region_code = REGIONS[region_name]

        last_name = fake.last_name()
        first_name = fake.first_name()
        middle_name = fake.middle_name()
        contact_name = f'{last_name} {first_name} {middle_name}'

        inn = _generate_inn(is_b2b=False)
        phone = _generate_phone()
        email = _make_email_b2c(last_name)
        tariff = random.choice(TARIFFS_B2C)

        account = _generate_account_number(region_code)

        start_date = date(2019, 1, 1)
        end_date = date(2025, 6, 30)
        contract_date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

        clients.append({
            'client_id': f'CLT-{client_counter:06d}',
            'segment': 'B2C',
            'company_name': None,
            'contact_name': contact_name,
            'inn': inn,
            'phone': phone,
            'email': email,
            'region': region_name,
            'manager': None,
            'contract_date': contract_date.isoformat(),
            'accounts': [account],
            'tariff': tariff,
        })

    random.shuffle(clients)
    return clients


def get_or_create_clients(cache_dir=None) -> list:
    """Загружает из кэша или генерирует заново."""
    if cache_dir is None:
        cache_dir = os.path.dirname(os.path.abspath(__file__))
    cache_path = os.path.join(cache_dir, 'shared_clients.pkl')

    if os.path.exists(cache_path):
        with open(cache_path, 'rb') as f:
            return pickle.load(f)

    clients = generate_shared_clients()
    with open(cache_path, 'wb') as f:
        pickle.dump(clients, f)
    return clients


if __name__ == '__main__':
    clients = generate_shared_clients()
    cache_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shared_clients.pkl')
    with open(cache_path, 'wb') as f:
        pickle.dump(clients, f)

    b2b = [c for c in clients if c['segment'] == 'B2B']
    b2c = [c for c in clients if c['segment'] == 'B2C']
    total_accounts = sum(len(c['accounts']) for c in clients)

    print('=== Общая база клиентов ===')
    print(f'Всего клиентов: {len(clients)}')
    print(f'  B2B: {len(b2b)}')
    print(f'  B2C: {len(b2c)}')
    print(f'Всего лицевых счетов: {total_accounts}')
    print(f'Кэш сохранён: {cache_path}')
