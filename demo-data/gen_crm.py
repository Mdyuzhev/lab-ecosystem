"""
Генератор выгрузки CRM клиентов.
Создаёт crm_clients.csv с ~920-950 записями.
"""

import os
import random
from datetime import date, timedelta

import pandas as pd
from faker import Faker
from shared_clients import get_or_create_clients

random.seed(42)
Faker.seed(42)
fake = Faker('ru_RU')

B2B_COMPANY_FORMS = ['ООО', 'ЗАО', 'АО', 'ПАО', 'ИП']
EMAIL_DOMAINS_B2C = ['mail.ru', 'yandex.ru', 'gmail.com', 'inbox.ru', 'bk.ru', 'rambler.ru']


def _alt_company_name(name: str) -> str:
    """Возвращает название компании в другом формате."""
    fmt = random.choice(['no_quotes', 'reversed'])
    if fmt == 'no_quotes':
        return name.replace('"', '').replace('«', '').replace('»', '')
    else:
        # "ООО \"Ромашка\"" -> "Ромашка, ООО"
        for form in B2B_COMPANY_FORMS:
            if name.startswith(form):
                clean = name.replace(form, '').strip().strip(' "«»')
                return f'{clean}, {form}'
        return name


def _alt_contact_name(name: str) -> str:
    """ФИО в другом порядке или сокращённое."""
    parts = name.split()
    if len(parts) < 3:
        return name
    fmt = random.choice(['first_last', 'initials'])
    if fmt == 'first_last':
        return f'{parts[1]} {parts[2]} {parts[0]}'
    else:
        return f'{parts[0]} {parts[1][0]}.{parts[2][0]}.'


def _generate_prospects(n=35) -> list:
    """Генерирует prospect-клиентов (нет в биллинге)."""
    prospects = []
    for i in range(n):
        segment = random.choice(['B2B', 'B2C'])
        region = random.choice(['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'])
        last_name = fake.last_name()
        first_name = fake.first_name()
        middle_name = fake.middle_name()

        prospects.append({
            'client_id': f'CLT-{9000 + i:06d}',
            'segment': segment,
            'company_name': f'ООО "{fake.company().split(",")[0].split(" ")[-1]}"' if segment == 'B2B' else None,
            'contact_name': f'{last_name} {first_name} {middle_name}',
            'inn': ''.join([str(random.randint(0, 9)) for _ in range(10 if segment == 'B2B' else 12)]),
            'phone': f'+7({random.randint(900,999)}){random.randint(100,999)}-{random.randint(10,99)}-{random.randint(10,99)}',
            'email': f'{last_name.lower()}{random.randint(1,999)}@{random.choice(EMAIL_DOMAINS_B2C)}',
            'region': region,
            'manager': fake.last_name() + ' ' + fake.first_name()[0] + '.' + fake.middle_name()[0] + '.' if segment == 'B2B' else None,
            'contract_date': None,
            'account_numbers': '',
            'status': 'prospect',
            'last_activity_date': date(2025, random.randint(10, 12), random.randint(1, 28)).isoformat(),
        })
    return prospects


def generate_crm():
    clients = get_or_create_clients()

    rows = []
    stats = {
        'total_from_shared': 0,
        'excluded_b2c': 0,
        'alt_company': 0,
        'alt_name': 0,
        'duplicates': 0,
        'wrong_segment': 0,
        'stale_email': 0,
        'empty_accounts': 0,
        'prospects': 0,
    }

    b2b_clients = [c for c in clients if c['segment'] == 'B2B']
    b2c_clients = [c for c in clients if c['segment'] == 'B2C']

    # 10% B2C не попадают в CRM
    excluded_count = int(len(b2c_clients) * 0.10)
    excluded_indices = set(random.sample(range(len(b2c_clients)), excluded_count))
    stats['excluded_b2c'] = excluded_count

    included_clients = list(b2b_clients)
    for i, c in enumerate(b2c_clients):
        if i not in excluded_indices:
            included_clients.append(c)

    stats['total_from_shared'] = len(included_clients)

    # Определить аномалии
    alt_company_indices = set(random.sample(
        [i for i, c in enumerate(included_clients) if c['segment'] == 'B2B'],
        min(int(len(b2b_clients) * 0.25), len(b2b_clients))
    ))
    alt_name_indices = set(random.sample(range(len(included_clients)), int(len(included_clients) * 0.12)))
    stale_email_indices = set(random.sample(range(len(included_clients)), 50))
    empty_acc_indices = set(random.sample(range(len(included_clients)), 20))
    wrong_segment_indices = set(random.sample(range(len(included_clients)), 10))

    # Дубли
    dup_indices = random.sample(range(len(included_clients)), 18)

    for idx, client in enumerate(included_clients):
        company_name = client['company_name']
        contact_name = client['contact_name']
        inn = client['inn']
        phone = client['phone']
        email = client['email']
        segment = client['segment']
        accounts = ';'.join(client['accounts'])

        # Аномалия: название компании в другом формате
        if idx in alt_company_indices and company_name:
            company_name = _alt_company_name(company_name)
            stats['alt_company'] += 1

        # Аномалия: ФИО в другом порядке
        if idx in alt_name_indices:
            contact_name = _alt_contact_name(contact_name)
            stats['alt_name'] += 1

        # Аномалия: устаревший email
        if idx in stale_email_indices:
            domain = random.choice(EMAIL_DOMAINS_B2C)
            email = f'{fake.last_name().lower()}{random.randint(1, 999)}@{domain}'
            stats['stale_email'] += 1

        # Аномалия: пустые лицевые счета
        if idx in empty_acc_indices:
            accounts = ''
            stats['empty_accounts'] += 1

        # Аномалия: неправильный сегмент
        if idx in wrong_segment_indices:
            segment = 'B2C' if segment == 'B2B' else 'B2B'
            stats['wrong_segment'] += 1

        # Статус
        status = 'active'
        last_activity = date(2025, random.randint(10, 12), random.randint(1, 28))
        if random.random() < 0.08:
            status = 'churned'
            last_activity = date(2025, random.randint(1, 6), random.randint(1, 28))

        rows.append({
            'client_id': client['client_id'],
            'segment': segment,
            'company_name': company_name,
            'contact_name': contact_name,
            'inn': inn,
            'phone': phone,
            'email': email,
            'region': client['region'],
            'manager': client['manager'],
            'contract_date': client['contract_date'],
            'account_numbers': accounts,
            'status': status,
            'last_activity_date': last_activity.isoformat(),
        })

    # Дубли
    for dup_idx in dup_indices:
        original = rows[dup_idx].copy()
        original['client_id'] = f'CLT-{8000 + dup_idx:06d}'
        original['status'] = 'churned'
        original['last_activity_date'] = date(2024, random.randint(1, 12), random.randint(1, 28)).isoformat()
        rows.append(original)
        stats['duplicates'] += 1

    # Prospects
    prospects = _generate_prospects(35)
    stats['prospects'] = len(prospects)
    rows.extend(prospects)

    random.shuffle(rows)

    df = pd.DataFrame(rows)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, 'crm_clients.csv')
    df.to_csv(output_path, sep=';', index=False, encoding='utf-8-sig')

    file_size = os.path.getsize(output_path) / (1024 * 1024)

    print('=== Генерация CRM клиентов ===')
    print(f'Из shared_clients: {stats["total_from_shared"]}')
    print(f'Исключено B2C (нет в CRM): {stats["excluded_b2c"]}')
    print(f'Дубли: {stats["duplicates"]}')
    print(f'Prospects: {stats["prospects"]}')
    print(f'Название компании изменено: {stats["alt_company"]}')
    print(f'ФИО изменено: {stats["alt_name"]}')
    print(f'Неправильный сегмент: {stats["wrong_segment"]}')
    print(f'Устаревший email: {stats["stale_email"]}')
    print(f'Пустые лицевые счета: {stats["empty_accounts"]}')
    print(f'Итого записей: {len(rows)}')
    print(f'Файл: {output_path} ({file_size:.2f} MB)')


if __name__ == '__main__':
    generate_crm()
